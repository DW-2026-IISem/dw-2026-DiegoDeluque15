import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthController } from './health.controller';
import { BusinessModule } from './features/business/business.module';
import { IdentityModule } from './features/identity/identity.module';
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
    IdentityModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
