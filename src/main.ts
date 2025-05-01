import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const databaseUrl = configService.get<string>('DATABASE_URL');
  const frontendEnv = configService.get<string>('FRONTEND_URL'); // dari .env

  const allowedOrigins = [
    'http://localhost:3000',
    'https://perpustakaan-unsrat.vercel.app',
  ];

  // Tambahkan dari .env jika ada dan belum masuk array
  if (frontendEnv && !allowedOrigins.includes(frontendEnv)) {
    allowedOrigins.push(frontendEnv);
  }

  console.log('✅ DATABASE_URL:', databaseUrl);
  console.log('✅ FRONTEND_URLS (CORS):', allowedOrigins);

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('CORS Not Allowed'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
    next();
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
