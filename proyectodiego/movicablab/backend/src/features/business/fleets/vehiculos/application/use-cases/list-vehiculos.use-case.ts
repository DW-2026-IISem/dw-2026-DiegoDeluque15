import { Inject, Injectable } from '@nestjs/common';
import { PaginatedResult } from '../../../../../../common/interfaces/paginated-result.interface';
import { Vehiculo } from '../../domain/entities/vehiculo.entity';
import {
  IVehiculoRepository,
  VEHICULO_REPOSITORY,
} from '../../domain/interfaces/vehiculo.repository.interface';
import { ListVehiculosQueryDto } from '../dto/list-vehiculos-query.dto';

@Injectable()
export class ListVehiculosUseCase {
  constructor(
    @Inject(VEHICULO_REPOSITORY)
    private readonly vehiculoRepository: IVehiculoRepository,
  ) {}

  async execute(query: ListVehiculosQueryDto): Promise<PaginatedResult<Vehiculo>> {
    return this.vehiculoRepository.findAll(
      {
        empresaId: query.empresaId,
        isActive: query.isActive,
      },
      { page: query.page ?? 1, limit: query.limit ?? 10 },
    );
  }
}
