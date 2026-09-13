import { BusinessRuleException } from '../../../../../../common/exceptions/business-rule.exception';

export class EmpresaNitAlreadyExistsException extends BusinessRuleException {
  constructor(nit: string) {
    super(`Ya existe una empresa con NIT '${nit}'`);
  }
}
