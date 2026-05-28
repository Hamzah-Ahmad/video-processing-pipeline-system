import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { DataSource } from 'typeorm';
import * as path from 'path';

config({ path: path.resolve(__dirname, '.env') }); // Note about why path was needed, added below

const configService = new ConfigService();

export default new DataSource({
  type: 'postgres',
  host: configService.getOrThrow('PG_HOST'),
  port: configService.getOrThrow('PG_PORT'),
  database: configService.getOrThrow('PG_DATABASE'),
  username: configService.getOrThrow('PG_USERNAME'),
  password: configService.getOrThrow('PG_PASSWORD'),
  migrations: ['apps/media/migrations/**/*.ts'], // For monorepos, it is necessary to give full path because there are path issues.
  entities: ['apps/media/src/**/*.entity.ts'], // For monorepos, it is necessary to give full path because there are path issues.
});
