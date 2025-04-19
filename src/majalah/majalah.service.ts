import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMajalahDto } from './dto/create-majalah.dto';
import { Prisma } from '@prisma/client';


@Injectable()
export class MajalahService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createMajalahDto: CreateMajalahDto) {
    return this.prisma.majalah.create({
      data: {
        ...createMajalahDto,
        createdAt: new Date(), // Add a timestamp for creation
      },
    });
  }

  async findAll(search?: string, page = 1, limit = 50) {
    const where = search
      ? {
          OR: [
            { title: { contains: search, mode: Prisma.QueryMode.insensitive
            } }, // Use QueryMode.INSENSITIVE
            { subject: { contains: search, mode: Prisma.QueryMode.insensitive
            } }, // Use QueryMode.INSENSITIVE
          ],
        }
      : {};

    const [items, total] = await Promise.all([
      this.prisma.majalah.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { title: 'asc' },
      }),
      this.prisma.majalah.count({ where }),
    ]);

    return {
      data: items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findAllPaginated(params: { search?: string; page: number; limit: number }) {
    const { search, page, limit } = params;

    const where = search
      ? {
          OR: [
            { title: { contains: search, mode: Prisma.QueryMode.insensitive } },
            { issn: { contains: search, mode: Prisma.QueryMode.insensitive } },
            { city: { contains: search, mode: Prisma.QueryMode.insensitive } },
          ],
        }
      : {};

    const [data, total] = await this.prisma.$transaction([
      this.prisma.majalah.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { id: 'desc' },
      }),
      this.prisma.majalah.count({ where }),
    ]);

    return {
      data,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: number) {
    return this.prisma.majalah.findUnique({
      where: { id },
    });
  }

  async update(id: number, updateMajalahDto: CreateMajalahDto) {
    return this.prisma.majalah.update({
      where: { id },
      data: updateMajalahDto,
    });
  }

  async remove(id: number) {
    return this.prisma.majalah.delete({
      where: { id },
    });
  }

  async importFromCSV(buffer: Buffer): Promise<void> {
    const csvData = buffer.toString('utf-8');
    const records = this.parseCSV(csvData);
    for (const record of records) {
      await this.prisma.majalah.create({
        data: record,
      });
    }
  }

  private parseCSV(data: string): any[] {
    // Logic to parse CSV data into an array of objects
    // Example: Use a library like 'csv-parse' or custom logic
    return []; // Replace with actual parsing logic
  }
}
