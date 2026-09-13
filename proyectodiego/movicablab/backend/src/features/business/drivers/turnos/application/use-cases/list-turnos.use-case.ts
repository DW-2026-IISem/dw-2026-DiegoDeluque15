import { Inject, Injectable } from '@nestjs/common';
import { PaginatedResult } from '../../../../../../common/interfaces/paginated-result.interface';
import { Turno } from '../../domain/entities/turno.entity';
import {
  ITurnoRepository,
  TURNO_REPOSITORY,
} from '../../domain/interfaces/turno.repository.interface';
import { ListTurnosQueryDto } from '../dto/list-turnos-query.dto';

@Injectable()
export class ListTurnosUseCase {
  constructor(
    @Inject(TURNO_REPOSITORY)
    private readonly turnoRepository: ITurnoRepository,
  ) {}

  async execute(query: ListTurnosQueryDto): Promise<PaginatedResult<Turno>> {
    return this.turnoRepository.findAll(
      {
        conductorId: query.conductorId,
        vehiculoId: query.vehiculoId,
        isActive: query.isActive,
      },
      { page: query.page ?? 1, limit: query.limit ?? 10 },
    );
  }
}
