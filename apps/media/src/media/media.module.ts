import { Module } from '@nestjs/common';
import { MediaController } from './media.controller';
import { MediaService } from './media.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Media } from '../entities/media.entity';
import { DatabaseModule } from '../database/database.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AUTH_SERVICE } from '@app/common/constants';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard, RolesGuard } from '@app/common/guards';
import { CommentUserProjection } from '../entities/comment-user-projection.entity';
import { CommentModule } from '../comment/comment.module';

// Note: This service has no AppModule, so MediaModule acts as the root module.
// DatabaseModule (forRootAsync) is imported here once to establish the DB connection.
// Child modules like CommentModule only use forFeature to register their entities
// into that same connection — mirroring the monolith pattern where AppModule owns
// the connection and feature modules only register their entities.
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './apps/media/.env',
    }),
    DatabaseModule,
    CommentModule, // CommentModule is imported here so its forFeature entities (Comment, CommentUserProjection) are registered into the TypeORM connection established by DatabaseModule above. This is needed because Media entity has relations to these entities.
    TypeOrmModule.forFeature([Media]),
    ClientsModule.registerAsync([
      {
        name: AUTH_SERVICE,
        useFactory: (configService: ConfigService) => {
          return {
            transport: Transport.TCP,
            options: {
              host: 'auth', //configService.getOrThrow<string>('auth'), // NOTE: make sure to use the service name in the docker compose file as the host name. So if the service name is user, hostname should be user as well
              port: 3001, // configService.getOrThrow<number>('3001'),
            },
          };
        },
        inject: [ConfigService],
        // imports: [ConfigModule] // We would need to do this if isGlobal was not set to true in ConfigModule.forRoot
      },
    ]),
    CommentModule
  ],
  controllers: [MediaController],
  providers: [
    MediaService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class MediaModule {}
