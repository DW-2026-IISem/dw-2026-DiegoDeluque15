import { PaginatedResult } from '../../../../../../common/interfaces/paginated-result.interface';
import {
  Vehiculo,
  VehiculoCreateProps,
  VehiculoUpdateProps,
} from '../entities/vehiculo.entity';

export const VEHICULO_REPOSITORY = Symbol('VEHICULO_REPOSITORY');

export interface VehiculoListFilters {
  empresaId?: number;
  isActive?: boolean;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface IVehiculoRepository {
  create(props: VehiculoCreateProps): Promise<Vehiculo>;
  findById(id: number): Promise<Vehiculo | null>;
  findAll(
    filters: VehiculoListFilters,
    pagination: PaginationParams,
  ): Promise<PaginatedResult<Vehiculo>>;
  update(id: number, props: VehiculoUpdateProps): Promise<Vehiculo | null>;
  softDelete(id: number): Promise<Vehiculo | null>;
  countActiveByEmpresaId(empresaId: number): Promise<number>;
}
