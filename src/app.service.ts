import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(private configService: ConfigService) {}

  getHello(): string {
    const frontendUrl = this.configService.get<string>('frontendUrl');
    return `📚 Perpustakaan UNSRAT aktif! Frontend: ${frontendUrl}`;
  }
}
