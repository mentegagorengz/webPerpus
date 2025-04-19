import { IsEmail, IsString, IsNotEmpty, IsDateString } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  nim: string;

  @IsString()
  address: string;

  @IsDateString()
  birthDate: string; // Format tanggal harus sesuai

  @IsString()
  faculty: string;

  @IsString()
  fullName: string;

  @IsString()
  gender: string;

  @IsString()
  phoneNumber: string;

  // Tambahkan properti lain sesuai kebutuhan
}
