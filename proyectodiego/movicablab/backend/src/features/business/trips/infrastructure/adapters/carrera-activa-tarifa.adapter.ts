import { Injectable } from '@nestjs/common';
import { ICarreraActivaTarifaPort } from '../../../pricing/domain/interfaces/carrera-activa-tarifa.port.interface';
import { CarreraModel } from '../persistence/models/carrera.model';
import { Op } from 'sequelize';

@Injectable()
export class CarreraActivaTarifaAdapter implements ICarreraActivaTarifaPort {
  async hasCarrerasForTarifa(tarifaId: number): Promise<boolean> {
    const count = await CarreraModel.count({
      where: {
        tarifaId,
        estado: { [Op.ne]: 'cancelada' },
      },
    });
    return count > 0;
  }
}
