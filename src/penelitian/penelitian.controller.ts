import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  Query,
  Delete,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';
import { CreatePenelitianDto } from './dto/create-penelitian.dto';
import { PenelitianService } from './penelitian.service';

@Controller('penelitian')
export class PenelitianController {
  constructor(private readonly penelitianService: PenelitianService) {}

  @Post()
  async createPenelitian(@Body() createPenelitianDto: CreatePenelitianDto) {
    return this.penelitianService.createPenelitian(createPenelitianDto);
  }

  @Get()
  async findAll(
    @Query('search') search: string = '',
    @Query('page') pageStr: string = '1',
    @Query('limit') limitStr: string = '50',
  ) {
    const page = parseInt(pageStr, 10);
    const limit = parseInt(limitStr, 10);
    return this.penelitianService.findAll({ search, page, limit });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.penelitianService.findOne(+id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() createPenelitianDto: CreatePenelitianDto) {
    return this.penelitianService.update(+id, createPenelitianDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.penelitianService.delete(+id);
  }

  @Post('upload-csv')
  @UseInterceptors(FileInterceptor('file', {
    storage: multer.memoryStorage(),
  }))
  async uploadCSV(@UploadedFile() file: Express.Multer.File) {
    return this.penelitianService.importFromCSV(file.buffer);
  }
}
