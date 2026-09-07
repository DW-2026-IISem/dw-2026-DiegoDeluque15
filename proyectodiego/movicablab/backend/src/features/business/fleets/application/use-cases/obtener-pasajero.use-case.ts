import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Pasajero } from '../../domain/entities/pasajero.entity.js';
import type { IPasajeroRepository } from '../../domain/interfaces/pasajero-repository.interface.js';
import { PASAJERO_REPOSITORY } from '../../domain/interfaces/pasajero-repository.interface.js';

@Injectable()
export class ObtenerPasajeroUseCase {
  constructor(
    @Inject(PASAJERO_REPOSITORY)
    private readonly pasajeroRepository: IPasajeroRepository,
  ) {}

  async ejecutar(id: number): Promise<Pasajero> {
    const pasajero = await this.pasajeroRepository.buscarPorId(id);
    if (!pasajero) {
      throw new NotFoundException(`Pasajero con id ${id} no encontrado`);
    }
    return pasajero;
  }
}
