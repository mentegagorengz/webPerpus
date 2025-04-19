import { IsEmail, IsString, IsNotEmpty } from 'class-validator';

export class CreateStaffDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsString()
  @IsNotEmpty()
  role: string; // Misalnya, "admin", "editor", dll.
}
