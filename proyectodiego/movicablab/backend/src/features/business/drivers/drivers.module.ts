import { Module } from '@nestjs/common';
import { ConductoresModule } from './conductores/conductores.module';

@Module({
  imports: [ConductoresModule],
  exports: [ConductoresModule],
})
export class DriversModule {}
