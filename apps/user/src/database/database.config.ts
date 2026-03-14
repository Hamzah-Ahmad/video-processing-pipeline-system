import { ConfigService } from '@nestjs/config';

export function getTypeOrmConfig(config: ConfigService | NodeJS.ProcessEnv) {
  const getter =
    config instanceof ConfigService
      ? (key: string) => config.getOrThrow(key)
      : (key: string) => config[key];

  return {
    type: 'postgres' as const,
    host: getter('PG_HOST'),
    port: Number(getter('PG_PORT')),
    username: getter('PG_USERNAME'),
    password: getter('PG_PASSWORD'),
    database: getter('PG_DATABASE'),
  };
}


// NOTE: 
// Thr getter helper exists so we can reuse the same DB config for both:
// 1) NestJS runtime (where we have ConfigService)
// 2) Standalone TypeORM DataSource (where ConfigService does NOT work)
//
// In Nest, we call configService.getOrThrow('PG_HOST'), but in the
// DataSource file we can only read from process.env. This helper makes
// both environments compatible by using getOrThrow if ConfigService is
// available, otherwise falling back to process.env lookups.