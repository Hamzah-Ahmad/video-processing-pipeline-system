import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MEDIA_SERVICE } from '@app/common/constants';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: MEDIA_SERVICE,
        useFactory: (configService: ConfigService) => {
          return {
            transport: Transport.TCP,
            options: {
              host: configService.getOrThrow<string>('MEDIA_SERVICE_HOST'), // NOTE: make sure to use the service name in the docker compose file as the host name. So if the service name is user, hostname should be user as well
              port: configService.getOrThrow<number>('MEDIA_SERVICE_PORT'),
            },
          };
        },
        inject: [ConfigService],
      },
    ]),
  ],
  providers: [CommentService],
  controllers: [CommentController],
})
export class CommentModule {}
