import { BusinessRuleException } from '../../../../../../common/exceptions/business-rule.exception';

export class TurnoSolapadoException extends BusinessRuleException {
  constructor(recurso: string, id: number) {
    super(`El ${recurso} con id ${id} ya tiene un turno activo asignado`);
  }
}
