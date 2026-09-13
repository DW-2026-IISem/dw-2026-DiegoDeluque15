import { Injectable } from '@nestjs/common';
import { IConductorActivoPort } from '../../../../fleets/empresas/domain/interfaces/conductor-activo.port.interface';
import { ConductorModel } from '../persistence/models/conductor.model';

/**
 * Implementación real del puerto usado por DeleteEmpresa (ISS-04).
 * Consulta conductores activos por empresa_id.
 */
@Injectable()
export class ConductorActivoAdapter implements IConductorActivoPort {
  async hasActiveConductoresForEmpresa(empresaId: number): Promise<boolean> {
    const count = await ConductorModel.count({
      where: { empresaId, isActive: true },
    });

    return count > 0;
  }
}
