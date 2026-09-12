import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthController } from './health.controller';
import { DatabaseModule } from './infrastructure/database';

/**
 * AppModule raíz — ISS-01 + ISS-02.
 * ConfigModule global, DatabaseModule (Sequelize) y HealthController.
 */
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
