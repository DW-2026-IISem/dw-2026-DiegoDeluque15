import { Inject, Injectable } from '@nestjs/common';
import { BusinessRuleException } from '../../../../../../common/exceptions/business-rule.exception';
import { Empresa } from '../../domain/entities/empresa.entity';
import { EmpresaNotFoundException } from '../../domain/exceptions/empresa-not-found.exception';
import {
  CONDUCTOR_ACTIVO_PORT,
  IConductorActivoPort,
} from '../../domain/interfaces/conductor-activo.port.interface';
import {
  VEHICULO_ACTIVO_PORT,
  IVehiculoActivoPort,
} from '../../domain/interfaces/vehiculo-activo.port.interface';
import {
  IEmpresaRepository,
  EMPRESA_REPOSITORY,
} from '../../domain/interfaces/empresa.repository.interface';

@Injectable()
export class DeleteEmpresaUseCase {
  constructor(
    @Inject(EMPRESA_REPOSITORY)
    private readonly empresaRepository: IEmpresaRepository,
    @Inject(CONDUCTOR_ACTIVO_PORT)
    private readonly conductorActivoPort: IConductorActivoPort,
    @Inject(VEHICULO_ACTIVO_PORT)
    private readonly vehiculoActivoPort: IVehiculoActivoPort,
  ) {}

  async execute(id: number): Promise<Empresa> {
    const empresa = await this.empresaRepository.findById(id);

    if (!empresa) {
      throw new EmpresaNotFoundException(id);
    }

    // ISS-06: StubConductorActivoAdapter siempre retorna false hasta existir feature Conductor.
    const hasConductores =
      await this.conductorActivoPort.hasActiveConductoresForEmpresa(id);

    if (hasConductores) {
      throw new BusinessRuleException(
        'No se puede eliminar la empresa: tiene conductores activos asociados',
      );
    }

    // ISS-05: StubVehiculoActivoAdapter siempre retorna false hasta existir feature Vehículo.
    const hasVehiculos =
      await this.vehiculoActivoPort.hasActiveVehiculosForEmpresa(id);

    if (hasVehiculos) {
      throw new BusinessRuleException(
        'No se puede eliminar la empresa: tiene vehículos activos asociados',
      );
    }

    const deleted = await this.empresaRepository.softDelete(id);

    if (!deleted) {
      throw new EmpresaNotFoundException(id);
    }

    return deleted;
  }
}
