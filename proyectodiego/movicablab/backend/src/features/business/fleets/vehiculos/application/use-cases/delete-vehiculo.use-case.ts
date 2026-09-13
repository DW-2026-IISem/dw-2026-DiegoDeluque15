import { Inject, Injectable } from '@nestjs/common';
import { BusinessRuleException } from '../../../../../../common/exceptions/business-rule.exception';
import { Vehiculo } from '../../domain/entities/vehiculo.entity';
import { VehiculoNotFoundException } from '../../domain/exceptions/vehiculo-not-found.exception';
import {
  ITurnoActivoPort,
  TURNO_ACTIVO_PORT,
} from '../../domain/interfaces/turno-activo.port.interface';
import {
  IVehiculoRepository,
  VEHICULO_REPOSITORY,
} from '../../domain/interfaces/vehiculo.repository.interface';

@Injectable()
export class DeleteVehiculoUseCase {
  constructor(
    @Inject(VEHICULO_REPOSITORY)
    private readonly vehiculoRepository: IVehiculoRepository,
    @Inject(TURNO_ACTIVO_PORT)
    private readonly turnoActivoPort: ITurnoActivoPort,
  ) {}

  async execute(id: number): Promise<Vehiculo> {
    const vehiculo = await this.vehiculoRepository.findById(id);

    if (!vehiculo) {
      throw new VehiculoNotFoundException(id);
    }

    // ISS-06: StubTurnoActivoAdapter siempre retorna false hasta existir feature Turno.
    const hasActiveTurnos = await this.turnoActivoPort.hasActiveTurnosForVehiculo(id);

    if (hasActiveTurnos) {
      throw new BusinessRuleException(
        'No se puede eliminar el vehículo: tiene turnos activos asociados',
      );
    }

    const deleted = await this.vehiculoRepository.softDelete(id);

    if (!deleted) {
      throw new VehiculoNotFoundException(id);
    }

    return deleted;
  }
}
