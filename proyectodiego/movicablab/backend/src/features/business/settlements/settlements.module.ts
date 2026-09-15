import { Module } from '@nestjs/common';
import { PagosModule } from './pagos/pagos.module';
import { CalificacionesModule } from './calificaciones/calificaciones.module';

@Module({
  imports: [PagosModule, CalificacionesModule],
  exports: [PagosModule, CalificacionesModule],
})
export class SettlementsModule {}
