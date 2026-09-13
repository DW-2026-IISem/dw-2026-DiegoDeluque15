import { Inject, Injectable } from '@nestjs/common';
import { Vehiculo } from '../../domain/entities/vehiculo.entity';
import { VehiculoNotFoundException } from '../../domain/exceptions/vehiculo-not-found.exception';
import {
  IVehiculoRepository,
  VEHICULO_REPOSITORY,
} from '../../domain/interfaces/vehiculo.repository.interface';

@Injectable()
export class GetVehiculoByIdUseCase {
  constructor(
    @Inject(VEHICULO_REPOSITORY)
    private readonly vehiculoRepository: IVehiculoRepository,
  ) {}

  async execute(id: number): Promise<Vehiculo> {
    const vehiculo = await this.vehiculoRepository.findById(id);

    if (!vehiculo) {
      throw new VehiculoNotFoundException(id);
    }

    return vehiculo;
  }
}
