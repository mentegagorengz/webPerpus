import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Query,
  Delete,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';
import { MajalahService } from './majalah.service';
import { CreateMajalahDto } from './dto/create-majalah.dto';
import { Majalah } from '@prisma/client';

@Controller('majalah')
export class MajalahController {
  constructor(private readonly majalahService: MajalahService) {}

  @Post()
  async create(@Body() dto: CreateMajalahDto) {
    return this.majalahService.create(dto);
  }

  @Get()
  async findAll(
    @Query('search') search: string = '',
    @Query('page') pageStr: string = '1',
    @Query('limit') limitStr: string = '50',
  ) {
    const page = parseInt(pageStr, 10);
    const limit = parseInt(limitStr, 10);
    return this.majalahService.findAllPaginated({ search, page, limit });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.majalahService.findOne(+id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: CreateMajalahDto) {
    return this.majalahService.update(+id, dto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<Majalah> {
    return this.majalahService.remove(+id);
  }

  @Post('import-csv')
  @UseInterceptors(FileInterceptor('file'))
  async importFromCSV(@UploadedFile() file: Express.Multer.File): Promise<void> {
    return this.majalahService.importFromCSV(file.buffer);
  }
}
