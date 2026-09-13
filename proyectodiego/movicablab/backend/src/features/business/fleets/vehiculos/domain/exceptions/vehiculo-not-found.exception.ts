import { EntityNotFoundException } from '../../../../../../common/exceptions/entity-not-found.exception';

export class VehiculoNotFoundException extends EntityNotFoundException {
  constructor(id: number) {
    super(`Vehículo con id ${id} no encontrado`);
  }
}
