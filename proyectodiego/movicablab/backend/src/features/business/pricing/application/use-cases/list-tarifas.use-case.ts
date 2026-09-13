import { Inject, Injectable } from '@nestjs/common';
import { PaginatedResult } from '../../../../../common/interfaces/paginated-result.interface';
import { Tarifa } from '../../domain/entities/tarifa.entity';
import { ITarifaRepository, TARIFA_REPOSITORY } from '../../domain/interfaces/tarifa.repository.interface';
import { ListTarifasQueryDto } from '../dto/list-tarifas-query.dto';

@Injectable()
export class ListTarifasUseCase {
  constructor(
    @Inject(TARIFA_REPOSITORY)
    private readonly tarifaRepository: ITarifaRepository,
  ) {}

  async execute(query: ListTarifasQueryDto): Promise<PaginatedResult<Tarifa>> {
    return this.tarifaRepository.findAll({ page: query.page ?? 1, limit: query.limit ?? 10 });
  }
}
