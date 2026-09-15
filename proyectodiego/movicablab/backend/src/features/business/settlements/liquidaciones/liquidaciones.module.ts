import { Module } from '@nestjs/common';
import { ILIQUIDACION_REPOSITORY } from './domain/interfaces/liquidacion-repository.interface';
import { SequelizeLiquidacionRepository } from './infrastructure/persistence/repositories/sequelize-liquidacion.repository';
import { CrearLiquidacion } from './application/use-cases/crear-liquidacion.use-case';
import { AnularLiquidacion } from './application/use-cases/anular-liquidacion.use-case';
import { ListLiquidaciones } from './application/use-cases/list-liquidaciones.use-case';
import { GetLiquidacionById } from './application/use-cases/get-liquidacion-by-id.use-case';
import { UpdateLiquidacionEstado } from './application/use-cases/update-liquidacion-estado.use-case';
import { LiquidacionesController } from './presentation/http/controllers/liquidaciones.controller';
import { TripsModule } from '../../trips/trips.module';
import { DriversModule } from '../../drivers/drivers.module';

@Module({
  imports: [TripsModule, DriversModule],
  controllers: [LiquidacionesController],
  providers: [
    {
      provide: ILIQUIDACION_REPOSITORY,
      useClass: SequelizeLiquidacionRepository,
    },
    CrearLiquidacion,
    AnularLiquidacion,
    ListLiquidaciones,
    GetLiquidacionById,
    UpdateLiquidacionEstado,
  ],
  exports: [ILIQUIDACION_REPOSITORY],
})
export class LiquidacionesModule {}
