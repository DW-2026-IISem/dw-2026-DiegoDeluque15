import { Module } from '@nestjs/common';
import { PagoModel } from './infrastructure/persistence/models/pago.model';
import { SequelizePagoRepository } from './infrastructure/persistence/repositories/sequelize-pago.repository';
import { IPAGO_REPOSITORY } from './domain/interfaces/pago-repository.interface';
import { CrearPago } from './application/use-cases/crear-pago.use-case';
import { PagosController } from './presentation/http/controllers/pagos.controller';
import { TripsModule } from '../../trips/trips.module';

@Module({
  imports: [
    TripsModule,
  ],
  controllers: [PagosController],
  providers: [
    {
      provide: IPAGO_REPOSITORY,
      useClass: SequelizePagoRepository,
    },
    CrearPago,
  ],
  exports: [IPAGO_REPOSITORY],
})
export class PagosModule {}
