import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getTypeOrmConfig } from './database.config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (configService) => ({
        ...getTypeOrmConfig(configService),
        autoLoadEntities: true,
        synchronize: false, // Only use migrations to change DB schema
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
