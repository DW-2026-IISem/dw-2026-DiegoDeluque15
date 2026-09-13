import { PaginatedResult } from '../../../../../../common/interfaces/paginated-result.interface';
import {
  Conductor,
  ConductorCreateProps,
  ConductorUpdateProps,
} from '../entities/conductor.entity';

export const CONDUCTOR_REPOSITORY = Symbol('CONDUCTOR_REPOSITORY');

export interface ConductorListFilters {
  empresaId?: number | null;
  isActive?: boolean;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface IConductorRepository {
  create(props: ConductorCreateProps): Promise<Conductor>;
  findById(id: number): Promise<Conductor | null>;
  findAll(
    filters: ConductorListFilters,
    pagination: PaginationParams,
  ): Promise<PaginatedResult<Conductor>>;
  update(id: number, props: ConductorUpdateProps): Promise<Conductor | null>;
  softDelete(id: number): Promise<Conductor | null>;
  countActiveByEmpresaId(empresaId: number): Promise<number>;
}
