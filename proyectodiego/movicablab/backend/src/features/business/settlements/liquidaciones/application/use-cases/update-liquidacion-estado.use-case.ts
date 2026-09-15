import { Injectable, Inject } from '@nestjs/common';
import { ILIQUIDACION_REPOSITORY, ILiquidacionRepository } from '../../domain/interfaces/liquidacion-repository.interface';
import { LiquidacionNotFoundException } from '../../domain/exceptions/liquidacion-not-found.exception';
import { ConflictException } from '@nestjs/common';

@Injectable()
export class UpdateLiquidacionEstado {
  constructor(
    @Inject(ILIQUIDACION_REPOSITORY) private readonly repo: ILiquidacionRepository,
  ) {}

  async execute(id: number, estado: string) {
    const existing = await this.repo.findById(id);
    if (!existing) throw new LiquidacionNotFoundException(id);
    if (existing.estado !== 'pendiente') {
      throw new ConflictException(`Solo se puede marcar como pagada una liquidacion en estado pendiente (estado actual: ${existing.estado})`);
    }
    return this.repo.updateEstado(id, estado);
  }
}
