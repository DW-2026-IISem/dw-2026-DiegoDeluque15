import { Injectable } from '@nestjs/common';
import { ICarreraActivaPort } from '../../domain/interfaces/carrera-activa.port.interface';

/**
 * Stub temporal: siempre retorna false.
 *
 * Mientras exista esta implementación, DeleteTurno nunca lanzará 409 por carreras
 * activas. ISS-08 (feature Carrera) debe reemplazar este adapter por una consulta
 * real a `carreras` con turno_id y estado IN ('solicitada','aceptada','en_curso').
 */
@Injectable()
export class StubCarreraActivaAdapter implements ICarreraActivaPort {
  async hasActiveCarrerasForTurno(_turnoId: number): Promise<boolean> {
    return false;
  }
}
