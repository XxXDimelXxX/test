import {IsInt, IsString, IsUUID} from 'class-validator';

export class CreateTransactionBodyDto {
  /** Frontend-generated idempotency key (IK). */
  @IsString()
  id: string;

  /** Signed amount in cents. */
  @IsInt()
  amount: number;
}
