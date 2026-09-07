import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { PASAJERO_REPOSITORY } from './domain/interfaces/pasajero-repository.interface.js';
import { PasajeroModel } from './infrastructure/persistence/models/pasajero.model.js';
import { PasajeroRepository } from './infrastructure/persistence/repositories/pasajero.repository.js';
import { PasajeroController } from './presentation/http/controllers/pasajero.controller.js';
import { ActualizarPasajeroUseCase } from './application/use-cases/actualizar-pasajero.use-case.js';
import { CrearPasajeroUseCase } from './application/use-cases/crear-pasajero.use-case.js';
import { EliminarPasajeroUseCase } from './application/use-cases/eliminar-pasajero.use-case.js';
import { ListarPasajerosUseCase } from './application/use-cases/listar-pasajeros.use-case.js';
import { ObtenerPasajeroUseCase } from './application/use-cases/obtener-pasajero.use-case.js';

@Module({
  imports: [SequelizeModule.forFeature([PasajeroModel])],
  controllers: [PasajeroController],
  providers: [
    { provide: PASAJERO_REPOSITORY, useClass: PasajeroRepository },
    CrearPasajeroUseCase,
    ListarPasajerosUseCase,
    ObtenerPasajeroUseCase,
    ActualizarPasajeroUseCase,
    EliminarPasajeroUseCase,
  ],
})
export class PassengersModule {}
