import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { startOfDay, endOfDay } from 'date-fns';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getDashboardData() {
    const todayStart = startOfDay(new Date());
    const todayEnd = endOfDay(new Date());

    // Hitung buku
    const totalBooks = await this.prisma.book.count();
    const borrowedBooks = await this.prisma.transaction.count({
      where: { status: 'borrowed' },
    });
    const availableBooks = totalBooks - borrowedBooks;

    // Hitung transaksi
    const transactionsToday = await this.prisma.transaction.count({
      where: {
        createdAt: {
          gte: todayStart,
          lte: todayEnd,
        },
      },
    });

    const totalTransactions = await this.prisma.transaction.count();

    // Ambil transaksi terbaru
    const recentTransactions = await this.prisma.transaction.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: {
        Book: true,
        User: true,
      },
    });

    // Buku terpopuler
    const popularBooks = await this.prisma.transaction.groupBy({
      by: ['bookId'],
      _count: { bookId: true },
      orderBy: { _count: { bookId: 'desc' } },
      take: 5,
    });

    const booksWithTitle = await Promise.all(
      popularBooks.map(async (entry) => {
        const book = await this.prisma.book.findUnique({
          where: { id: entry.bookId },
        });
        return {
          title: book?.title ?? 'Unknown',
          borrowCount: entry._count.bookId,
        };
      }),
    );

    // Cari transaksi yang telat
    const overdueTransactions = await this.prisma.transaction.findMany({
      where: {
        status: {
          in: ['borrowed', 'overdue-notified'], // ✅ Ambil keduanya
        },
        dueDate: { lt: new Date() },
      },
      include: {
        User: true,
        Book: true,
      },
    });

    return {
      stats: {
        totalBooks,
        borrowedBooks,
        availableBooks,
        totalTransactions,
        transactionsToday,
      },
      recentTransactions: recentTransactions.map((t) => ({
        id: t.id,
        userName: t.User?.fullName ?? 'Unknown',
        bookTitle: t.Book?.title ?? 'Unknown',
        date: t.createdAt,
        status: t.status,
      })),
      popularBooks: booksWithTitle,

      // 🔔 Tambahkan ini:
      overdueList: overdueTransactions.map((t) => ({
        id: t.id,
        userName: t.User?.fullName ?? 'Unknown',
        bookTitle: t.Book?.title ?? 'Unknown',
        dueDate: t.dueDate,
        emailSentAt: t.overdueEmailSentAt, // ✅ kirim ke frontend
      })),
    };
  }
}
