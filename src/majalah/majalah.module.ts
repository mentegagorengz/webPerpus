import { Module } from '@nestjs/common';
import { MajalahController } from './majalah.controller';
import { MajalahService } from './majalah.service';
import { PrismaModule } from '../prisma/prisma.module'; // Pastikan untuk mengimpor PrismaModule

@Module({
  imports: [PrismaModule],
  controllers: [MajalahController],
  providers: [MajalahService],
})
export class MajalahModule {}
