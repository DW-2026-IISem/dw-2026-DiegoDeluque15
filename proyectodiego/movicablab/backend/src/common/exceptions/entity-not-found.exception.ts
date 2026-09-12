import { ApplicationException } from './application.exception';

export class EntityNotFoundException extends ApplicationException {
  constructor(message = 'Recurso no encontrado') {
    super(404, message, 'Not Found');
  }
}
