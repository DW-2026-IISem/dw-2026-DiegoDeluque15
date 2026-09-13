import { Inject, Injectable } from '@nestjs/common';
import { PaginatedResult } from '../../../../../../common/interfaces/paginated-result.interface';
import { Conductor } from '../../domain/entities/conductor.entity';
import {
  CONDUCTOR_REPOSITORY,
  IConductorRepository,
} from '../../domain/interfaces/conductor.repository.interface';
import { ListConductoresQueryDto } from '../dto/list-conductores-query.dto';

@Injectable()
export class ListConductoresUseCase {
  constructor(
    @Inject(CONDUCTOR_REPOSITORY)
    private readonly conductorRepository: IConductorRepository,
  ) {}

  async execute(query: ListConductoresQueryDto): Promise<PaginatedResult<Conductor>> {
    return this.conductorRepository.findAll(
      {
        empresaId: query.empresaId,
        isActive: query.isActive,
      },
      { page: query.page ?? 1, limit: query.limit ?? 10 },
    );
  }
}
