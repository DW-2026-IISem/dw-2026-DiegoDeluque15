import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule, SequelizeModuleOptions } from '@nestjs/sequelize';
import databaseConfig from '../../../config/database/database.config.js';

@Module({
  imports: [
    ConfigModule.forFeature(databaseConfig),
    SequelizeModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService): SequelizeModuleOptions =>
        config.getOrThrow<SequelizeModuleOptions>('database'),
    }),
  ],
})
export class DatabaseModule {}
