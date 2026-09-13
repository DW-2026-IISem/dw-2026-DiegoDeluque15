import { Inject, Injectable } from '@nestjs/common';
import { Pasajero } from '../../domain/entities/pasajero.entity';
import { PasajeroNotFoundException } from '../../domain/exceptions/pasajero-not-found.exception';
import {
  IPasajeroRepository,
  PASAJERO_REPOSITORY,
} from '../../domain/interfaces/pasajero.repository.interface';
import { UpdatePasajeroDto } from '../dto/update-pasajero.dto';

@Injectable()
export class UpdatePasajeroUseCase {
  constructor(
    @Inject(PASAJERO_REPOSITORY)
    private readonly pasajeroRepository: IPasajeroRepository,
  ) {}

  async execute(id: number, dto: UpdatePasajeroDto): Promise<Pasajero> {
    const pasajero = await this.pasajeroRepository.findById(id);

    if (!pasajero) {
      throw new PasajeroNotFoundException(id);
    }

    pasajero.update({
      nombre: dto.nombre,
      descripcion: dto.descripcion,
    });

    const updated = await this.pasajeroRepository.update(id, {
      nombre: pasajero.nombre,
      descripcion: pasajero.descripcion,
    });

    if (!updated) {
      throw new PasajeroNotFoundException(id);
    }

    return updated;
  }
}
