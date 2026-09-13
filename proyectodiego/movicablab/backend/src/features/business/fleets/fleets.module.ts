import { Module } from '@nestjs/common';
import { EmpresasModule } from './empresas/empresas.module';
import { VehiculosModule } from './vehiculos/vehiculos.module';

/**
 * FleetsModule — ISS-04 + ISS-05.
 * Agrupa Empresa y Vehiculo bajo fleets/.
 */
@Module({
  imports: [EmpresasModule, VehiculosModule],
  exports: [EmpresasModule, VehiculosModule],
})
export class FleetsModule {}
