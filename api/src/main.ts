import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });

  app.enableCors({
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Orders API')
    .setDescription('API para gestión de órdenes con persistencia en DynamoDB')
    .setVersion('1.0')
    .addTag('orders', 'Operaciones CRUD de órdenes')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Orders API - Documentación',
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);

  const baseUrl = await app.getUrl();
  console.log(`🚀 Aplicación iniciada en: ${baseUrl}`);
  console.log(`📚 Documentación Swagger disponible en: ${baseUrl}/api/docs`);
  console.log(`🌱 Entorno: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📦 Tabla DynamoDB: ${process.env.DYNAMODB_TABLE_NAME || 'orders-dev'}`);
}

bootstrap();