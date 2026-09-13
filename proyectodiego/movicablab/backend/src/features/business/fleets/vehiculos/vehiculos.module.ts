import { Module, forwardRef } from '@nestjs/common';
import { VEHICULO_ACTIVO_PORT } from '../empresas/domain/interfaces/vehiculo-activo.port.interface';
import { EmpresasModule } from '../empresas/empresas.module';
import { VEHICULO_REPOSITORY } from './domain/interfaces/vehiculo.repository.interface';
import { CreateVehiculoUseCase } from './application/use-cases/create-vehiculo.use-case';
import { DeleteVehiculoUseCase } from './application/use-cases/delete-vehiculo.use-case';
import { GetVehiculoByIdUseCase } from './application/use-cases/get-vehiculo-by-id.use-case';
import { ListVehiculosUseCase } from './application/use-cases/list-vehiculos.use-case';
import { UpdateVehiculoUseCase } from './application/use-cases/update-vehiculo.use-case';
import { VehiculoActivoAdapter } from './infrastructure/adapters/vehiculo-activo.adapter';
import { VehiculoRepository } from './infrastructure/persistence/repositories/vehiculo.repository';
import { VehiculosController } from './presentation/http/controllers/vehiculos.controller';
import { TurnosModule } from '../../drivers/turnos/turnos.module';

/**
 * Siembra de Vehículo: no se ejecuta aquí. ISS-13 añadirá un orquestador central
 * de seeders (empresas → conductores → vehiculos → turnos → pasajeros → tarifas).
 */
@Module({
  imports: [forwardRef(() => TurnosModule), forwardRef(() => EmpresasModule)],
  controllers: [VehiculosController],
  providers: [
    { provide: VEHICULO_REPOSITORY, useClass: VehiculoRepository },
    { provide: VEHICULO_ACTIVO_PORT, useClass: VehiculoActivoAdapter },
    CreateVehiculoUseCase,
    ListVehiculosUseCase,
    GetVehiculoByIdUseCase,
    UpdateVehiculoUseCase,
    DeleteVehiculoUseCase,
  ],
  exports: [VEHICULO_REPOSITORY, VEHICULO_ACTIVO_PORT],
})
export class VehiculosModule {}
