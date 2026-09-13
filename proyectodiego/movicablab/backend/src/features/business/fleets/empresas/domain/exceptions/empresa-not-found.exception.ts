import { EntityNotFoundException } from '../../../../../../common/exceptions/entity-not-found.exception';

export class EmpresaNotFoundException extends EntityNotFoundException {
  constructor(id: number) {
    super(`Empresa con id ${id} no encontrada`);
  }
}
