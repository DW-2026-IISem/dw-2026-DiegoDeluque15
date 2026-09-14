import { Module, forwardRef } from '@nestjs/common';
import { TripsModule } from '../../trips/trips.module';
import { ConductoresModule } from '../conductores/conductores.module';
import { VehiculosModule } from '../../fleets/vehiculos/vehiculos.module';
import { TURNO_ACTIVO_PORT_CONDUCTOR } from '../conductores/domain/interfaces/turno-activo.port.interface';
import { TURNO_ACTIVO_PORT } from '../../fleets/vehiculos/domain/interfaces/turno-activo.port.interface';
import { CARRERA_ACTIVA_PORT } from './domain/interfaces/carrera-activa.port.interface';
import { TURNO_REPOSITORY } from './domain/interfaces/turno.repository.interface';
import { CreateTurnoUseCase } from './application/use-cases/create-turno.use-case';
import { DeleteTurnoUseCase } from './application/use-cases/delete-turno.use-case';
import { GetTurnoByIdUseCase } from './application/use-cases/get-turno-by-id.use-case';
import { ListTurnosUseCase } from './application/use-cases/list-turnos.use-case';
import { UpdateTurnoUseCase } from './application/use-cases/update-turno.use-case';
import { TurnoActivoConductorAdapter } from './infrastructure/adapters/turno-activo-conductor.adapter';
import { TurnoActivoVehiculoAdapter } from './infrastructure/adapters/turno-activo-vehiculo.adapter';
import { CarreraActivaTurnoAdapter } from '../../trips/infrastructure/adapters/carrera-activa-turno.adapter';
import { TurnoRepository } from './infrastructure/persistence/repositories/turno.repository';
import { TurnosController } from './presentation/http/controllers/turnos.controller';

@Module({
  imports: [
    forwardRef(() => TripsModule), 
    forwardRef(() => ConductoresModule),
    forwardRef(() => VehiculosModule),
  ],
  controllers: [TurnosController],
  providers: [
    { provide: TURNO_REPOSITORY, useClass: TurnoRepository },
    { provide: CARRERA_ACTIVA_PORT, useClass: CarreraActivaTurnoAdapter },
    { provide: TURNO_ACTIVO_PORT_CONDUCTOR, useClass: TurnoActivoConductorAdapter },
    { provide: TURNO_ACTIVO_PORT, useClass: TurnoActivoVehiculoAdapter },
    CreateTurnoUseCase,
    ListTurnosUseCase,
    GetTurnoByIdUseCase,
    UpdateTurnoUseCase,
    DeleteTurnoUseCase,
  ],
  exports: [TURNO_REPOSITORY, TURNO_ACTIVO_PORT_CONDUCTOR, TURNO_ACTIVO_PORT],
})
export class TurnosModule {}
