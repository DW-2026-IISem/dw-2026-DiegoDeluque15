import { Module, forwardRef } from '@nestjs/common';
import { TripsModule } from '../trips/trips.module';
import { CARRERA_ACTIVA_PORT } from './domain/interfaces/carrera-activa.port.interface';
import { PASAJERO_REPOSITORY } from './domain/interfaces/pasajero.repository.interface';
import { CreatePasajeroUseCase } from './application/use-cases/create-pasajero.use-case';
import { DeletePasajeroUseCase } from './application/use-cases/delete-pasajero.use-case';
import { GetPasajeroByIdUseCase } from './application/use-cases/get-pasajero-by-id.use-case';
import { ListPasajerosUseCase } from './application/use-cases/list-pasajeros.use-case';
import { UpdatePasajeroUseCase } from './application/use-cases/update-pasajero.use-case';
import { CarreraActivaPasajeroAdapter } from '../trips/infrastructure/adapters/carrera-activa-pasajero.adapter';
import { PasajeroRepository } from './infrastructure/persistence/repositories/pasajero.repository';
import { PasajerosController } from './presentation/http/controllers/pasajeros.controller';

@Module({
  imports: [forwardRef(() => TripsModule)],
  controllers: [PasajerosController],
  providers: [
    { provide: PASAJERO_REPOSITORY, useClass: PasajeroRepository },
    { provide: CARRERA_ACTIVA_PORT, useClass: CarreraActivaPasajeroAdapter },
    CreatePasajeroUseCase,
    ListPasajerosUseCase,
    GetPasajeroByIdUseCase,
    UpdatePasajeroUseCase,
    DeletePasajeroUseCase,
  ],
  exports: [PASAJERO_REPOSITORY],
})
export class PassengersModule {}
