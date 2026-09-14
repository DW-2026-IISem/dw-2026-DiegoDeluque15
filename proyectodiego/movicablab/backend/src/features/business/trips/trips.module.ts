import { Module, forwardRef } from '@nestjs/common';
import { CARRERA_REPOSITORY } from './domain/interfaces/carrera.repository.interface';
import { CarreraRepository } from './infrastructure/persistence/repositories/carrera.repository';

// Use Cases
import { CreateCarreraUseCase } from './application/use-cases/create-carrera.use-case';
import { CambiarEstadoCarreraUseCase } from './application/use-cases/cambiar-estado-carrera.use-case';
import { ListCarrerasUseCase } from './application/use-cases/list-carreras.use-case';
import { GetCarreraByIdUseCase } from './application/use-cases/get-carrera-by-id.use-case';

// Controllers
import { CarrerasController } from './presentation/http/controllers/carreras.controller';
import { DespachosController } from './presentation/http/controllers/despachos.controller';

// Adapters
import { CarreraActivaPasajeroAdapter } from './infrastructure/adapters/carrera-activa-pasajero.adapter';
import { CarreraActivaTurnoAdapter } from './infrastructure/adapters/carrera-activa-turno.adapter';
import { CarreraActivaTarifaAdapter } from './infrastructure/adapters/carrera-activa-tarifa.adapter';

// Puertos
import { CARRERA_ACTIVA_PORT as CARRERA_ACTIVA_PASAJERO_PORT } from '../passengers/domain/interfaces/carrera-activa.port.interface';
import { CARRERA_ACTIVA_PORT as CARRERA_ACTIVA_TURNO_PORT } from '../drivers/turnos/domain/interfaces/carrera-activa.port.interface';
import { CARRERA_ACTIVA_TARIFA_PORT } from '../pricing/domain/interfaces/carrera-activa-tarifa.port.interface';

// Dependencias cruzadas
import { PassengersModule } from '../passengers/passengers.module';
import { DriversModule } from '../drivers/drivers.module';
import { PricingModule } from '../pricing/pricing.module';

@Module({
  imports: [
    forwardRef(() => PassengersModule),
    forwardRef(() => DriversModule),
    forwardRef(() => PricingModule),
  ],
  controllers: [CarrerasController, DespachosController],
  providers: [
    { provide: CARRERA_REPOSITORY, useClass: CarreraRepository },
    { provide: CARRERA_ACTIVA_PASAJERO_PORT, useClass: CarreraActivaPasajeroAdapter },
    { provide: CARRERA_ACTIVA_TURNO_PORT, useClass: CarreraActivaTurnoAdapter },
    { provide: CARRERA_ACTIVA_TARIFA_PORT, useClass: CarreraActivaTarifaAdapter },
    CreateCarreraUseCase,
    CambiarEstadoCarreraUseCase,
    ListCarrerasUseCase,
    GetCarreraByIdUseCase,
  ],
  exports: [
    CARRERA_REPOSITORY,
    CARRERA_ACTIVA_PASAJERO_PORT,
    CARRERA_ACTIVA_TURNO_PORT,
    CARRERA_ACTIVA_TARIFA_PORT,
  ],
})
export class TripsModule {}
