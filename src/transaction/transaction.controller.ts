import { Controller, Post, Body, Get, Param, Req, UseGuards, Patch, Res } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { Request, Response } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard'; // gunakan guard kamu yang sudah jadi
import * as ExcelJS from 'exceljs';

@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() body: { bookId: number }, @Req() req: Request) {
    const user = req.user as any; // ⬅️ user.userId, karena dari validate()
    console.log("User dari cookie JWT:", user);

    return this.transactionService.createTransaction({
      userId: user.userId, // ⬅️ ambil dari user.userId
      bookId: body.bookId,
    });
  }

  @Get()
  async findAll() {
    return this.transactionService.findAllTransactions();
  }

  
  // ✅ Tambahkan endpoint ini untuk frontend "Bukti Peminjaman"
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMyTransactions(@Req() req: Request) {
    const user = req.user as any; // cepat & aman jika user.id pasti ada
    console.log("🔍 req.user:", user); // Tambahkan log ini
    
    return this.transactionService.findTransactionsByUserId(user.userId);
  }
  
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.transactionService.findTransactionById(+id);
  }
  
  // 🔁 5. Konfirmasi transaksi oleh admin
  @Patch(':id/confirm')
  async confirmTransaction(@Param('id') id: string) {
    return this.transactionService.updateStatus(+id, 'borrowed');
  }

  // 🔁 6. Pengembalian buku oleh user
  @UseGuards(JwtAuthGuard)
  @Patch(':id/return')
  async returnBook(@Param('id') id: string, @Req() req: Request) {
    const user = req.user as any;
    return this.transactionService.returnBook(+id, user.userId);
  }

  @Patch(':id/scan')
  async scanQRCode(@Param('id') id: string) {
    return this.transactionService.scanQRCode(+id);
  }

  // 🆕 Konfirmasi pengambilan buku (dari status pending-pickup → borrowed)
  @Patch(':id/pickup')
  async pickupBook(@Param('id') id: string) {
    return this.transactionService.updateStatus(Number(id), 'borrowed');
  }

  // 🆕 Konfirmasi pengembalian buku via QR
  @Patch(':id/return-qr')
  async returnBookViaQr(@Param('id') id: string) {
    return this.transactionService.updateStatus(Number(id), 'returned');
  }

  @Get('overdue-count')
  async getOverdueCount() {
    const overdueCount = await this.transactionService.countOverdueTransactions();
    return { overdueCount };
  }

  // 📤 Ekspor data keterlambatan ke Excel
  @Get('export/overdue')
  async exportOverdueExcel(@Res() res: Response) {
    const data = await this.transactionService.getOverdueData();

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Daftar Keterlambatan');

    worksheet.columns = [
      { header: 'Nama Peminjam', key: 'userName', width: 30 },
      { header: 'Judul Buku', key: 'bookTitle', width: 40 },
      { header: 'Tanggal Jatuh Tempo', key: 'dueDate', width: 20 },
      { header: 'Telat (hari)', key: 'daysLate', width: 15 },
      { header: 'Email Dikirim', key: 'emailSent', width: 15 },
    ];

    data.forEach((t) => {
      const due = new Date(t.dueDate);
      const daysLate = Math.max(0, Math.floor((Date.now() - due.getTime()) / (1000 * 60 * 60 * 24)));

      worksheet.addRow({
        userName: t.User?.fullName ?? '-',
        bookTitle: t.Book?.title ?? '-',
        dueDate: due.toISOString().split('T')[0],
        daysLate,
        emailSent: t.overdueEmailSentAt ? '✅' : '❌',
      });
    });

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader('Content-Disposition', 'attachment; filename=keterlambatan.xlsx');

    await workbook.xlsx.write(res);
    res.end();
  }

  @Get('export/borrowed')
  async exportBorrowed(@Res() res: Response) {
    const data = await this.transactionService.getBorrowedBooks();

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Buku Dipinjam');

    worksheet.columns = [
      { header: 'Nama Peminjam', key: 'userName', width: 30 },
      { header: 'Judul Buku', key: 'bookTitle', width: 40 },
      { header: 'Tanggal Pinjam', key: 'borrowDate', width: 20 },
      { header: 'Jatuh Tempo', key: 'dueDate', width: 20 },
      { header: 'Status', key: 'status', width: 20 },
    ];

    data.forEach((t) => {
      worksheet.addRow({
        userName: t.User?.fullName ?? '-',
        bookTitle: t.Book?.title ?? '-',
        borrowDate: t.borrowDate.toISOString().split('T')[0],
        dueDate: t.dueDate.toISOString().split('T')[0],
        status: t.status,
      });
    });

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader('Content-Disposition', 'attachment; filename=sedang-dipinjam.xlsx');

    await workbook.xlsx.write(res);
    res.end();
  }

  @Get('export/all')
  async exportAllTransactions(@Res() res: Response) {
    const data = await this.transactionService.getAllTransactions();

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Semua Transaksi');

    worksheet.columns = [
      { header: 'Nama Peminjam', key: 'userName', width: 30 },
      { header: 'Judul Buku', key: 'bookTitle', width: 40 },
      { header: 'Tanggal Pinjam', key: 'borrowDate', width: 20 },
      { header: 'Jatuh Tempo', key: 'dueDate', width: 20 },
      { header: 'Tanggal Kembali', key: 'returnDate', width: 20 },
      { header: 'Status', key: 'status', width: 20 },
      { header: 'Denda', key: 'fine', width: 10 },
    ];

    data.forEach((t) => {
      worksheet.addRow({
        userName: t.User?.fullName ?? '-',
        bookTitle: t.Book?.title ?? '-',
        borrowDate: t.borrowDate.toISOString().split('T')[0],
        dueDate: t.dueDate.toISOString().split('T')[0],
        returnDate: t.returnDate
          ? t.returnDate.toISOString().split('T')[0]
          : '-',
        status: t.status,
        fine: t.fine,
      });
    });

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader('Content-Disposition', 'attachment; filename=semua-transaksi.xlsx');

    await workbook.xlsx.write(res);
    res.end();
  }
}
