import { Module } from '@nestjs/common';
import { BookController } from './books.controller';
import { BooksService } from './books.service';
import { PrismaModule } from '../prisma/prisma.module'; // Pastikan untuk mengimpor PrismaModule

@Module({
  imports: [PrismaModule],
  controllers: [BookController],
  providers: [BooksService],
})
export class BookModule {}
