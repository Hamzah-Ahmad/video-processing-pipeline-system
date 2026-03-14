import { NestFactory } from '@nestjs/core';
import { UserModule } from './user.module';
import { Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(UserModule);
  const configService = app.get(ConfigService);

  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      host: configService.getOrThrow('HOST'),
      port: configService.getOrThrow('PORT'),
    },
  });
  app.useGlobalPipes(new ValidationPipe());

  // Start all microservices
  await app.startAllMicroservices();

  // If you also want HTTP server (optional)
  // await app.listen(configService.get('HTTP_PORT'));

  // If you only want microservice without HTTP
  await app.init();
}
bootstrap();
