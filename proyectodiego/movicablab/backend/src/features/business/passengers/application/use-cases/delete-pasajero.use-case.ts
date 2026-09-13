import { Inject, Injectable } from '@nestjs/common';
import { BusinessRuleException } from '../../../../../common/exceptions/business-rule.exception';
import { Pasajero } from '../../domain/entities/pasajero.entity';
import {
  CARRERA_ACTIVA_PORT,
  ICarreraActivaPort,
} from '../../domain/interfaces/carrera-activa.port.interface';
import { PasajeroNotFoundException } from '../../domain/exceptions/pasajero-not-found.exception';
import {
  IPasajeroRepository,
  PASAJERO_REPOSITORY,
} from '../../domain/interfaces/pasajero.repository.interface';

@Injectable()
export class DeletePasajeroUseCase {
  constructor(
    @Inject(PASAJERO_REPOSITORY)
    private readonly pasajeroRepository: IPasajeroRepository,
    @Inject(CARRERA_ACTIVA_PORT)
    private readonly carreraActivaPort: ICarreraActivaPort,
  ) {}

  async execute(id: number): Promise<Pasajero> {
    const pasajero = await this.pasajeroRepository.findById(id);

    if (!pasajero) {
      throw new PasajeroNotFoundException(id);
    }

    // ISS-09: StubCarreraActivaAdapter siempre retorna false hasta existir feature Carrera.
    const hasBlockingCarreras =
      await this.carreraActivaPort.hasBlockingCarrerasForPasajero(id);

    if (hasBlockingCarreras) {
      throw new BusinessRuleException(
        'No se puede eliminar el pasajero: tiene carreras en estado aceptada o en_curso',
      );
    }

    const deleted = await this.pasajeroRepository.softDelete(id);

    if (!deleted) {
      throw new PasajeroNotFoundException(id);
    }

    return deleted;
  }
}
