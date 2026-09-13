import { Inject, Injectable } from '@nestjs/common';
import { BusinessRuleException } from '../../../../../common/exceptions/business-rule.exception';
import { DomainException } from '../../../../../common/exceptions/domain.exception';
import { Tarifa } from '../../domain/entities/tarifa.entity';
import { TarifaNotFoundException } from '../../domain/exceptions/tarifa-not-found.exception';
import { TarifaSolapadaException } from '../../domain/exceptions/tarifa-solapada.exception';
import { ITarifaRepository, TARIFA_REPOSITORY } from '../../domain/interfaces/tarifa.repository.interface';
import { UpdateTarifaDto } from '../dto/update-tarifa.dto';

@Injectable()
export class UpdateTarifaUseCase {
  constructor(
    @Inject(TARIFA_REPOSITORY)
    private readonly tarifaRepository: ITarifaRepository,
  ) {}

  async execute(id: number, dto: UpdateTarifaDto): Promise<Tarifa> {
    const tarifa = await this.tarifaRepository.findById(id);

    if (!tarifa) {
      throw new TarifaNotFoundException(id);
    }

    if (tarifa.hasStarted()) {
      throw new BusinessRuleException('No se puede modificar una tarifa cuya vigencia ya ha comenzado');
    }

    // Si se están actualizando fechas o reglaCalculo, debemos verificar solape
    const newDesde = dto.vigenciaDesde ?? tarifa.vigenciaDesde;
    const newHasta = dto.vigenciaHasta ?? tarifa.vigenciaHasta;
    const newRegla = dto.reglaCalculo ?? tarifa.reglaCalculo;

    if (newDesde >= newHasta) {
      throw new DomainException('vigenciaDesde debe ser anterior a vigenciaHasta');
    }

    const hasOverlap = await this.tarifaRepository.hasOverlap(newRegla, newDesde, newHasta, id);
    if (hasOverlap) {
      throw new TarifaSolapadaException(newRegla);
    }

    tarifa.update({
      nombre: dto.nombre,
      reglaCalculo: dto.reglaCalculo,
      valorBase: dto.valorBase,
      vigenciaDesde: dto.vigenciaDesde,
      vigenciaHasta: dto.vigenciaHasta,
    });

    const updated = await this.tarifaRepository.update(id, dto);

    if (!updated) {
      throw new TarifaNotFoundException(id);
    }

    return updated;
  }
}
