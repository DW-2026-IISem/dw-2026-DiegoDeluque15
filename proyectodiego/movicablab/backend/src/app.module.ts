import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { DatabaseModule } from './infrastructure/database/sequelize/sequelize.module.js';
import { HealthModule } from './features/health/health.module.js';
import { FleetsModule } from './features/business/fleets/fleets.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule,
    HealthModule,
    FleetsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
