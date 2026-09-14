import { PaginatedResult } from '../../../../../common/interfaces/paginated-result.interface';
import { Carrera, CarreraProps } from '../entities/carrera.entity';

export const CARRERA_REPOSITORY = Symbol('CARRERA_REPOSITORY');

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface ListCarrerasFilters {
  estado?: string;
  pasajeroId?: number;
  turnoId?: number;
  fechaInicioDesde?: Date;
  fechaInicioHasta?: Date;
}

export interface ICarreraRepository {
  create(props: Omit<CarreraProps, 'id'>): Promise<Carrera>;
  findById(id: number): Promise<Carrera | null>;
  findAll(pagination: PaginationParams, filters?: ListCarrerasFilters): Promise<PaginatedResult<Carrera>>;
  update(id: number, props: Partial<CarreraProps>): Promise<Carrera | null>;
}
