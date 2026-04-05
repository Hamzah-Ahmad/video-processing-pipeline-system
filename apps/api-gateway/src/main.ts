import { NestFactory } from '@nestjs/core';
import { ApiGatewayModule } from './api-gateway.module';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {

  const app = await NestFactory.create(ApiGatewayModule);
  const configService = app.get(ConfigService);
  const port = configService.getOrThrow<number>('PORT');
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors(); 
  await app.listen(port);
}
bootstrap();
