import { Module } from '@nestjs/common';
import { PagosModule } from './pagos/pagos.module';
import { CalificacionesModule } from './calificaciones/calificaciones.module';
import { LiquidacionesModule } from './liquidaciones/liquidaciones.module';

@Module({
  imports: [PagosModule, CalificacionesModule, LiquidacionesModule],
  exports: [PagosModule, CalificacionesModule, LiquidacionesModule],
})
export class SettlementsModule {}
