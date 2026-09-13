import { EntityNotFoundException } from '../../../../../common/exceptions/entity-not-found.exception';

export class TarifaNotFoundException extends EntityNotFoundException {
  constructor(id: number | string) {
    super(`Tarifa con identificador/criterio ${id} no encontrada`);
  }
}
