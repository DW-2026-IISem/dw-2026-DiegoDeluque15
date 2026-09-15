import { NotFoundException } from '@nestjs/common';

export class LiquidacionNotFoundException extends NotFoundException {
  constructor(id: number) {
    super(`Liquidacion con id ${id} no encontrada`);
  }
}
