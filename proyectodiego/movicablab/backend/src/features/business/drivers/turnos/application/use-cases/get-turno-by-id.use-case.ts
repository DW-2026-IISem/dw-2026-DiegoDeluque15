import { Inject, Injectable } from '@nestjs/common';
import { Turno } from '../../domain/entities/turno.entity';
import { TurnoNotFoundException } from '../../domain/exceptions/turno-not-found.exception';
import {
  ITurnoRepository,
  TURNO_REPOSITORY,
} from '../../domain/interfaces/turno.repository.interface';

@Injectable()
export class GetTurnoByIdUseCase {
  constructor(
    @Inject(TURNO_REPOSITORY)
    private readonly turnoRepository: ITurnoRepository,
  ) {}

  async execute(id: number): Promise<Turno> {
    const turno = await this.turnoRepository.findById(id);

    if (!turno) {
      throw new TurnoNotFoundException(id);
    }

    return turno;
  }
}
