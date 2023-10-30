import { DataSourceOptions } from 'typeorm';
import { ConfigService } from '@nestjs/config';

// entities
import { User } from '../users/user.entity';
import { Settings } from '../settings/settings.entity';

export function databaseConfig(
  configService: ConfigService,
): DataSourceOptions {
  switch (process.env.NODE_ENV) {
    case 'development':
      return {
        type: configService.getOrThrow('NEST_DATABASE_TYPE'),
        url: configService.getOrThrow('NEST_DATABASE_URL'),
        synchronize: true,
        entities: [User, Settings],
      } as DataSourceOptions;
    default:
      return {} as DataSourceOptions;
  }
}
