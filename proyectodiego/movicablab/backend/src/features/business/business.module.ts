import { Module } from '@nestjs/common';
import { PassengersModule } from './passengers/passengers.module';
import { FleetsModule } from './fleets/fleets.module';

/**
 * BusinessModule — ISS-01 + ISS-03 + ISS-04.
 * Agrega submódulos de negocio (passengers, fleets, drivers, pricing, trips, settlements).
 */
@Module({
  imports: [PassengersModule, FleetsModule],
  exports: [PassengersModule, FleetsModule],
})
export class BusinessModule {}
