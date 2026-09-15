import { HttpException, HttpStatus } from '@nestjs/common';

export class CalificacionNotFoundException extends HttpException {
  constructor(id: number) {
    super(`La calificación con ID ${id} no fue encontrada`, HttpStatus.NOT_FOUND);
  }
}

export class CarreraNoCerradaException extends HttpException {
  constructor(id: number) {
    super(`La carrera con ID ${id} no está cerrada`, HttpStatus.CONFLICT);
  }
}

export class CalificacionYaExisteException extends HttpException {
  constructor(carreraId: number) {
    super(`Ya existe una calificación para la carrera con ID ${carreraId}`, HttpStatus.CONFLICT);
  }
}
