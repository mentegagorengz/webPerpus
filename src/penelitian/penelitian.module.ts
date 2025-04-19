import { Module } from '@nestjs/common';
import { PenelitianController } from './penelitian.controller';
import { PenelitianService } from './penelitian.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PenelitianController],
  providers: [PenelitianService],
})
export class PenelitianModule {}
