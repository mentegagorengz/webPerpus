import { IsInt, IsNotEmpty } from 'class-validator';

export class CreateTransactionDto {
  @IsInt()
  @IsNotEmpty()
  userId: number;

  @IsInt()
  @IsNotEmpty()
  bookId: number;
}
