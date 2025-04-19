import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailController } from './email.controller';
import { PrismaModule } from '../prisma/prisma.module'; // Added import

@Module({
  imports: [PrismaModule], // Added PrismaModule to imports
  providers: [EmailService],
  exports: [EmailService],
  controllers: [EmailController],
})
export class EmailModule {}
