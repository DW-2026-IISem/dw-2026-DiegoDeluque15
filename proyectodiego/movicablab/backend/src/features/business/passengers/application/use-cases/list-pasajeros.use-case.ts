import { Inject, Injectable } from '@nestjs/common';
import { PaginatedResult } from '../../../../../common/interfaces/paginated-result.interface';
import { Pasajero } from '../../domain/entities/pasajero.entity';
import {
  IPasajeroRepository,
  PASAJERO_REPOSITORY,
} from '../../domain/interfaces/pasajero.repository.interface';
import { ListPasajerosQueryDto } from '../dto/list-pasajeros-query.dto';

@Injectable()
export class ListPasajerosUseCase {
  constructor(
    @Inject(PASAJERO_REPOSITORY)
    private readonly pasajeroRepository: IPasajeroRepository,
  ) {}

  async execute(query: ListPasajerosQueryDto): Promise<PaginatedResult<Pasajero>> {
    return this.pasajeroRepository.findAll(
      { isActive: query.isActive },
      { page: query.page ?? 1, limit: query.limit ?? 10 },
    );
  }
}
