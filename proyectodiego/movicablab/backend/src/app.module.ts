import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthController } from './health.controller';
import { BusinessModule } from './features/business/business.module';
import { DatabaseModule } from './infrastructure/database';

/**
 * AppModule raíz — ISS-01 + ISS-02 + ISS-03.
 * ConfigModule global, DatabaseModule, BusinessModule y HealthController.
 */
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule,
    BusinessModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
