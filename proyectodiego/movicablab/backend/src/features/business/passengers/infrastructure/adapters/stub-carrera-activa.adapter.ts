import { Injectable } from '@nestjs/common';
import { ICarreraActivaPort } from '../../domain/interfaces/carrera-activa.port.interface';

/**
 * Stub temporal: siempre retorna false.
 *
 * Mientras exista esta implementación, DeletePasajero nunca lanzará 409 por carreras
 * activas. ISS-09 (feature Carrera) debe reemplazar este adapter por una consulta
 * real a `carreras` con estado IN ('aceptada', 'en_curso').
 */
@Injectable()
export class StubCarreraActivaAdapter implements ICarreraActivaPort {
  async hasBlockingCarrerasForPasajero(_pasajeroId: number): Promise<boolean> {
    return false;
  }
}
