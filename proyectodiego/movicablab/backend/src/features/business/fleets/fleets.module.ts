import { Module } from '@nestjs/common';
import { EmpresasModule } from './empresas/empresas.module';

/**
 * FleetsModule — ISS-04.
 * Agrupa Empresa (ISS-04) y Vehiculo (ISS-05).
 */
@Module({
  imports: [EmpresasModule],
  exports: [EmpresasModule],
})
export class FleetsModule {}
