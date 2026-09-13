import { Injectable } from '@nestjs/common';
import { IVehiculoActivoPort } from '../../domain/interfaces/vehiculo-activo.port.interface';

/**
 * Stub temporal: siempre retorna false.
 *
 * Mientras exista esta implementación, DeleteEmpresa nunca lanzará 409 por
 * vehículos activos. ISS-05 (feature Vehiculo) debe reemplazar
 * este adapter por una consulta real a `vehiculos` con is_active = true.
 */
@Injectable()
export class StubVehiculoActivoAdapter implements IVehiculoActivoPort {
  async hasActiveVehiculosForEmpresa(_empresaId: number): Promise<boolean> {
    return false;
  }
}
