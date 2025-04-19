import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module'; // Pastikan untuk mengimpor UsersModule
import { PrismaModule } from '../prisma/prisma.module'; // Impor PrismaModule
import { JwtStrategy } from './jwt.strategy'; // Import JwtStrategy

@Module({
  imports: [
    UsersModule,
    PrismaModule, // Tambahkan PrismaModule di sini
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secretkey', // Update secret key
      signOptions: { expiresIn: '1d' }, // Update token expiration
    }),
  ],
  providers: [AuthService, JwtStrategy], // Add JwtStrategy to providers
  controllers: [AuthController],
})
export class AuthModule {}
