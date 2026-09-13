import { PaginatedResult } from '../../../../../../common/interfaces/paginated-result.interface';
import { Empresa, EmpresaCreateProps, EmpresaUpdateProps } from '../entities/empresa.entity';

export const EMPRESA_REPOSITORY = Symbol('EMPRESA_REPOSITORY');

export interface EmpresaListFilters {
  isActive?: boolean;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface IEmpresaRepository {
  create(props: EmpresaCreateProps): Promise<Empresa>;
  findById(id: number): Promise<Empresa | null>;
  findByNit(nit: string): Promise<Empresa | null>;
  findAll(
    filters: EmpresaListFilters,
    pagination: PaginationParams,
  ): Promise<PaginatedResult<Empresa>>;
  update(id: number, props: EmpresaUpdateProps): Promise<Empresa | null>;
  softDelete(id: number): Promise<Empresa | null>;
}
