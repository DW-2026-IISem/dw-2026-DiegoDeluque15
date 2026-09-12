import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthController } from './health.controller';

/**
 * AppModule raíz — ISS-01.
 * Solo contiene ConfigModule global y HealthController.
 * Los módulos de features e infrastructure se añaden en issues subsiguientes.
 */
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
  ],
  controllers: [HealthController],
})
export class AppModule {}
