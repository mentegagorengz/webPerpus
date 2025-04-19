import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; // Pastikan untuk mengimpor PrismaService
import { CreateBookDto } from './dto/create-book.dto';
import * as csvParser from 'csv-parser';
import { Readable } from 'stream';
import { Prisma } from '@prisma/client'; // Tambahkan import ini di paling atas
import { UpdateBookDto } from './dto/update-book.dto';

@Injectable()
export class BooksService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createBookDto: CreateBookDto) {
    return this.prisma.book.create({
      data: {
        ...createBookDto,
        availability: createBookDto.availability ?? 1,
        totalCopies: createBookDto.totalCopies ?? 1,
      },
    });
  }

  async importFromCSV(buffer: Buffer) {
    const results = [];
    const stream = Readable.from(buffer.toString());

    return new Promise((resolve, reject) => {
      stream
        .pipe(csvParser())
        .on('data', (data) => results.push(data))
        .on('end', async () => {
          const books = results.map((item) => ({
            title: item['Judul'] || '',
            isbn: item['ISBN'] !== '-' ? item['ISBN'] : null,
            classificationNumber: item['No. Klasifikasi'] || null,
            category: item['Golongan'] || null,
            mainAuthor: item['Pengarang Utama'] !== '-' ? item['Pengarang Utama'] : null,
            additionalAuthors: item['Pengarang Tambahan'] !== '-' ? item['Pengarang Tambahan'] : null,
            subject: item['Subyek'] || null,
            edition: item['Edisi'] || null,
            location: item['Kota'] || null,
            publisher: item['Penerbit'] || null,
            description: item['Deskripsi'] || null,
            condition: item['Jenis'] || 'Baik',
            bibliography: item['Bibliografi'] || null,
            generalNotes: item['Catatan Umum'] || null,
            remarks: item['Keterangan'] || null,
            year: item['Tahun'] ? parseInt(item['Tahun']) : null,
            availability: item['Availability'] ? parseInt(item['Availability']) : 1,
            totalCopies: item['Total Copies'] ? parseInt(item['Total Copies']) : 1,
          }));

          await this.prisma.book.createMany({
            data: books,
            skipDuplicates: true,
          });

          resolve({ message: 'Import berhasil', jumlah: books.length });
        })
        .on('error', reject);
    });
  }

  async findAll(search?: string, page?: number | null, limit?: number | null) {
    const where: Prisma.BookWhereInput = search?.trim()
      ? {
          OR: [
            { title: { contains: search, mode: Prisma.QueryMode.insensitive } },
            { mainAuthor: { contains: search, mode: Prisma.QueryMode.insensitive } },
            { isbn: { contains: search, mode: Prisma.QueryMode.insensitive } },
          ],
        }
      : {};

    // Jika page dan limit diberikan (admin)
    if (page && limit) {
      const [items, total] = await Promise.all([
        this.prisma.book.findMany({
          where,
          skip: (page - 1) * limit,
          take: limit,
          orderBy: { title: 'asc' },
        }),
        this.prisma.book.count({ where }),
      ]);

      return {
        data: items,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    }

    // Jika tidak pakai pagination (user)
    const books = await this.prisma.book.findMany({
      where,
      orderBy: { title: 'asc' },
    });

    return { data: books };
  }

  async update(id: number, updateBookDto: UpdateBookDto) {
    return this.prisma.book.update({
      where: { id },
      data: updateBookDto,
    });
  }

  async remove(id: number) {
    return this.prisma.book.delete({
      where: { id },
    });
  }

  // Tambahkan metode lain sesuai kebutuhan, seperti find, update, delete, dll.
}
