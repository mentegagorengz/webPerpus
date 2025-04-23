import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  console.log('DATABASE_URL:', process.env.DATABASE_URL);

  app.enableCors({
    origin: 'https://perpustakaan-unsrat.vercel.app/',
    credentials: true,
  });
  app.use(cookieParser());

  await app.listen(4000);
}
bootstrap();
