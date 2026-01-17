import { Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {TransactionEntity} from "../entities/transaction.entity";
import {UsersEntity} from "../entities/users.entity";
import {ShowUserParamsDto} from "../dto/show/showUser.params.dto";
import {CreateTransactionParamsDto} from "../dto/transaction/createTransaction.params.dto";
import {CreateTransactionBodyDto} from "../dto/transaction/createTransaction.body.dto";


@Injectable()
export class UsersService {
    constructor(
        private readonly dataSource: DataSource,
        @InjectRepository(UsersEntity)
        private readonly usersRepo: Repository<UsersEntity>,
    ) {
    }

    async showUser(params: ShowUserParamsDto) {
        const user = await this.usersRepo.findOne({ where: { id: params.userId } });
        if (!user) throw new NotFoundException('User not found');

        return {
            id: user.id,
            // Balance is returned in cents
            balance: user.balance,
        };
    }

    /**
     * Adds a new transaction (ledger row) and recalculates aggregated user balance as SUM(transactions).
     *
     * Amount is a signed integer in cents.
     * Transaction id is provided by the frontend (IK) and is used for idempotency.
     */
    async createTransaction(params: CreateTransactionParamsDto, body: CreateTransactionBodyDto) {
      const { userId } = params;
      const { id, amount } = body;

      return this.dataSource.transaction(async (manager) => {
        // Lock user row to serialize concurrent balance recalculations
        const user = await manager
          .getRepository(UsersEntity)
          .createQueryBuilder('u')
          .setLock('pessimistic_write')
          .where('u.id = :id', { id: userId })
          .getOne();

        if (!user) throw new NotFoundException('User not found');

        // Idempotency: if transaction already exists, do not insert again
        const existingTx = await manager.getRepository(TransactionEntity).findOne({ where: { id } });

        if (!existingTx) {
          const tx = manager.getRepository(TransactionEntity).create({
            id,
            userId,
            amount: String(amount),
          });
          await manager.getRepository(TransactionEntity).save(tx);
        }

        const raw = await manager.getRepository(TransactionEntity)
          .createQueryBuilder('t')
          .select('COALESCE(SUM(t.amount), 0)', 'sum')
          .where('t.userId = :userId', { userId })
          .getRawOne<{ sum: string }>();

        const nextBalance = raw?.sum ?? '0';

        // Prevent negative balance (same behavior as "insufficient funds")
        if (BigInt(nextBalance) < 0n) {
          throw new UnprocessableEntityException('Insufficient funds');
        }

        user.balance = nextBalance;
        await manager.getRepository(UsersEntity).save(user);

        return {
          ok: true,
          idempotent: !!existingTx,
          userId,
          balance: user.balance,
          transactionId: id,
        };
      });
    }
}
