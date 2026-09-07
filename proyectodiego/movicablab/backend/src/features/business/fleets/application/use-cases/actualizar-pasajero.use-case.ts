import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Pasajero } from '../../domain/entities/pasajero.entity.js';
import type { IPasajeroRepository } from '../../domain/interfaces/pasajero-repository.interface.js';
import { PASAJERO_REPOSITORY } from '../../domain/interfaces/pasajero-repository.interface.js';
import { UpdatePasajeroDto } from '../dto/update-pasajero.dto.js';

@Injectable()
export class ActualizarPasajeroUseCase {
  constructor(
    @Inject(PASAJERO_REPOSITORY)
    private readonly pasajeroRepository: IPasajeroRepository,
  ) {}

  async ejecutar(id: number, dto: UpdatePasajeroDto): Promise<Pasajero> {
    const pasajero = await this.pasajeroRepository.buscarPorId(id);
    if (!pasajero) {
      throw new NotFoundException(`Pasajero con id ${id} no encontrado`);
    }

    pasajero.actualizarDatos(
      dto.nombre ?? pasajero.nombre,
      dto.descripcion ?? pasajero.descripcion,
    );

    return this.pasajeroRepository.actualizar(pasajero);
  }
}
