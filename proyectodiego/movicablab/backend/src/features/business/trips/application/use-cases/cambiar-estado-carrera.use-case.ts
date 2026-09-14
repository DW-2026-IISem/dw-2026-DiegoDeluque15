import { Inject, Injectable } from '@nestjs/common';
import { Carrera, CarreraEstado } from '../../domain/entities/carrera.entity';
import { CarreraNotFoundException } from '../../domain/exceptions/carrera-not-found.exception';
import { ICarreraRepository, CARRERA_REPOSITORY } from '../../domain/interfaces/carrera.repository.interface';
import { ITarifaRepository, TARIFA_REPOSITORY } from '../../../pricing/domain/interfaces/tarifa.repository.interface';

@Injectable()
export class CambiarEstadoCarreraUseCase {
  constructor(
    @Inject(CARRERA_REPOSITORY)
    private readonly carreraRepository: ICarreraRepository,
    @Inject(TARIFA_REPOSITORY)
    private readonly tarifaRepository: ITarifaRepository,
  ) {}

  async execute(id: number, nuevoEstado: CarreraEstado): Promise<Carrera> {
    const carrera = await this.carreraRepository.findById(id);

    if (!carrera) {
      throw new CarreraNotFoundException(id);
    }

    // Delega la máquina de estados a la entidad (lanza EstadoInvalidoException 409 si es inválida)
    carrera.cambiarEstado(nuevoEstado);

    let fechaFin = carrera.fechaFin;
    let total = carrera.total;

    if (nuevoEstado === 'cerrada') {
      fechaFin = new Date();
      
      const tarifa = await this.tarifaRepository.findById(carrera.tarifaId);
      total = tarifa ? tarifa.valorBase : 0;
    }

    carrera.fechaFin = fechaFin;
    carrera.total = total;

    const updated = await this.carreraRepository.update(id, {
      estado: carrera.estado,
      fechaFin,
      total,
    });

    if (!updated) {
      throw new CarreraNotFoundException(id);
    }

    return updated;
  }
}
