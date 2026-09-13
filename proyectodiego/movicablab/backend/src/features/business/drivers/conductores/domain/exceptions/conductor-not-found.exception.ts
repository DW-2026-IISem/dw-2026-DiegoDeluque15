import { EntityNotFoundException } from '../../../../../../common/exceptions/entity-not-found.exception';

export class ConductorNotFoundException extends EntityNotFoundException {
  constructor(id: number) {
    super(`Conductor con id ${id} no encontrado`);
  }
}
