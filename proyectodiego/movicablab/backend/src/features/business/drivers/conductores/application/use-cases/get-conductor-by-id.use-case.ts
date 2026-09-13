import { Inject, Injectable } from '@nestjs/common';
import { Conductor } from '../../domain/entities/conductor.entity';
import { ConductorNotFoundException } from '../../domain/exceptions/conductor-not-found.exception';
import {
  CONDUCTOR_REPOSITORY,
  IConductorRepository,
} from '../../domain/interfaces/conductor.repository.interface';

@Injectable()
export class GetConductorByIdUseCase {
  constructor(
    @Inject(CONDUCTOR_REPOSITORY)
    private readonly conductorRepository: IConductorRepository,
  ) {}

  async execute(id: number): Promise<Conductor> {
    const conductor = await this.conductorRepository.findById(id);

    if (!conductor) {
      throw new ConductorNotFoundException(id);
    }

    return conductor;
  }
}
