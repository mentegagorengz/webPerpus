import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { addWeeks } from 'date-fns'; // Import date-fns untuk date manipulation
import * as QRCode from 'qrcode'; // 🆕 Tambahkan

@Injectable()
export class TransactionService {
  constructor(private readonly prisma: PrismaService) {}

  async createTransaction(createTransactionDto: CreateTransactionDto) {
    const { userId, bookId } = createTransactionDto;

    // ✅ Cek apakah buku sedang dipinjam oleh user ini
    const existing = await this.prisma.transaction.findFirst({
      where: {
        userId,
        bookId,
        status: {
          in: ['pending', 'borrowed'],
        },
      },
    });

    if (existing) {
      throw new Error('Anda sudah meminjam buku ini.');
    }

    // ✅ Cek stok buku
    const book = await this.prisma.book.findUnique({ where: { id: bookId } });
    if (!book) {
      throw new NotFoundException('Buku tidak ditemukan');
    }
    if (book.availability <= 0) {
      throw new Error('Buku tidak tersedia untuk dipinjam.');
    }

    // ✅ Buat transaksi langsung sebagai borrowed
    const borrowDate = new Date();
    const dueDate = addWeeks(borrowDate, 1);

    const transaction = await this.prisma.transaction.create({
      data: {
        userId,
        bookId,
        borrowDate,
        dueDate,
        status: 'pending-pickup',
      },
    });

    // 🆕 Generate QR dari transaction.id
    const qrData = `${transaction.id}`;
    const qrCodeBase64 = await QRCode.toDataURL(qrData);

    // 🧠 Update transaksi untuk menyimpan QR ke database
    const updatedTransaction = await this.prisma.transaction.update({
      where: { id: transaction.id },
      data: {
        qrCode: qrCodeBase64,
      },
      include: {
        Book: true,
        User: true,
      },
    });

    // ✅ Kurangi stok buku
    await this.prisma.book.update({
      where: { id: bookId },
      data: {
        availability: { decrement: 1 },
      },
    });

    return updatedTransaction;
  }

  async findAllTransactions() {
    return this.prisma.transaction.findMany({
      include: {
        Book: true, // Menyertakan informasi buku
        User: true,  // Menyertakan informasi pengguna
      },
    });
  }

  async findTransactionById(id: number) {
    return this.prisma.transaction.findUnique({
      where: { id },
      include: {
        Book: true, // Menyertakan informasi buku
        User: true,  // Menyertakan informasi pengguna
      },
    });
  }

  async findTransactionsByUserId(userId: number) {
    return this.prisma.transaction.findMany({
      where: { userId },
      include: {
        Book: true,
        User: true, // Menyertakan informasi pengguna
      },
      orderBy: { borrowDate: 'desc' },
    });
  }

  // 🔁 Untuk admin konfirmasi
  async updateStatus(id: number, newStatus: string) {
    const transaction = await this.prisma.transaction.findUnique({ where: { id } });
    if (!transaction) throw new Error('Transaksi tidak ditemukan');

    if (newStatus === 'borrowed') {
      if (transaction.status !== 'pending-pickup') throw new Error('Transaksi harus dalam status pending-pickup');
      return this.prisma.transaction.update({
        where: { id },
        data: {
          status: 'borrowed',
          pickupAt: new Date(), // ✅ simpan waktu pickup
        },
      });
    }

    if (newStatus === 'returned') {
      if (transaction.status !== 'borrowed') throw new Error('Transaksi harus dalam status borrowed');
      return this.prisma.transaction.update({
        where: { id },
        data: {
          status: 'returned',
          returnedAt: new Date(), // ✅ simpan waktu return
        },
      });
    }

    throw new Error('Status tidak valid');
  }

  // 🔁 Untuk user kembalikan buku
  async returnBook(id: number, userId: number) {
    const existing = await this.prisma.transaction.findUnique({
      where: { id },
    });

    const returnDate = new Date();
    let overdueDays = 0;
    let fine = 0;

    if (existing?.dueDate && returnDate > existing.dueDate) {
      overdueDays = Math.ceil(
        (returnDate.getTime() - existing.dueDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      fine = overdueDays * 1000; // contoh: 1000 rupiah per hari
    }

    return this.prisma.transaction.update({
      where: { id },
      data: {
        returnDate,
        overdueDays,
        fine,
        status: 'returned',
      },
    });
  }

  async scanQRCode(id: number) {
    // Cek apakah transaksi valid dan belum diselesaikan
    const transaction = await this.prisma.transaction.findUnique({ where: { id } });

    if (!transaction) throw new NotFoundException("Transaksi tidak ditemukan");
    if (transaction.status !== 'borrowed') {
      // Mungkin sudah dikembalikan atau bukan status valid untuk scan
      throw new Error("QR tidak valid atau transaksi sudah selesai.");
    }

    // Update status atau catatan lain sesuai kebutuhan
    return this.prisma.transaction.update({
      where: { id },
      data: {
        status: "verified", // Atau status lain sesuai flow kamu
      },
    });
  }

  async countOverdueTransactions(): Promise<number> {
    const today = new Date();
    return this.prisma.transaction.count({
      where: {
        status: 'borrowed',
        dueDate: { lt: today }, // ⬅️ artinya: sudah lewat dari hari ini
      },
    });
  }

  async getOverdueData() {
    return this.prisma.transaction.findMany({
      where: {
        dueDate: { lt: new Date() },
        status: { in: ['borrowed', 'overdue-notified'] },
      },
      include: {
        User: true,
        Book: true,
      },
      orderBy: {
        dueDate: 'asc',
      },
    });
  }

  async getBorrowedBooks() {
    return this.prisma.transaction.findMany({
      where: {
        status: {
          in: ['borrowed', 'pending-pickup', 'overdue-notified'],
        },
      },
      include: {
        User: true,
        Book: true,
      },
      orderBy: {
        borrowDate: 'desc',
      },
    });
  }

  async getAllTransactions() {
    return this.prisma.transaction.findMany({
      include: {
        User: true,
        Book: true,
      },
      orderBy: {
        borrowDate: 'desc',
      },
    });
  }
}


