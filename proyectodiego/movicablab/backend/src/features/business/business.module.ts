import { Module } from '@nestjs/common';
import { PassengersModule } from './passengers/passengers.module';

/**
 * BusinessModule — ISS-01 + ISS-03.
 * Agrega submódulos de negocio (passengers, fleets, drivers, pricing, trips, settlements).
 */
@Module({
  imports: [PassengersModule],
  exports: [PassengersModule],
})
export class BusinessModule {}
