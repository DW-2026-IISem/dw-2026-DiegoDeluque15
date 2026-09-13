import { Inject, Injectable } from '@nestjs/common';
import { Turno } from '../../domain/entities/turno.entity';
import { TurnoNotFoundException } from '../../domain/exceptions/turno-not-found.exception';
import {
  ITurnoRepository,
  TURNO_REPOSITORY,
} from '../../domain/interfaces/turno.repository.interface';
import { UpdateTurnoDto } from '../dto/update-turno.dto';

@Injectable()
export class UpdateTurnoUseCase {
  constructor(
    @Inject(TURNO_REPOSITORY)
    private readonly turnoRepository: ITurnoRepository,
  ) {}

  async execute(id: number, dto: UpdateTurnoDto): Promise<Turno> {
    const turno = await this.turnoRepository.findById(id);

    if (!turno) {
      throw new TurnoNotFoundException(id);
    }

    turno.update({
      nombre: dto.nombre,
      descripcion: dto.descripcion,
    });

    const updated = await this.turnoRepository.update(id, {
      nombre: turno.nombre,
      descripcion: turno.descripcion,
    });

    if (!updated) {
      throw new TurnoNotFoundException(id);
    }

    return updated;
  }
}
