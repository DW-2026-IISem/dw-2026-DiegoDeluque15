import { Module } from '@nestjs/common';
import { CalificacionModel } from './infrastructure/persistence/models/calificacion.model';
import { SequelizeCalificacionRepository } from './infrastructure/persistence/repositories/sequelize-calificacion.repository';
import { ICALIFICACION_REPOSITORY } from './domain/interfaces/calificacion-repository.interface';
import { CrearCalificacion } from './application/use-cases/crear-calificacion.use-case';
import { CalificacionesController } from './presentation/http/controllers/calificaciones.controller';
import { TripsModule } from '../../trips/trips.module';

@Module({
  imports: [
    TripsModule,
  ],
  controllers: [CalificacionesController],
  providers: [
    {
      provide: ICALIFICACION_REPOSITORY,
      useClass: SequelizeCalificacionRepository,
    },
    CrearCalificacion,
  ],
  exports: [ICALIFICACION_REPOSITORY],
})
export class CalificacionesModule {}
