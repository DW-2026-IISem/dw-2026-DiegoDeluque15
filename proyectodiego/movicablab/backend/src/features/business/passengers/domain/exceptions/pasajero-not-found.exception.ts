import { EntityNotFoundException } from '../../../../../common/exceptions/entity-not-found.exception';

export class PasajeroNotFoundException extends EntityNotFoundException {
  constructor(id: number) {
    super(`Pasajero con id ${id} no encontrado`);
  }
}
