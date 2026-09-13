import { Injectable } from '@nestjs/common';
import { IConductorActivoPort } from '../../domain/interfaces/conductor-activo.port.interface';

/**
 * Stub temporal: siempre retorna false.
 *
 * Mientras exista esta implementación, DeleteEmpresa nunca lanzará 409 por
 * conductores activos. ISS-06 (feature Conductor) debe reemplazar
 * este adapter por una consulta real a `conductores` con is_active = true.
 */
@Injectable()
export class StubConductorActivoAdapter implements IConductorActivoPort {
  async hasActiveConductoresForEmpresa(_empresaId: number): Promise<boolean> {
    return false;
  }
}
