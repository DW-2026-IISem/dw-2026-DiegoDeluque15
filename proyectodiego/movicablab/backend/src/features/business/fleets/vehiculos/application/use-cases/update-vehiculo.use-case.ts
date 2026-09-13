import { Inject, Injectable } from '@nestjs/common';
import { Vehiculo } from '../../domain/entities/vehiculo.entity';
import { VehiculoNotFoundException } from '../../domain/exceptions/vehiculo-not-found.exception';
import {
  IVehiculoRepository,
  VEHICULO_REPOSITORY,
} from '../../domain/interfaces/vehiculo.repository.interface';
import { UpdateVehiculoDto } from '../dto/update-vehiculo.dto';

@Injectable()
export class UpdateVehiculoUseCase {
  constructor(
    @Inject(VEHICULO_REPOSITORY)
    private readonly vehiculoRepository: IVehiculoRepository,
  ) {}

  async execute(id: number, dto: UpdateVehiculoDto): Promise<Vehiculo> {
    const vehiculo = await this.vehiculoRepository.findById(id);

    if (!vehiculo) {
      throw new VehiculoNotFoundException(id);
    }

    vehiculo.update({
      nombre: dto.nombre,
      descripcion: dto.descripcion,
    });

    const updated = await this.vehiculoRepository.update(id, {
      nombre: vehiculo.nombre,
      descripcion: vehiculo.descripcion,
    });

    if (!updated) {
      throw new VehiculoNotFoundException(id);
    }

    return updated;
  }
}
