import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import {getTypeOrmConfig} from "./core/config/typeOrm.config";
import {UsersModule} from "./modules/users/users.module";

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        TypeOrmModule.forRoot(getTypeOrmConfig()),
        UsersModule,
    ],
})
export class AppModule {}
