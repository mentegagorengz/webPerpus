import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as nodemailer from 'nodemailer';
import { Cron, CronExpression } from '@nestjs/schedule';
import { format, differenceInDays, isTomorrow, isPast } from 'date-fns';

@Injectable()
export class EmailService {
  private transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER, // ✅ ambil dari .env
      pass: process.env.EMAIL_PASS, // ✅ ambil dari .env
    },
  });

  constructor(private prisma: PrismaService) {}
  private readonly logger = new Logger(EmailService.name);

  async sendMail(to: string, subject: string, html: string) {
    return this.transporter.sendMail({
      from: `"Perpustakaan UNSRAT" <${process.env.EMAIL_USER}>`, // ✅
      to,
      subject,
      html,
    });
  }

  async sendBorrowReminder(to: string, fullName: string, bookTitle: string, dueDate: string) {
    const subject = `📚 Peringatan Jatuh Tempo Buku`;
    const html = `
      <p>Halo ${fullName},</p>
      <p>Ini adalah pengingat bahwa buku <strong>${bookTitle}</strong> yang Anda pinjam akan jatuh tempo pada <strong>${dueDate}</strong>.</p>
      <p>Harap segera dikembalikan agar tidak terkena denda.</p>
      <br>
      <p style="font-size: 0.875rem; color: gray;">Email ini dikirim otomatis oleh sistem perpustakaan UNSRAT. Mohon tidak membalas.</p>
    `;

    return this.sendMail(to, subject, html);
  }

  async sendOneDayReminder(to: string, fullName: string, bookTitle: string, dueDate: string) {
    const subject = `⏳ Besok Jatuh Tempo: ${bookTitle}`;
    const html = `
      <p>Halo ${fullName},</p>
      <p>Buku <strong>${bookTitle}</strong> yang Anda pinjam akan jatuh tempo <strong>besok</strong> (${dueDate}).</p>
      <p>Harap dikembalikan tepat waktu untuk menghindari denda.</p>
    `;
    return this.sendMail(to, subject, html);
  }

  async sendOverdueNotice(to: string, fullName: string, bookTitle: string, daysLate: number) {
    const subject = `📌 Buku Terlambat Dikembalikan`;
    const html = `
      <p>Halo ${fullName},</p>
      <p>Buku <strong>${bookTitle}</strong> yang Anda pinjam sudah <strong>terlambat dikembalikan</strong> selama <strong>${daysLate} hari</strong>.</p>
      <p>Harap segera dikembalikan untuk menghindari denda lebih besar.</p>
    `;
    return this.sendMail(to, subject, html);
  }

  @Cron(CronExpression.EVERY_DAY_AT_7AM)
  async runDailyReminders() {
    this.logger.log("🚀 Menjalankan pengecekan pengingat & keterlambatan...");

    const transactions = await this.prisma.transaction.findMany({
      where: {
        status: {
          in: ['borrowed', 'overdue-notified'], // ⬅️ dua status
        },
      },
      include: {
        User: true,
        Book: true,
      },
    });

    for (const trx of transactions) {
      const { id, User, Book, dueDate, status } = trx;
      if (!User?.email || !Book?.title || !dueDate) continue;

      const formattedDate = format(dueDate, 'dd MMMM yyyy');

      // 🔔 H-1 sebelum jatuh tempo
      if (status === 'borrowed' && isTomorrow(dueDate)) {
        await this.sendOneDayReminder(User.email, User.fullName, Book.title, formattedDate);
        this.logger.log(`🔔 Reminder H-1 dikirim ke ${User.email}`);
      }

      // ⚠️ Keterlambatan: kirim setiap 3 hari
      if (isPast(dueDate)) {
        const daysLate = differenceInDays(new Date(), dueDate);

        // Kirim hanya jika sudah lewat 3 hari atau kelipatannya
        if (daysLate % 3 === 0) {
          await this.sendOverdueNotice(User.email, User.fullName, Book.title, daysLate);
          this.logger.log(`⚠️ Reminder keterlambatan ${daysLate} hari dikirim ke ${User.email}`);

          await this.prisma.transaction.update({
            where: { id },
            data: {
              status: 'overdue-notified', // boleh overwrite jika masih 'borrowed'
              overdueEmailSentAt: new Date(), // ✅ ini catatan waktu kirim
            },
          });
        }

        // Ubah status hanya jika sebelumnya masih 'borrowed'
        if (status === 'borrowed') {
          await this.prisma.transaction.update({
            where: { id },
            data: { status: 'overdue-notified' },
          });
          this.logger.log(`🔄 Status transaksi ${id} diubah ke 'overdue-notified'`);
        }
      }
    }
  }
}
