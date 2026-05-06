import { NestFactory } from '@nestjs/core';
import { MediaModule } from './media.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(MediaModule);
  const configService = app.get(ConfigService);
  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      host: configService.getOrThrow('HOST'),
      port: configService.getOrThrow('PORT'),
    },
  });

  app.connectMicroservice({
    transport: Transport.KAFKA,
    options: {
      allowAutoTopicCreation: true,
      client: {
        clientId: 'media-service',
        brokers: ['kafka:9092'],
      },
      retry: {
        initialRetryTime: 300,
        retries: 10,
      },
      consumer: {
        groupId: 'media-consumer-group',
      },
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
