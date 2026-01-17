import { IsNumberString, Min} from 'class-validator';

export class ShowUserParamsDto {
  @IsNumberString()
  @Min(1)
  userId: number;
}