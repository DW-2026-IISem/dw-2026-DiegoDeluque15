import { Inject, Injectable } from '@nestjs/common';
import { Tarifa } from '../../domain/entities/tarifa.entity';
import { TarifaNotFoundException } from '../../domain/exceptions/tarifa-not-found.exception';
import { ITarifaRepository, TARIFA_REPOSITORY } from '../../domain/interfaces/tarifa.repository.interface';

@Injectable()
export class GetTarifaByIdUseCase {
  constructor(
    @Inject(TARIFA_REPOSITORY)
    private readonly tarifaRepository: ITarifaRepository,
  ) {}

  async execute(id: number): Promise<Tarifa> {
    const tarifa = await this.tarifaRepository.findById(id);

    if (!tarifa) {
      throw new TarifaNotFoundException(id);
    }

    return tarifa;
  }
}
