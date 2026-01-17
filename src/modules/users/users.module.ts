import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {UsersEntity} from "./entities/users.entity";
import {TransactionEntity} from "./entities/transaction.entity";
import {UsersService} from "./services/users.service";
import {UsersController} from "./controllers/users.controller";


@Module({
    imports: [TypeOrmModule.forFeature([UsersEntity, TransactionEntity])],
    controllers: [UsersController],
    providers: [UsersService],
})
export class UsersModule {}
