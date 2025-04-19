import { Controller, Post, Body } from '@nestjs/common';
import { EmailService } from './email.service';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post('test')
  async sendTestEmail(
    @Body() body: { to: string; fullName: string; bookTitle: string; dueDate: string },
  ) {
    const { to, fullName, bookTitle, dueDate } = body;
    return this.emailService.sendBorrowReminder(to, fullName, bookTitle, dueDate);
  }

  // 🔁 Uji semua reminder H-1 dan keterlambatan
  @Post('test-cron')
  async testRun() {
    return this.emailService.runDailyReminders();
  }

  // 🔔 Tes pengingat H-1 manual
  @Post('test-reminder')
  async testReminder(@Body() body: { to: string, name: string, title: string, date: string }) {
    return this.emailService.sendOneDayReminder(body.to, body.name, body.title, body.date);
  }

  // ⚠️ Tes notifikasi telat manual
  @Post('test-overdue')
  async testOverdue(@Body() body: { to: string, name: string, title: string, days: number }) {
    return this.emailService.sendOverdueNotice(body.to, body.name, body.title, body.days);
  }

  // 📚 Tes reminder biasa (opsional)
  @Post('test-borrow-reminder')
  async testBorrowReminder(@Body() body: { to: string, name: string, title: string, date: string }) {
    return this.emailService.sendBorrowReminder(body.to, body.name, body.title, body.date);
  }
}