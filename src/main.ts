import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as fs from 'fs';

import {
  ValidationPipe,
  // BadRequestException,
  // ValidationError,
} from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle("Matrix Member's App")
    .setDescription('The Matrix Member API description')
    .setVersion('0.1')
    .addBearerAuth(
      {
        description: `Please enter token in following format: Bearer <JWT>`,
        name: 'Authorization',
        bearerFormat: 'Bearer',
        scheme: 'Bearer',
        type: 'http',
        in: 'Header',
      },
      'Authorization',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  fs.writeFileSync('swaggerDoc.json', JSON.stringify(document, null, 2));
  SwaggerModule.setup('admin', app, document);
  app.enableCors();
  // Increase the timeout to 5 minutes
  //app.use(timeout('120m'));
  await app.listen(3000);
}

bootstrap();
