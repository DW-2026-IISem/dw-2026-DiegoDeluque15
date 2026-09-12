import { Module } from '@nestjs/common';

/**
 * BusinessModule — stub ISS-01.
 * Los submódulos (passengers, fleets, drivers, pricing, trips, settlements)
 * se importarán aquí en sus respectivos issues.
 */
@Module({
  imports: [],
  exports: [],
})
export class BusinessModule {}
