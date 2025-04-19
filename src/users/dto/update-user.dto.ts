import { IsEmail, IsString, IsOptional, IsDateString } from 'class-validator';

export class UpdateUserDto {
  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  password?: string;

  @IsString()
  @IsOptional()
  nim?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsDateString()
  @IsOptional()
  birthDate?: string;

  @IsString()
  @IsOptional()
  faculty?: string;

  @IsString()
  @IsOptional()
  fullName?: string;

  @IsString()
  @IsOptional()
  gender?: string;

  @IsString()
  @IsOptional()
  phoneNumber?: string;

  // Tambahkan properti lain sesuai kebutuhan
}
