import { Injectable } from '@nestjs/common';
import { IVehiculoActivoPort } from '../../../empresas/domain/interfaces/vehiculo-activo.port.interface';
import { VehiculoModel } from '../persistence/models/vehiculo.model';

/**
 * Implementación real del puerto usado por DeleteEmpresa (ISS-04).
 * Consulta vehículos activos por empresa_id.
 */
@Injectable()
export class VehiculoActivoAdapter implements IVehiculoActivoPort {
  async hasActiveVehiculosForEmpresa(empresaId: number): Promise<boolean> {
    const count = await VehiculoModel.count({
      where: { empresaId, isActive: true },
    });

    return count > 0;
  }
}
