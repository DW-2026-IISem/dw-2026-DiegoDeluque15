import { EntityNotFoundException } from '../../../../../../common/exceptions/entity-not-found.exception';

export class ConductorInactiveException extends EntityNotFoundException {
  constructor(conductorId: number) {
    super(`Conductor con id ${conductorId} no encontrado o inactivo`);
  }
}
