import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStaffDto } from './dto/create-staff.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (!user) return null;

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return null;

    const { password: _, ...result } = user;
    return result;
  }

  async validateStaff(email: string, password: string): Promise<any> {
    const staff = await this.prisma.staff.findUnique({ where: { email } });
    if (!staff) return null;

    const isPasswordValid = await bcrypt.compare(password, staff.password);
    if (!isPasswordValid) return null;

    const { password: _, ...result } = staff;
    return result;
  }

  async registerStaff(createStaffDto: CreateStaffDto & { username: string; role: string }) {
    const hashedPassword = await bcrypt.hash(createStaffDto.password, 10);
    return this.prisma.staff.create({
      data: {
        email: createStaffDto.email,
        password: hashedPassword,
        fullName: createStaffDto.fullName,
        username: createStaffDto.username,
        role: createStaffDto.role,
      },
    });
  }

  async resetUserPassword(email: string, newPassword: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new UnauthorizedException('Email tidak ditemukan');

    const hashed = await bcrypt.hash(newPassword, 10);
    return this.usersService.update(user.id, { password: hashed });
  }

  async changeUserPasswordByAdmin(userId: number, newPassword: string) {
    const hashed = await bcrypt.hash(newPassword, 10);
    return this.usersService.update(userId, { password: hashed });
  }
}
