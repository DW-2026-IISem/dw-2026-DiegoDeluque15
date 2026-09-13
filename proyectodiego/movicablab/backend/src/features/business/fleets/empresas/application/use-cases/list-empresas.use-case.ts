import { Inject, Injectable } from '@nestjs/common';
import { PaginatedResult } from '../../../../../../common/interfaces/paginated-result.interface';
import { Empresa } from '../../domain/entities/empresa.entity';
import {
  IEmpresaRepository,
  EMPRESA_REPOSITORY,
} from '../../domain/interfaces/empresa.repository.interface';
import { ListEmpresasQueryDto } from '../dto/list-empresas-query.dto';

@Injectable()
export class ListEmpresasUseCase {
  constructor(
    @Inject(EMPRESA_REPOSITORY)
    private readonly empresaRepository: IEmpresaRepository,
  ) {}

  async execute(query: ListEmpresasQueryDto): Promise<PaginatedResult<Empresa>> {
    return this.empresaRepository.findAll(
      { isActive: query.isActive },
      { page: query.page ?? 1, limit: query.limit ?? 10 },
    );
  }
}
