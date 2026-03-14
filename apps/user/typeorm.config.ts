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
  migrations: ['apps/user/migrations/**/*.ts'], // For monorepos, it is necessary to give full path because there are path issues.
  entities: ['apps/user/src/**/*.entity.ts'], // For monorepos, it is necessary to give full path because there are path issues.
});



// Question: The typeorm was already in the same level as .env so why did I need to do this?
// 
// Response: Good question! The issue isn't about the physical location of the files, but about the working directory when the TypeORM config is executed.
// Here's what was happening:
// File Structure (both scenarios):
// project-root/
// ├── .env
// ├── typeorm.config.ts
// └── ...
// The Problem:
// When you run TypeORM commands like:
// bashnpm run typeorm -- migration:generate ...
// The current working directory (process.cwd()) might not be the same as where your typeorm.config.ts file is located.
// What config() does by default:
// typescriptconfig(); // This looks for .env in process.cwd(), not relative to the config file
// So if TypeORM CLI runs from a subdirectory or with a different working directory, config() looks in the wrong place.