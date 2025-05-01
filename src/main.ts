import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const databaseUrl = configService.get<string>('databaseUrl');
  const frontendOrigin = configService.get<string>('frontendUrl'); // Ambil dari .env

  console.log('✅ DATABASE_URL:', databaseUrl);
  console.log('✅ FRONTEND_URL:', frontendOrigin);

  app.enableCors({
    origin: frontendOrigin, // fleksibel: bisa beda di dev dan prod
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  app.use(cookieParser());

  await app.listen(4000);
  console.log('🚀 Backend ready at http://localhost:4000');
}
bootstrap();




// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';
// import * as cookieParser from 'cookie-parser';

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);

//   console.log('DATABASE_URL:', process.env.DATABASE_URL);

//   app.enableCors({
//     origin: 'https://perpustakaan-unsrat.vercel.app', // ✅ TANPA slash
//     credentials: true,
//     methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//     allowedHeaders: ['Content-Type', 'Authorization'],
//   });
  
//   app.use(cookieParser());

//   await app.listen(4000);
// }
// bootstrap();
