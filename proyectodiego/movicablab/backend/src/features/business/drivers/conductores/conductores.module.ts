import { Module, forwardRef } from '@nestjs/common';
import { CONDUCTOR_ACTIVO_PORT } from '../../fleets/empresas/domain/interfaces/conductor-activo.port.interface';
import { EmpresasModule } from '../../fleets/empresas/empresas.module';
import { TURNO_ACTIVO_PORT_CONDUCTOR } from './domain/interfaces/turno-activo.port.interface';
import { CONDUCTOR_REPOSITORY } from './domain/interfaces/conductor.repository.interface';
import { CreateConductorUseCase } from './application/use-cases/create-conductor.use-case';
import { DeleteConductorUseCase } from './application/use-cases/delete-conductor.use-case';
import { GetConductorByIdUseCase } from './application/use-cases/get-conductor-by-id.use-case';
import { ListConductoresUseCase } from './application/use-cases/list-conductores.use-case';
import { UpdateConductorUseCase } from './application/use-cases/update-conductor.use-case';
import { StubTurnoActivoAdapter } from './infrastructure/adapters/stub-turno-activo.adapter';
import { ConductorActivoAdapter } from './infrastructure/adapters/conductor-activo.adapter';
import { ConductorRepository } from './infrastructure/persistence/repositories/conductor.repository';
import { ConductoresController } from './presentation/http/controllers/conductores.controller';

/**
 * Siembra de Conductor: no se ejecuta aquí. ISS-13 añadirá un orquestador central
 * de seeders (empresas -> conductores -> vehiculos -> turnos -> pasajeros -> tarifas).
 */
@Module({
  imports: [forwardRef(() => EmpresasModule)],
  controllers: [ConductoresController],
  providers: [
    { provide: CONDUCTOR_REPOSITORY, useClass: ConductorRepository },
    { provide: TURNO_ACTIVO_PORT_CONDUCTOR, useClass: StubTurnoActivoAdapter },
    { provide: CONDUCTOR_ACTIVO_PORT, useClass: ConductorActivoAdapter },
    CreateConductorUseCase,
    ListConductoresUseCase,
    GetConductorByIdUseCase,
    UpdateConductorUseCase,
    DeleteConductorUseCase,
  ],
  exports: [CONDUCTOR_REPOSITORY, CONDUCTOR_ACTIVO_PORT],
})
export class ConductoresModule {}
