import 'reflect-metadata';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors({ origin: true });
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true }));
  const config = new DocumentBuilder().setTitle('HyperLessons API').setDescription('API NestJS, Prisma e JWT').setVersion('1.0').addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT', in: 'header' }, 'token').build();
  SwaggerModule.setup('docs', app, SwaggerModule.createDocument(app, config), { useGlobalPrefix: true });
  await app.listen(process.env.PORT ? Number(process.env.PORT) : 8080);
}
bootstrap();
