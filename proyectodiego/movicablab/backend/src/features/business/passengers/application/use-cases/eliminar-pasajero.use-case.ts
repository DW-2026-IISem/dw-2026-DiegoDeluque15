import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { IPasajeroRepository } from '../../domain/interfaces/pasajero-repository.interface.js';
import { PASAJERO_REPOSITORY } from '../../domain/interfaces/pasajero-repository.interface.js';

@Injectable()
export class EliminarPasajeroUseCase {
  constructor(
    @Inject(PASAJERO_REPOSITORY)
    private readonly pasajeroRepository: IPasajeroRepository,
  ) {}

  async ejecutar(id: number): Promise<void> {
    const pasajero = await this.pasajeroRepository.buscarPorId(id);
    if (!pasajero) {
      throw new NotFoundException(`Pasajero con id ${id} no encontrado`);
    }

    const tieneCarrerasActivas =
      await this.pasajeroRepository.tieneCarrerasActivas(id);
    if (tieneCarrerasActivas) {
      throw new ConflictException(
        'No se puede desactivar un pasajero con carreras en curso o aceptadas',
      );
    }

    pasajero.desactivar();
    await this.pasajeroRepository.actualizar(pasajero);
  }
}
