import { EntityNotFoundException } from '../../../../../../common/exceptions/entity-not-found.exception';

export class VehiculoInactiveException extends EntityNotFoundException {
  constructor(vehiculoId: number) {
    super(`Vehiculo con id ${vehiculoId} no encontrado o inactivo`);
  }
}
