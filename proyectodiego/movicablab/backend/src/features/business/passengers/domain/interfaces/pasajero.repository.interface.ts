import { PaginatedResult } from '../../../../../common/interfaces/paginated-result.interface';
import { Pasajero, PasajeroCreateProps, PasajeroUpdateProps } from '../entities/pasajero.entity';

export const PASAJERO_REPOSITORY = Symbol('PASAJERO_REPOSITORY');

export interface PasajeroListFilters {
  isActive?: boolean;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface IPasajeroRepository {
  create(props: PasajeroCreateProps): Promise<Pasajero>;
  findById(id: number): Promise<Pasajero | null>;
  findAll(
    filters: PasajeroListFilters,
    pagination: PaginationParams,
  ): Promise<PaginatedResult<Pasajero>>;
  update(id: number, props: PasajeroUpdateProps): Promise<Pasajero | null>;
  softDelete(id: number): Promise<Pasajero | null>;
}
