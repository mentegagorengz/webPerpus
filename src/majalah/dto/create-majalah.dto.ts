import { Optional } from '@nestjs/common';
import { IsString, IsOptional } from 'class-validator';

export class CreateMajalahDto {
  @IsOptional()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  issn?: string;

  @IsOptional()
  @IsString()
  code?: string;

  @IsOptional()
  @IsString()
  language?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  year?: string;

  @IsOptional()
  @IsString()
  frequency?: string;

  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsString()
  subject?: string;

  @IsOptional()
  @IsString()
  publisher?: string;

  @IsOptional()
  @IsString()
  edition?: string;

  @IsOptional()
  @IsString()
  volume?: string;

  @IsOptional()
  @IsString()
  availability?: string;
}
