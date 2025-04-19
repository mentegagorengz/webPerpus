import { IsString, IsNotEmpty, IsOptional, IsNumber, IsInt } from 'class-validator';

export class CreateBookDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsOptional()
  @IsString()
  isbn?: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsString()
  additionalAuthors?: string;

  @IsOptional()
  @IsInt()
  availability?: number;

  @IsOptional()
  @IsString()
  bibliography?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  classificationNumber?: string;

  @IsOptional()
  @IsString()
  condition?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  digitalContent?: string;

  @IsOptional()
  @IsString()
  edition?: string;

  @IsOptional()
  @IsString()
  generalNotes?: string;

  @IsOptional()
  @IsString()
  language?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  mainAuthor?: string;

  @IsOptional()
  @IsString()
  subject?: string;

  @IsOptional()
  @IsString()
  publisher?: string;

  @IsOptional()
  @IsString()
  remarks?: string;

  @IsOptional()
  @IsInt()
  totalCopies?: number;

  @IsOptional()
  @IsInt()
  year?: number;
}
