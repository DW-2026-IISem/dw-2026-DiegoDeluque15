import { BusinessRuleException } from '../../../../../common/exceptions/business-rule.exception';

export class EstadoInvalidoException extends BusinessRuleException {
  constructor(mensaje: string) {
    super(mensaje);
  }
}
