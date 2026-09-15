import { Inject, Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ICalificacionRepository, ICALIFICACION_REPOSITORY } from '../../domain/interfaces/calificacion-repository.interface';
import { Calificacion } from '../../domain/entities/calificacion.entity';
import { CreateCalificacionDto } from '../dto/create-calificacion.dto';
import { CarreraNoCerradaException, CalificacionYaExisteException } from '../../domain/exceptions/calificacion.exceptions';
import { ICarreraRepository } from '../../../../trips/domain/interfaces/carrera.repository.interface';
import { CARRERA_REPOSITORY } from '../../../../trips/domain/interfaces/carrera.repository.interface';

@Injectable()
export class CrearCalificacion {
  constructor(
    @Inject(ICALIFICACION_REPOSITORY)
    private readonly calificacionRepository: ICalificacionRepository,
    @Inject(CARRERA_REPOSITORY)
    private readonly carreraRepository: ICarreraRepository,
  ) {}

  async execute(dto: CreateCalificacionDto) {
    const carrera = await this.carreraRepository.findById(dto.carreraId);
    if (!carrera) {
      throw new HttpException(`La carrera con ID ${dto.carreraId} no existe`, HttpStatus.NOT_FOUND);
    }

    if (carrera.estado !== 'cerrada') {
      throw new CarreraNoCerradaException(dto.carreraId);
    }

    const existente = await this.calificacionRepository.findByCarreraId(dto.carreraId);
    if (existente) {
      throw new CalificacionYaExisteException(dto.carreraId);
    }

    const calificacionProps = Calificacion.create({
      carreraId: dto.carreraId,
      puntaje: dto.puntaje,
      comentario: dto.comentario,
    });

    return await this.calificacionRepository.save(calificacionProps);
  }
}
