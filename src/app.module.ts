import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { BookModule } from './book/books.module';
import { TransactionModule } from './transaction/transaction.module';
import { PenelitianModule } from './penelitian/penelitian.module';
import { MajalahModule } from './majalah/majalah.module';
import { EmailModule } from './email/email.module';
import { TransactionController } from './transaction/transaction.controller';
import { ConfigModule } from '@nestjs/config'; // ✅ Tambahkan ini
import { DashboardModule } from './dashboard/dashboard.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // ✅ Tambahkan ini
    AuthModule,
    UsersModule,
    BookModule,
    TransactionModule,
    PenelitianModule,
    MajalahModule,
    EmailModule,
    DashboardModule,
  ],
  controllers: [AppController, TransactionController],
  providers: [AppService],
})
export class AppModule {}
