import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserController } from './user.controller';
import { UserService } from './user.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { User } from './entities/user.entity';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { USER_SERVICE } from '@app/common/constants';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './apps/user/.env',
    }),
    DatabaseModule,
    TypeOrmModule.forFeature([User]),
    ClientsModule.register([
      {
        name: USER_SERVICE,
        transport: Transport.KAFKA,
        options: {
          allowAutoTopicCreation: true,
          client: {
            clientId: 'user-service',
            brokers: ['kafka:9092'],
          },
          // clientId: 'user-service',
          // brokers: ['localhost:9092'],
        },
        // imports: [ConfigModule] // We would need to do this if isGlobal was not set to true in ConfigModule.forRoot
      },
    ]),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
