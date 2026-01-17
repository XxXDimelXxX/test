import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import {UsersService} from "../services/users.service";
import {ShowUserParamsDto} from "../dto/show/showUser.params.dto";
import {CreateTransactionBodyDto} from "../dto/transaction/createTransaction.body.dto";
import {CreateTransactionParamsDto} from "../dto/transaction/createTransaction.params.dto";


@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get(':userId')
    async showUser(@Param() params: ShowUserParamsDto ) {
        return await this.usersService.showUser(params);
    }

  @Post(':userId/transactions')
  async createTransaction(
    @Param() params: CreateTransactionParamsDto,
    @Body() body: CreateTransactionBodyDto,
  ) {
    return this.usersService.createTransaction(params, body);
  }
}
