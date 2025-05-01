import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'; // ✅
import config from './config'; // ambil config dinamis (dev/prod)

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { BookModule } from './book/books.module';
import { TransactionModule } from './transaction/transaction.module';
import { PenelitianModule } from './penelitian/penelitian.module';
import { MajalahModule } from './majalah/majalah.module';
import { EmailModule } from './email/email.module';
import { DashboardModule } from './dashboard/dashboard.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config], // 💡 gunakan dynamic config
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`, // 📁 baca env otomatis
    }),
    AuthModule,
    UsersModule,
    BookModule,
    TransactionModule,
    PenelitianModule,
    MajalahModule,
    EmailModule,
    DashboardModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
