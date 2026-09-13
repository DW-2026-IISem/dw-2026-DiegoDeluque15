import { BusinessRuleException } from '../../../../../common/exceptions/business-rule.exception';

export class TarifaSolapadaException extends BusinessRuleException {
  constructor(reglaCalculo: string) {
    super(`Ya existe una tarifa activa para la regla de cálculo '${reglaCalculo}' que se solapa con las fechas proporcionadas`);
  }
}
