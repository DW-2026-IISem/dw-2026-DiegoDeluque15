import { HttpException, HttpStatus } from '@nestjs/common';

export class PagoNotFoundException extends HttpException {
  constructor(id: number) {
    super(`El pago con ID ${id} no fue encontrado`, HttpStatus.NOT_FOUND);
  }
}

export class CarreraNoCerradaException extends HttpException {
  constructor(id: number) {
    super(`La carrera con ID ${id} no está cerrada`, HttpStatus.CONFLICT);
  }
}

export class MontoInvalidoException extends HttpException {
  constructor() {
    super(`El monto ingresado es inválido`, HttpStatus.CONFLICT);
  }
}
