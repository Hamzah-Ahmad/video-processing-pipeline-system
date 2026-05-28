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