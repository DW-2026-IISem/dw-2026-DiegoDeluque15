import { Injectable, Inject } from '@nestjs/common';
import { ILIQUIDACION_REPOSITORY, ILiquidacionRepository } from '../../domain/interfaces/liquidacion-repository.interface';
import { LiquidacionNotFoundException } from '../../domain/exceptions/liquidacion-not-found.exception';

@Injectable()
export class GetLiquidacionById {
  constructor(
    @Inject(ILIQUIDACION_REPOSITORY) private readonly repo: ILiquidacionRepository,
  ) {}

  async execute(id: number) {
    const result = await this.repo.findByIdWithCarreras(id);
    if (!result) throw new LiquidacionNotFoundException(id);
    return result;
  }
}
