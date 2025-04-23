import { Controller, Post, Body, UnauthorizedException, Res, Get, Req, UseGuards, Put, Param } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { StaffLoginDto } from './dto/staff-login.dto';
import { CreateStaffDto } from './dto/create-staff.dto';
import { Response, Request } from 'express';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService
  ) {}

  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.authService.validateUser(loginDto.email, loginDto.password);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const payload = { userId: user.id, email: user.email, role: 'user' };
    const token = this.jwtService.sign(payload);

    res.cookie('access_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24,
    });

    return { message: 'Login berhasil' };
  }

  @Post('staff/login')
async staffLogin(
  @Body() staffLoginDto: StaffLoginDto,
  @Res({ passthrough: true }) res: Response
) {
  console.log("Login attempt:", staffLoginDto);

  const staff = await this.authService.validateStaff(
    staffLoginDto.email,
    staffLoginDto.password
  );

  if (!staff) {
    console.log("❌ Invalid credentials");
    throw new UnauthorizedException('Invalid credentials');
  }

  const payload = {
    userId: staff.id,
    email: staff.email,
    role: staff.role.toLowerCase().trim(),
  };

  const token = this.jwtService.sign(payload);

  res.cookie('access_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 1000 * 60 * 60 * 24,
  });

  console.log("✅ Staff login success, token set.");

  return res.status(200).json({ message: 'Login staff berhasil', role: staff.role });
}


  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('access_token');
    return { message: 'Logout berhasil' };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  getMe(@Req() req: Request) {
    return req['user'];
  }

  @Post('register-staff')
  async registerStaff(@Body() createStaffDto: CreateStaffDto) {
    return this.authService.registerStaff(createStaffDto);
  }

  @Post('reset-password')
  async resetPassword(@Body() body: { email: string; newPassword: string }) {
    return this.authService.resetUserPassword(body.email, body.newPassword);
  }

  @UseGuards(JwtAuthGuard)
  @Put('admin-change-password/:userId')
  async adminChangePassword(
    @Param('userId') userId: string,
    @Body() body: { newPassword: string }
  ) {
    return this.authService.changeUserPasswordByAdmin(+userId, body.newPassword);
  }
}
