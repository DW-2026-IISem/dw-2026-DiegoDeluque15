import { Inject, Injectable } from '@nestjs/common';
import { BusinessRuleException } from '../../../../../../common/exceptions/business-rule.exception';
import { Turno } from '../../domain/entities/turno.entity';
import { TurnoNotFoundException } from '../../domain/exceptions/turno-not-found.exception';
import {
  CARRERA_ACTIVA_PORT,
  ICarreraActivaPort,
} from '../../domain/interfaces/carrera-activa.port.interface';
import {
  ITurnoRepository,
  TURNO_REPOSITORY,
} from '../../domain/interfaces/turno.repository.interface';

@Injectable()
export class DeleteTurnoUseCase {
  constructor(
    @Inject(TURNO_REPOSITORY)
    private readonly turnoRepository: ITurnoRepository,
    @Inject(CARRERA_ACTIVA_PORT)
    private readonly carreraActivaPort: ICarreraActivaPort,
  ) {}

  async execute(id: number): Promise<Turno> {
    const turno = await this.turnoRepository.findById(id);

    if (!turno) {
      throw new TurnoNotFoundException(id);
    }

    // ISS-08: StubCarreraActivaAdapter siempre retorna false hasta existir feature Carrera.
    const hasActiveCarreras = await this.carreraActivaPort.hasActiveCarrerasForTurno(id);

    if (hasActiveCarreras) {
      throw new BusinessRuleException(
        'No se puede eliminar el turno: tiene carreras activas asociadas',
      );
    }

    const deleted = await this.turnoRepository.softDelete(id);

    if (!deleted) {
      throw new TurnoNotFoundException(id);
    }

    return deleted;
  }
}
