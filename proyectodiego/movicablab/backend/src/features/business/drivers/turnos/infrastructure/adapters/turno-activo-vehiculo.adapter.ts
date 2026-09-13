import { Injectable } from '@nestjs/common';
import { ITurnoActivoPort } from '../../../../fleets/vehiculos/domain/interfaces/turno-activo.port.interface';
import { TurnoModel } from '../persistence/models/turno.model';

/**
 * Implementación real del puerto usado por DeleteVehiculo (ISS-05).
 * Consulta turnos activos por vehiculo_id. Reemplaza StubTurnoActivoAdapter.
 */
@Injectable()
export class TurnoActivoVehiculoAdapter implements ITurnoActivoPort {
  async hasActiveTurnosForVehiculo(vehiculoId: number): Promise<boolean> {
    const count = await TurnoModel.count({
      where: { vehiculoId, isActive: true },
    });

    return count > 0;
  }
}
