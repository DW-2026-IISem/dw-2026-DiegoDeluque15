import { Module } from '@nestjs/common';
import { PassengersModule } from './passengers/passengers.module';
import { FleetsModule } from './fleets/fleets.module';
import { DriversModule } from './drivers/drivers.module';
import { PricingModule } from './pricing/pricing.module';
import { TripsModule } from './trips/trips.module';
import { SettlementsModule } from './settlements/settlements.module';

/**
 * BusinessModule — ISS-01 + ISS-03 + ISS-04.
 * Agrega submódulos de negocio (passengers, fleets, drivers, pricing, trips, settlements).
 */
@Module({
  imports: [PassengersModule, FleetsModule, DriversModule, PricingModule, TripsModule, SettlementsModule],
  exports: [PassengersModule, FleetsModule, DriversModule, PricingModule, TripsModule, SettlementsModule],
})
export class BusinessModule {}
