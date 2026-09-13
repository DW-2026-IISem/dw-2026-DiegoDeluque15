import { Module } from '@nestjs/common';
import { ConductoresModule } from './conductores/conductores.module';
import { TurnosModule } from './turnos/turnos.module';

@Module({
  imports: [ConductoresModule, TurnosModule],
  exports: [ConductoresModule, TurnosModule],
})
export class DriversModule {}
