import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { MediaModule } from './media/media.module';

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


//connect microservie multiple flow. alternative to our method

 /**
   * ---------------------------------------------------------
   * CONSUMER #1
   * ---------------------------------------------------------
   * Purpose:
   * Handles VIDEO-RELATED EVENTS
   *
   * Why separate group?
   * - video processing may be high-volume
   * - you may want independent scaling
   * - offsets are isolated from other event streams
   */
  // app.connectMicroservice({
  //   transport: Transport.KAFKA,
  //   options: {
  //     client: {
  //       clientId: 'media-service-video',
  //       brokers: ['kafka:9092'],
  //     },
  //     consumer: {
  //       groupId: 'media-video-group',
  //     },
  //   },
  // });

  /**
   * ---------------------------------------------------------
   * CONSUMER #2
   * ---------------------------------------------------------
   * Purpose:
   * Handles USER-RELATED EVENTS
   *
   * Why separate group?
   * - different event frequency than video
   * - different retry / lag tolerance
   * - isolates offsets from video pipeline
   */
  // app.connectMicroservice({
  //   transport: Transport.KAFKA,
  //   options: {
  //     client: {
  //       clientId: 'media-service-user',
  //       brokers: ['kafka:9092'],
  //     },
  //     consumer: {
  //       groupId: 'media-user-group',
  //     },
  //   },
  // });
