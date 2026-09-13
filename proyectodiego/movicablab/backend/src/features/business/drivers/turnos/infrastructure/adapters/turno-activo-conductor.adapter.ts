import { Injectable } from '@nestjs/common';
import { ITurnoActivoPort } from '../../../conductores/domain/interfaces/turno-activo.port.interface';
import { TurnoModel } from '../persistence/models/turno.model';

/**
 * Implementación real del puerto usado por DeleteConductor (ISS-05).
 * Consulta turnos activos por conductor_id. Reemplaza StubTurnoActivoAdapter.
 */
@Injectable()
export class TurnoActivoConductorAdapter implements ITurnoActivoPort {
  async hasActiveTurnosForConductor(conductorId: number): Promise<boolean> {
    const count = await TurnoModel.count({
      where: { conductorId, isActive: true },
    });

    return count > 0;
  }
}
