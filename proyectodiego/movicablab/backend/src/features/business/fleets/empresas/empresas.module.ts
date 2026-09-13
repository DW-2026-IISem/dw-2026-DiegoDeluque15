import { Module } from '@nestjs/common';
import { CONDUCTOR_ACTIVO_PORT } from './domain/interfaces/conductor-activo.port.interface';
import { VEHICULO_ACTIVO_PORT } from './domain/interfaces/vehiculo-activo.port.interface';
import { EMPRESA_REPOSITORY } from './domain/interfaces/empresa.repository.interface';
import { CreateEmpresaUseCase } from './application/use-cases/create-empresa.use-case';
import { DeleteEmpresaUseCase } from './application/use-cases/delete-empresa.use-case';
import { GetEmpresaByIdUseCase } from './application/use-cases/get-empresa-by-id.use-case';
import { ListEmpresasUseCase } from './application/use-cases/list-empresas.use-case';
import { UpdateEmpresaUseCase } from './application/use-cases/update-empresa.use-case';
import { StubConductorActivoAdapter } from './infrastructure/adapters/stub-conductor-activo.adapter';
import { StubVehiculoActivoAdapter } from './infrastructure/adapters/stub-vehiculo-activo.adapter';
import { EmpresaRepository } from './infrastructure/persistence/repositories/empresa.repository';
import { EmpresasController } from './presentation/http/controllers/empresas.controller';

/**
 * Siembra de Empresa: no se ejecuta aquí. ISS-12 (o ISS-13) añadirá un orquestador
 * central de seeders (empresas → conductores → vehiculos → turnos → pasajeros → tarifas).
 */
@Module({
  controllers: [EmpresasController],
  providers: [
    { provide: EMPRESA_REPOSITORY, useClass: EmpresaRepository },
    { provide: CONDUCTOR_ACTIVO_PORT, useClass: StubConductorActivoAdapter },
    { provide: VEHICULO_ACTIVO_PORT, useClass: StubVehiculoActivoAdapter },
    CreateEmpresaUseCase,
    ListEmpresasUseCase,
    GetEmpresaByIdUseCase,
    UpdateEmpresaUseCase,
    DeleteEmpresaUseCase,
  ],
  exports: [EMPRESA_REPOSITORY],
})
export class EmpresasModule {}
