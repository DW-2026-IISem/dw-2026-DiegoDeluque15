import { Inject, Injectable } from '@nestjs/common';
import { Pasajero } from '../../domain/entities/pasajero.entity.js';
import type { IPasajeroRepository } from '../../domain/interfaces/pasajero-repository.interface.js';
import { PASAJERO_REPOSITORY } from '../../domain/interfaces/pasajero-repository.interface.js';
import { CreatePasajeroDto } from '../dto/create-pasajero.dto.js';

@Injectable()
export class CrearPasajeroUseCase {
  constructor(
    @Inject(PASAJERO_REPOSITORY)
    private readonly pasajeroRepository: IPasajeroRepository,
  ) {}

  async ejecutar(dto: CreatePasajeroDto): Promise<Pasajero> {
    const pasajero = new Pasajero(
      null,
      dto.nombre,
      dto.descripcion ?? null,
      true,
      null,
      null,
    );
    return this.pasajeroRepository.crear(pasajero);
  }
}
