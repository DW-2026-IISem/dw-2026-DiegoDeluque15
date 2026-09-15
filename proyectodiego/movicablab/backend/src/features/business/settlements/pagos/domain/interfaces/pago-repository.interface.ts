import { PagoProps } from '../entities/pago.entity';

export interface IPagoRepository {
  save(pago: PagoProps): Promise<PagoProps>;
  findById(id: number): Promise<PagoProps | null>;
  findAll(): Promise<PagoProps[]>;
  updateEstado(id: number, estado: string): Promise<PagoProps | null>;
}

export const IPAGO_REPOSITORY = Symbol('IPAGO_REPOSITORY');
