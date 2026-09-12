import { ApplicationException } from './application.exception';

export class BusinessRuleException extends ApplicationException {
  constructor(message: string) {
    super(409, message, 'Conflict');
  }
}
