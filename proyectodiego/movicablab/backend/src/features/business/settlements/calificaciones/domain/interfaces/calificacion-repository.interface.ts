import { CalificacionProps } from '../entities/calificacion.entity';

export interface ICalificacionRepository {
  save(calificacion: CalificacionProps): Promise<CalificacionProps>;
  findById(id: number): Promise<CalificacionProps | null>;
  findByCarreraId(carreraId: number): Promise<CalificacionProps | null>;
  findAll(): Promise<CalificacionProps[]>;
  update(id: number, data: Partial<CalificacionProps>): Promise<CalificacionProps | null>;
  delete(id: number): Promise<boolean>;
}

export const ICALIFICACION_REPOSITORY = Symbol('ICALIFICACION_REPOSITORY');
