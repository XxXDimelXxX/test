import {IsInt, Min} from 'class-validator';
import {Type} from "class-transformer";

export class CreateTransactionParamsDto {
  @Type(() => Number)
  @IsInt()
  @Min(0)
  userId: number;
}
