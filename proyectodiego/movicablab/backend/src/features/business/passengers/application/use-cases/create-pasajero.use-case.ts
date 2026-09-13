import { Inject, Injectable } from '@nestjs/common';
import { Pasajero } from '../../domain/entities/pasajero.entity';
import {
  IPasajeroRepository,
  PASAJERO_REPOSITORY,
} from '../../domain/interfaces/pasajero.repository.interface';
import { CreatePasajeroDto } from '../dto/create-pasajero.dto';

@Injectable()
export class CreatePasajeroUseCase {
  constructor(
    @Inject(PASAJERO_REPOSITORY)
    private readonly pasajeroRepository: IPasajeroRepository,
  ) {}

  async execute(dto: CreatePasajeroDto): Promise<Pasajero> {
    const props = Pasajero.create({
      nombre: dto.nombre,
      descripcion: dto.descripcion ?? null,
    });

    return this.pasajeroRepository.create(props);
  }
}
