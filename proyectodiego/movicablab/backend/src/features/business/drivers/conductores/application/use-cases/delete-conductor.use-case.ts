import { Inject, Injectable } from '@nestjs/common';
import { BusinessRuleException } from '../../../../../../common/exceptions/business-rule.exception';
import { Conductor } from '../../domain/entities/conductor.entity';
import { ConductorNotFoundException } from '../../domain/exceptions/conductor-not-found.exception';
import {
  ITurnoActivoPort,
  TURNO_ACTIVO_PORT_CONDUCTOR,
} from '../../domain/interfaces/turno-activo.port.interface';
import {
  CONDUCTOR_REPOSITORY,
  IConductorRepository,
} from '../../domain/interfaces/conductor.repository.interface';

@Injectable()
export class DeleteConductorUseCase {
  constructor(
    @Inject(CONDUCTOR_REPOSITORY)
    private readonly conductorRepository: IConductorRepository,
    @Inject(TURNO_ACTIVO_PORT_CONDUCTOR)
    private readonly turnoActivoPort: ITurnoActivoPort,
  ) {}

  async execute(id: number): Promise<Conductor> {
    const conductor = await this.conductorRepository.findById(id);

    if (!conductor) {
      throw new ConductorNotFoundException(id);
    }

    // ISS-06: StubTurnoActivoAdapter siempre retorna false hasta existir feature Turno.
    const hasActiveTurnos = await this.turnoActivoPort.hasActiveTurnosForConductor(id);

    if (hasActiveTurnos) {
      throw new BusinessRuleException(
        'No se puede eliminar el conductor: tiene turnos activos asociados',
      );
    }

    const deleted = await this.conductorRepository.softDelete(id);

    if (!deleted) {
      throw new ConductorNotFoundException(id);
    }

    return deleted;
  }
}
