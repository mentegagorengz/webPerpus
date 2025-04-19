import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePenelitianDto } from './dto/create-penelitian.dto';
import { Prisma } from '@prisma/client';
import * as csv from 'csv-parser';
import { Readable } from 'stream';

@Injectable()
export class PenelitianService {
  constructor(private readonly prisma: PrismaService) {}

  async createPenelitian(createPenelitianDto: CreatePenelitianDto) {
    try {
      return this.prisma.penelitian.create({
        data: createPenelitianDto,
      });
    } catch (error) {
      console.error('Error creating Penelitian:', error);
      throw error;
    }
  }

  async findAllPaginated(search: string, page: number, limit: number) {
    const where = search
      ? {
          OR: [
            { title: { contains: search, mode: Prisma.QueryMode.insensitive } },
            { main_author: { contains: search, mode: Prisma.QueryMode.insensitive } },
            { keywords: { contains: search, mode: Prisma.QueryMode.insensitive } },
          ],
        }
      : {};

    const [data, total] = await this.prisma.$transaction([
      this.prisma.penelitian.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { id: 'desc' },
      }),
      this.prisma.penelitian.count({ where }),
    ]);

    return {
      data,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findAll(params: { search?: string; page: number; limit: number }) {
    const { search, page, limit } = params;

    const where = search
      ? {
          OR: [
            { title: { contains: search, mode: Prisma.QueryMode.insensitive } },
            { main_author: { contains: search, mode: Prisma.QueryMode.insensitive } },
            { keywords: { contains: search, mode: Prisma.QueryMode.insensitive } },
          ],
        }
      : {};

    const [data, total] = await this.prisma.$transaction([
      this.prisma.penelitian.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { id: 'desc' },
      }),
      this.prisma.penelitian.count({ where }),
    ]);

    return {
      data,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: number) {
    return this.prisma.penelitian.findUnique({
      where: { id },
    });
  }

  async update(id: number, createPenelitianDto: CreatePenelitianDto) {
    return this.prisma.penelitian.update({
      where: { id },
      data: createPenelitianDto,
    });
  }

  async delete(id: number) {
    return this.prisma.penelitian.delete({
      where: { id },
    });
  }

  async importFromCSV(buffer: Buffer): Promise<{ created: number; skipped: number }> {
    const records: any[] = [];

    await new Promise((resolve, reject) => {
      Readable.from(buffer.toString())
        .pipe(csv())
        .on('data', (data) => records.push(data))
        .on('end', resolve)
        .on('error', reject);
    });

    let created = 0;
    let skipped = 0;

    for (const data of records) {
      const exists = await this.prisma.penelitian.findFirst({
        where: {
          title: data['Judul'],
          main_author: data['Pengarang Utama'],
        },
      });

      if (!exists) {
        await this.prisma.penelitian.create({
          data: {
            title: data['Judul'],
            no_ddc: data['DDC'],
            main_author: data['Pengarang Utama'],
            additional_author: data['Pengarang Tambahan'],
            additional_author_conference: data['Pengarang Tambahan Komprensi'],
            additional_author_person: data['Pengarang Tambahan Orang'],
            physical_description: data['Deskripsi'],
            bibliography: data['Bibliografi'],
            keywords: data['Kata Kunci'],
            language: data['Bahasa'],
            publisher: data['Impresum'],
            body: data['Badan'],
            additional_body: data['Badan Tambahan'],
            digital_content: data['Link File'],
            inventory_number: null,
            provider: null,
            location: null,
            availability: 'Tersedia',
            notes: data['Catatan'],
            remarks: data['Keterangan'],
          },
        });
        created++;
      } else {
        skipped++;
      }
    }

    return { created, skipped };
  }
}
