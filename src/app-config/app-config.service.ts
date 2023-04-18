import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { merge } from 'lodash';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import ormconfig from '../../ormconfig';

@Injectable()
export class AppConfigService implements TypeOrmOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createTypeOrmConfig(): TypeOrmModuleOptions {
    return merge(
      ormconfig,
      this.createTypeOrmOptions(),
    ) as TypeOrmModuleOptions;
  }

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: this.configService.get('DB_HOST'),
      port: this.configService.get<number>('DB_PORT'),
      username: this.configService.get('DB_USERNAME'),
      password: this.configService.get('DB_PASSWORD'),
      database: this.configService.get('DB_NAME'),
      schema: this.configService.get('DB_SCHEMA'),
      extra: {
        ssl: false,
      },
    };
  }
}
