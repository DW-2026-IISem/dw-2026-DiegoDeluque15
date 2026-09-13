import { BusinessRuleException } from '../../../../../../common/exceptions/business-rule.exception';

export class EmpresaInactiveException extends BusinessRuleException {
  constructor(empresaId: number) {
    super(`La empresa con id ${empresaId} está inactiva`);
  }
}
