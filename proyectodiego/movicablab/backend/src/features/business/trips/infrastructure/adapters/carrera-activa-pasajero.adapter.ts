import { Injectable } from '@nestjs/common';
import { ICarreraActivaPort } from '../../../passengers/domain/interfaces/carrera-activa.port.interface';
import { CarreraModel } from '../persistence/models/carrera.model';
import { Op } from 'sequelize';

@Injectable()
export class CarreraActivaPasajeroAdapter implements ICarreraActivaPort {
  async hasBlockingCarrerasForPasajero(pasajeroId: number): Promise<boolean> {
    const count = await CarreraModel.count({
      where: {
        pasajeroId,
        estado: { [Op.in]: ['aceptada', 'en_curso'] },
      },
    });
    return count > 0;
  }
}
