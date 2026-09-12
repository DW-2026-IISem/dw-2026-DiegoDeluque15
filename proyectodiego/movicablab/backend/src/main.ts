import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  // Prefijo global de rutas
  app.setGlobalPrefix('api');

  // CORS: permite peticiones desde el frontend Angular
  app.enableCors({
    origin: 'http://localhost:4200',
    credentials: true,
  });

  // Pipe de validación global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`[MoviCab] Backend corriendo en http://localhost:${port}/api`);
}

bootstrap();
