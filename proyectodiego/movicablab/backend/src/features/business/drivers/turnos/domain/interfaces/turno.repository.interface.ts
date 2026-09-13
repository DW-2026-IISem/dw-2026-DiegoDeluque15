import { PaginatedResult } from '../../../../../../common/interfaces/paginated-result.interface';
import {
  Turno,
  TurnoCreateProps,
  TurnoUpdateProps,
} from '../entities/turno.entity';

export const TURNO_REPOSITORY = Symbol('TURNO_REPOSITORY');

export interface TurnoListFilters {
  conductorId?: number;
  vehiculoId?: number;
  isActive?: boolean;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface ITurnoRepository {
  create(props: TurnoCreateProps): Promise<Turno>;
  findById(id: number): Promise<Turno | null>;
  findAll(
    filters: TurnoListFilters,
    pagination: PaginationParams,
  ): Promise<PaginatedResult<Turno>>;
  update(id: number, props: TurnoUpdateProps): Promise<Turno | null>;
  softDelete(id: number): Promise<Turno | null>;
  hasActiveTurnoForConductor(conductorId: number): Promise<boolean>;
  hasActiveTurnoForVehiculo(vehiculoId: number): Promise<boolean>;
}
