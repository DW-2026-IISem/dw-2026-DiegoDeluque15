import { EntityNotFoundException } from '../../../../../common/exceptions/entity-not-found.exception';

export class CarreraNotFoundException extends EntityNotFoundException {
  constructor(id: number | string) {
    super(`Carrera con identificador ${id} no encontrada`);
  }
}
