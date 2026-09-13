import { Inject, Injectable } from '@nestjs/common';
import { BusinessRuleException } from '../../../../../common/exceptions/business-rule.exception';
import { DomainException } from '../../../../../common/exceptions/domain.exception';
import { Tarifa } from '../../domain/entities/tarifa.entity';
import { TarifaSolapadaException } from '../../domain/exceptions/tarifa-solapada.exception';
import { ITarifaRepository, TARIFA_REPOSITORY } from '../../domain/interfaces/tarifa.repository.interface';
import { CreateTarifaDto } from '../dto/create-tarifa.dto';

@Injectable()
export class CreateTarifaUseCase {
  constructor(
    @Inject(TARIFA_REPOSITORY)
    private readonly tarifaRepository: ITarifaRepository,
  ) {}

  async execute(dto: CreateTarifaDto): Promise<Tarifa> {
    if (dto.vigenciaDesde >= dto.vigenciaHasta) {
      throw new DomainException('vigenciaDesde debe ser anterior a vigenciaHasta');
    }

    const hasOverlap = await this.tarifaRepository.hasOverlap(
      dto.reglaCalculo,
      dto.vigenciaDesde,
      dto.vigenciaHasta,
    );

    if (hasOverlap) {
      throw new TarifaSolapadaException(dto.reglaCalculo);
    }

    const props = Tarifa.create(dto);
    return this.tarifaRepository.create(props);
  }
}
