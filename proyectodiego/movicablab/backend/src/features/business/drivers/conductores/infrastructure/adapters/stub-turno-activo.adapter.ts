import { Injectable } from '@nestjs/common';
import { ITurnoActivoPort } from '../../domain/interfaces/turno-activo.port.interface';

/**
 * Stub temporal: siempre retorna false.
 *
 * Mientras exista esta implementación, DeleteConductor nunca lanzará 409 por turnos
 * activos. ISS-06 (feature Turno) debe reemplazar este adapter por una consulta
 * real a `turnos` con conductor_id e is_active = true.
 */
@Injectable()
export class StubTurnoActivoAdapter implements ITurnoActivoPort {
  async hasActiveTurnosForConductor(_conductorId: number): Promise<boolean> {
    return false;
  }
}
