import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import {UsersEntity} from "../../modules/users/entities/users.entity";
import {TransactionEntity} from "../../modules/users/entities/transaction.entity";

export function getTypeOrmConfig(): TypeOrmModuleOptions {
    return {
        type: 'postgres',
        host: process.env.DB_HOST ?? 'localhost',
        port: Number(process.env.DB_PORT ?? 5436),
        username: process.env.DB_USER ?? 'postgres',
        password: process.env.DB_PASS ?? '',
        database: process.env.DB_NAME ?? 'testG',
        entities: [UsersEntity, TransactionEntity],
        synchronize: true,
        logging: false,
    };
}
