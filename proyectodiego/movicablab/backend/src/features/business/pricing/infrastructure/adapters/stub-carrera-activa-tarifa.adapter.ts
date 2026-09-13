import { Injectable } from '@nestjs/common';
import { ICarreraActivaTarifaPort } from '../../domain/interfaces/carrera-activa-tarifa.port.interface';

/**
 * Stub temporal: siempre retorna false.
 *
 * ISS-08 (feature Carrera) debe reemplazar este adapter por una consulta
 * real a la tabla `carreras` filtrando por tarifa_id.
 */
@Injectable()
export class StubCarreraActivaTarifaAdapter implements ICarreraActivaTarifaPort {
  async hasCarrerasForTarifa(_tarifaId: number): Promise<boolean> {
    return false;
  }
}
