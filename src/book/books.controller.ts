import {
  Controller,
  Post,
  Body,
  UploadedFile,
  UseInterceptors,
  Get,
  Query,
  Put,
  Param,
  Delete,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { BooksService } from './books.service';

@Controller('book')
export class BookController {
  constructor(private readonly booksService: BooksService) {}

  @Post()
  async create(@Body() createBookDto: CreateBookDto) {
    return this.booksService.create(createBookDto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateBookDto: UpdateBookDto) {
    return this.booksService.update(+id, updateBookDto);
  }

  @Post('upload-csv')
  @UseInterceptors(FileInterceptor('file', {
    storage: multer.memoryStorage(),
  }))
  async uploadCSV(@UploadedFile() file: Express.Multer.File) {
    return this.booksService.importFromCSV(file.buffer);
  }

  @Get()
  async findAll(
    @Query('search') search?: string,
    @Query('page') pageStr?: string,
    @Query('limit') limitStr?: string,
  ) {
    const isUserRequest = !pageStr && !limitStr;

    const page = parseInt(pageStr || "1", 10);
    const limit = parseInt(limitStr || "50", 10);

    return this.booksService.findAll(search, isUserRequest ? null : page, isUserRequest ? null : limit);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.booksService.remove(+id);
  }
}
