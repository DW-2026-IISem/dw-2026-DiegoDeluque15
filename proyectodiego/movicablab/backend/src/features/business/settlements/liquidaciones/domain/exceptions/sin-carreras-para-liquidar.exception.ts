import { ConflictException } from '@nestjs/common';

export class SinCarrerasParaLiquidarException extends ConflictException {
  constructor() {
    super('No hay carreras cerradas pendientes de liquidar para ese conductor en el rango de fechas indicado');
  }
}
