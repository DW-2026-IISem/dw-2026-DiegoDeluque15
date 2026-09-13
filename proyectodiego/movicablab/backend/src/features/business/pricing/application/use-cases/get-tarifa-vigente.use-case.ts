import { Inject, Injectable } from '@nestjs/common';
import { Tarifa } from '../../domain/entities/tarifa.entity';
import { TarifaNotFoundException } from '../../domain/exceptions/tarifa-not-found.exception';
import { ITarifaRepository, TARIFA_REPOSITORY } from '../../domain/interfaces/tarifa.repository.interface';

@Injectable()
export class GetTarifaVigenteUseCase {
  constructor(
    @Inject(TARIFA_REPOSITORY)
    private readonly tarifaRepository: ITarifaRepository,
  ) {}

  async execute(): Promise<Tarifa> {
    const now = new Date();
    const tarifa = await this.tarifaRepository.findVigente(now);

    if (!tarifa) {
      throw new TarifaNotFoundException('vigente');
    }

    return tarifa;
  }
}
