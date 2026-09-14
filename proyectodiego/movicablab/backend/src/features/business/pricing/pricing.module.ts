import { Module, forwardRef } from '@nestjs/common';
import { TripsModule } from '../trips/trips.module';
import { CARRERA_ACTIVA_TARIFA_PORT } from './domain/interfaces/carrera-activa-tarifa.port.interface';
import { TARIFA_REPOSITORY } from './domain/interfaces/tarifa.repository.interface';
import { CreateTarifaUseCase } from './application/use-cases/create-tarifa.use-case';
import { DeleteTarifaUseCase } from './application/use-cases/delete-tarifa.use-case';
import { GetTarifaByIdUseCase } from './application/use-cases/get-tarifa-by-id.use-case';
import { GetTarifaVigenteUseCase } from './application/use-cases/get-tarifa-vigente.use-case';
import { ListTarifasUseCase } from './application/use-cases/list-tarifas.use-case';
import { UpdateTarifaUseCase } from './application/use-cases/update-tarifa.use-case';
import { CarreraActivaTarifaAdapter } from '../trips/infrastructure/adapters/carrera-activa-tarifa.adapter';
import { TarifaRepository } from './infrastructure/persistence/repositories/tarifa.repository';
import { TarifasController } from './presentation/http/controllers/tarifas.controller';

@Module({
  imports: [forwardRef(() => TripsModule)],
  controllers: [TarifasController],
  providers: [
    { provide: TARIFA_REPOSITORY, useClass: TarifaRepository },
    { provide: CARRERA_ACTIVA_TARIFA_PORT, useClass: CarreraActivaTarifaAdapter },
    CreateTarifaUseCase,
    ListTarifasUseCase,
    GetTarifaVigenteUseCase,
    GetTarifaByIdUseCase,
    UpdateTarifaUseCase,
    DeleteTarifaUseCase,
  ],
  exports: [TARIFA_REPOSITORY],
})
export class PricingModule {}
