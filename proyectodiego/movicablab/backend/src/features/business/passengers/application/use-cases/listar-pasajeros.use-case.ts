import { Inject, Injectable } from '@nestjs/common';
import { Pasajero } from '../../domain/entities/pasajero.entity.js';
import type { IPasajeroRepository } from '../../domain/interfaces/pasajero-repository.interface.js';
import { PASAJERO_REPOSITORY } from '../../domain/interfaces/pasajero-repository.interface.js';

@Injectable()
export class ListarPasajerosUseCase {
  constructor(
    @Inject(PASAJERO_REPOSITORY)
    private readonly pasajeroRepository: IPasajeroRepository,
  ) {}

  async ejecutar(soloActivos = true): Promise<Pasajero[]> {
    return this.pasajeroRepository.listar(soloActivos);
  }
}
