import { PaginatedResult } from '../../../../../common/interfaces/paginated-result.interface';
import {
  Tarifa,
  TarifaCreateProps,
  TarifaUpdateProps,
} from '../entities/tarifa.entity';

export const TARIFA_REPOSITORY = Symbol('TARIFA_REPOSITORY');

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface ITarifaRepository {
  create(props: TarifaCreateProps): Promise<Tarifa>;
  findById(id: number): Promise<Tarifa | null>;
  findAll(pagination: PaginationParams): Promise<PaginatedResult<Tarifa>>;
  update(id: number, props: TarifaUpdateProps): Promise<Tarifa | null>;
  softDelete(id: number): Promise<Tarifa | null>;
  
  /**
   * Verifica si existe alguna tarifa activa para la misma reglaCalculo
   * cuyo rango de fechas [vigenciaDesde, vigenciaHasta] se solape 
   * con el rango proporcionado.
   */
  hasOverlap(reglaCalculo: string, desde: Date, hasta: Date, excludeId?: number): Promise<boolean>;
  
  /**
   * Obtiene la tarifa activa (isActive=true) cuya fecha actual se encuentre
   * dentro de [vigenciaDesde, vigenciaHasta].
   */
  findVigente(fechaActual: Date): Promise<Tarifa | null>;
}
