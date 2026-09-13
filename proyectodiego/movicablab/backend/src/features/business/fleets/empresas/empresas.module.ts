import { Module, forwardRef } from '@nestjs/common';
import { VehiculosModule } from '../vehiculos/vehiculos.module';

import { EMPRESA_REPOSITORY } from './domain/interfaces/empresa.repository.interface';
import { CreateEmpresaUseCase } from './application/use-cases/create-empresa.use-case';
import { DeleteEmpresaUseCase } from './application/use-cases/delete-empresa.use-case';
import { GetEmpresaByIdUseCase } from './application/use-cases/get-empresa-by-id.use-case';
import { ListEmpresasUseCase } from './application/use-cases/list-empresas.use-case';
import { UpdateEmpresaUseCase } from './application/use-cases/update-empresa.use-case';
import { ConductoresModule } from '../../drivers/conductores/conductores.module';
import { EmpresaRepository } from './infrastructure/persistence/repositories/empresa.repository';
import { EmpresasController } from './presentation/http/controllers/empresas.controller';

/**
 * Siembra de Empresa: no se ejecuta aquí. ISS-13 añadirá un orquestador central
 * de seeders (empresas → conductores → vehiculos → turnos → pasajeros → tarifas).
 */
@Module({
  imports: [forwardRef(() => VehiculosModule), forwardRef(() => ConductoresModule)],
  controllers: [EmpresasController],
  providers: [
    { provide: EMPRESA_REPOSITORY, useClass: EmpresaRepository },
    
    CreateEmpresaUseCase,
    ListEmpresasUseCase,
    GetEmpresaByIdUseCase,
    UpdateEmpresaUseCase,
    DeleteEmpresaUseCase,
  ],
  exports: [EMPRESA_REPOSITORY],
})
export class EmpresasModule {}
