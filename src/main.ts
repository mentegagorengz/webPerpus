import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  console.log('DATABASE_URL:', process.env.DATABASE_URL);

  app.enableCors({
    origin: 'https://perpustakaan-unsrat.vercel.app', // ✅ TANPA slash
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });
  
  app.use(cookieParser());

  await app.listen(4000);
}
bootstrap();
