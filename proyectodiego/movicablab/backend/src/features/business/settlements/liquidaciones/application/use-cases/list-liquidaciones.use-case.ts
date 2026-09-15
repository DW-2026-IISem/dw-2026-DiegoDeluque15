import { Injectable, Inject } from '@nestjs/common';
import { ILIQUIDACION_REPOSITORY, ILiquidacionRepository } from '../../domain/interfaces/liquidacion-repository.interface';

@Injectable()
export class ListLiquidaciones {
  constructor(
    @Inject(ILIQUIDACION_REPOSITORY) private readonly repo: ILiquidacionRepository,
  ) {}

  async execute(filters?: { estado?: string; fechaDesde?: string; fechaHasta?: string }) {
    return this.repo.findAll({
      estado: filters?.estado,
      fechaDesde: filters?.fechaDesde ? new Date(filters.fechaDesde) : undefined,
      fechaHasta: filters?.fechaHasta ? new Date(filters.fechaHasta) : undefined,
    });
  }
}
