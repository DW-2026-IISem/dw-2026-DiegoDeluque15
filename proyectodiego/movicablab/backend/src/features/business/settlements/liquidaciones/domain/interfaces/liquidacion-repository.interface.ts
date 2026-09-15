import { LiquidacionProps } from '../entities/liquidacion.entity';
import { Transaction } from 'sequelize';

export const ILIQUIDACION_REPOSITORY = Symbol('ILIQUIDACION_REPOSITORY');

export interface ILiquidacionRepository {
  save(data: Omit<LiquidacionProps, 'id'>, t?: Transaction): Promise<LiquidacionProps>;
  findById(id: number): Promise<LiquidacionProps | null>;
  findAll(filters?: { estado?: string; fechaDesde?: Date; fechaHasta?: Date }): Promise<LiquidacionProps[]>;
  findByIdWithCarreras(id: number): Promise<(LiquidacionProps & { carreras?: any[] }) | null>;
  updateEstado(id: number, estado: string, t?: Transaction): Promise<LiquidacionProps | null>;
}
