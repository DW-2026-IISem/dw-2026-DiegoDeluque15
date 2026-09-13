import { EntityNotFoundException } from '../../../../../../common/exceptions/entity-not-found.exception';

export class TurnoNotFoundException extends EntityNotFoundException {
  constructor(id: number) {
    super(`Turno con id ${id} no encontrado`);
  }
}
