import { Inject, Injectable } from '@nestjs/common';
import { BusinessRuleException } from '../../../../../common/exceptions/business-rule.exception';
import { Tarifa } from '../../domain/entities/tarifa.entity';
import { TarifaNotFoundException } from '../../domain/exceptions/tarifa-not-found.exception';
import { CARRERA_ACTIVA_TARIFA_PORT, ICarreraActivaTarifaPort } from '../../domain/interfaces/carrera-activa-tarifa.port.interface';
import { ITarifaRepository, TARIFA_REPOSITORY } from '../../domain/interfaces/tarifa.repository.interface';

@Injectable()
export class DeleteTarifaUseCase {
  constructor(
    @Inject(TARIFA_REPOSITORY)
    private readonly tarifaRepository: ITarifaRepository,
    @Inject(CARRERA_ACTIVA_TARIFA_PORT)
    private readonly carreraActivaPort: ICarreraActivaTarifaPort,
  ) {}

  async execute(id: number): Promise<Tarifa> {
    const tarifa = await this.tarifaRepository.findById(id);

    if (!tarifa) {
      throw new TarifaNotFoundException(id);
    }

    // ISS-08: Adapter real CarreraActivaTarifaAdapter — consulta carreras asociadas a la tarifa.
    const hasCarreras = await this.carreraActivaPort.hasCarrerasForTarifa(id);
    if (hasCarreras) {
      throw new BusinessRuleException('No se puede eliminar la tarifa porque tiene carreras asociadas');
    }

    const deleted = await this.tarifaRepository.softDelete(id);

    if (!deleted) {
      throw new TarifaNotFoundException(id);
    }

    return deleted;
  }
}
