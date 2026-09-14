import { Inject, Injectable } from '@nestjs/common';
import { PaginatedResult } from '../../../../../common/interfaces/paginated-result.interface';
import { Carrera } from '../../domain/entities/carrera.entity';
import { ICarreraRepository, CARRERA_REPOSITORY } from '../../domain/interfaces/carrera.repository.interface';
import { ListCarrerasQueryDto } from '../dto/list-carreras-query.dto';

@Injectable()
export class ListCarrerasUseCase {
  constructor(
    @Inject(CARRERA_REPOSITORY)
    private readonly carreraRepository: ICarreraRepository,
  ) {}

  async execute(query: ListCarrerasQueryDto): Promise<PaginatedResult<Carrera>> {
    const filters = {
      estado: query.estado,
      pasajeroId: query.pasajeroId,
      turnoId: query.turnoId,
      fechaInicioDesde: query.fechaInicioDesde,
      fechaInicioHasta: query.fechaInicioHasta,
    };
    return this.carreraRepository.findAll({ page: query.page ?? 1, limit: query.limit ?? 10 }, filters);
  }
}
