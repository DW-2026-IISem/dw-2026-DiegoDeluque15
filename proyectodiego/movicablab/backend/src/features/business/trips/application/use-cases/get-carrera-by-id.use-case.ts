import { Inject, Injectable } from '@nestjs/common';
import { Carrera } from '../../domain/entities/carrera.entity';
import { CarreraNotFoundException } from '../../domain/exceptions/carrera-not-found.exception';
import { ICarreraRepository, CARRERA_REPOSITORY } from '../../domain/interfaces/carrera.repository.interface';

@Injectable()
export class GetCarreraByIdUseCase {
  constructor(
    @Inject(CARRERA_REPOSITORY)
    private readonly carreraRepository: ICarreraRepository,
  ) {}

  async execute(id: number): Promise<Carrera> {
    const carrera = await this.carreraRepository.findById(id);
    if (!carrera) {
      throw new CarreraNotFoundException(id);
    }
    return carrera;
  }
}
