import { Injectable } from '@nestjs/common';
import { PagoModel } from '../models/pago.model';
import { IPagoRepository } from '../../../domain/interfaces/pago-repository.interface';
import { PagoProps } from '../../../domain/entities/pago.entity';

@Injectable()
export class SequelizePagoRepository implements IPagoRepository {
  async save(pago: PagoProps): Promise<PagoProps> {
    const created = await PagoModel.create(pago as any);
    return created.toJSON() as PagoProps;
  }

  async findById(id: number): Promise<PagoProps | null> {
    const pago = await PagoModel.findByPk(id);
    return pago ? pago.toJSON() as PagoProps : null;
  }

  async findAll(): Promise<PagoProps[]> {
    const pagos = await PagoModel.findAll();
    return pagos.map((p) => p.toJSON() as PagoProps);
  }

  async updateEstado(id: number, estado: string): Promise<PagoProps | null> {
    const [affectedCount] = await PagoModel.update({ estado }, { where: { id } });
    if (affectedCount === 0) return null;
    return this.findById(id);
  }
}
