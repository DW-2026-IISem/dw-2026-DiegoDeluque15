import { Injectable } from '@nestjs/common';
import { ICarreraActivaPort } from '../../../drivers/turnos/domain/interfaces/carrera-activa.port.interface';
import { CarreraModel } from '../persistence/models/carrera.model';
import { Op } from 'sequelize';

@Injectable()
export class CarreraActivaTurnoAdapter implements ICarreraActivaPort {
  async hasActiveCarrerasForTurno(turnoId: number): Promise<boolean> {
    const count = await CarreraModel.count({
      where: {
        turnoId,
        estado: { [Op.in]: ['solicitada', 'aceptada', 'en_curso'] },
      },
    });
    return count > 0;
  }
}
