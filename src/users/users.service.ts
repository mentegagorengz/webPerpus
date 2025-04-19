import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; // Pastikan PrismaService diimpor
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    // Validate required fields
    if (!createUserDto.email || !createUserDto.password || !createUserDto.fullName || !createUserDto.birthDate) {
      throw new Error('Missing required fields: email, password, fullName, or birthDate');
    }

    // Hash password sebelum menyimpan
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    // Simpan pengguna dengan password yang sudah di-hash
    return this.prisma.user.create({
      data: {
        ...createUserDto,
        password: hashedPassword, // Simpan password yang sudah di-hash
        birthDate: new Date(createUserDto.birthDate), // ✅ Fix: convert string to Date
      },
    });
  }

  async findOne(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findAll() {
    return this.prisma.user.findMany({
      orderBy: { fullName: 'asc' }, // Optional: bisa disesuaikan
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    // Validate required fields
    if (!updateUserDto.email && !updateUserDto.fullName && !updateUserDto.birthDate) {
      throw new Error('At least one field (email, fullName, or birthDate) must be provided for update');
    }

    return this.prisma.user.update({
      where: { id },
      data: {
        ...updateUserDto,
        birthDate: updateUserDto.birthDate ? new Date(updateUserDto.birthDate) : undefined, // ✅ convert string to Date
      },
    });
  }

  async remove(id: number) {
    return this.prisma.user.delete({
      where: { id },
    });
  }
}
