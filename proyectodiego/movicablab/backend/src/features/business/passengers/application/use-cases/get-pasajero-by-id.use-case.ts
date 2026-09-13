import { Inject, Injectable } from '@nestjs/common';
import { Pasajero } from '../../domain/entities/pasajero.entity';
import { PasajeroNotFoundException } from '../../domain/exceptions/pasajero-not-found.exception';
import {
  IPasajeroRepository,
  PASAJERO_REPOSITORY,
} from '../../domain/interfaces/pasajero.repository.interface';

@Injectable()
export class GetPasajeroByIdUseCase {
  constructor(
    @Inject(PASAJERO_REPOSITORY)
    private readonly pasajeroRepository: IPasajeroRepository,
  ) {}

  async execute(id: number): Promise<Pasajero> {
    const pasajero = await this.pasajeroRepository.findById(id);

    if (!pasajero) {
      throw new PasajeroNotFoundException(id);
    }

    return pasajero;
  }
}
