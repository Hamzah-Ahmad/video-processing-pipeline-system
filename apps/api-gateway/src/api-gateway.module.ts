import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { ApiGatewayController } from './api-gateway.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AUTH_SERVICE } from '@app/common/constants';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard, RolesGuard } from '@app/common/guards';
import { AuthModule } from './auth/auth.module';
import { MediaModule } from './media/media.module';
import { CommentModule } from './comment/comment.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './apps/api-gateway/.env',
    }),
    UserModule,
    AuthModule,
    ClientsModule.registerAsync([
      {
        name: AUTH_SERVICE,
        useFactory: (configService: ConfigService) => {
          return {
            transport: Transport.TCP,
            options: {
              host: configService.getOrThrow<string>('AUTH_SERVICE_HOST'), // NOTE: make sure to use the service name in the docker compose file as the host name. So if the service name is user, hostname should be user as well
              port: configService.getOrThrow<number>('AUTH_SERVICE_PORT'),
            },
          };
        },
        inject: [ConfigService],
        // imports: [ConfigModule] // We would need to do this if isGlobal was not set to true in ConfigModule.forRoot
      },
    ]),
    MediaModule,
    CommentModule,
  ],
  controllers: [ApiGatewayController],
  providers: [
    {
      // NOTE: makes all api-gateway routes protected. Not doing the same in auth routes because there are only three routes and only two use guards (and that too different guards)
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class ApiGatewayModule {}
