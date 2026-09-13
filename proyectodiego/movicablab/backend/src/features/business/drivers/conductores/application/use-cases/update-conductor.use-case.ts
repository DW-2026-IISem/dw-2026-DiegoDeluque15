import { Inject, Injectable } from '@nestjs/common';
import { EmpresaNotFoundException } from '../../../../fleets/empresas/domain/exceptions/empresa-not-found.exception';
import {
  EMPRESA_REPOSITORY,
  IEmpresaRepository,
} from '../../../../fleets/empresas/domain/interfaces/empresa.repository.interface';
import { Conductor } from '../../domain/entities/conductor.entity';
import { ConductorNotFoundException } from '../../domain/exceptions/conductor-not-found.exception';
import { EmpresaInactiveException } from '../../domain/exceptions/empresa-inactive.exception';
import {
  CONDUCTOR_REPOSITORY,
  IConductorRepository,
} from '../../domain/interfaces/conductor.repository.interface';
import { UpdateConductorDto } from '../dto/update-conductor.dto';

@Injectable()
export class UpdateConductorUseCase {
  constructor(
    @Inject(CONDUCTOR_REPOSITORY)
    private readonly conductorRepository: IConductorRepository,
    @Inject(EMPRESA_REPOSITORY)
    private readonly empresaRepository: IEmpresaRepository,
  ) {}

  async execute(id: number, dto: UpdateConductorDto): Promise<Conductor> {
    const conductor = await this.conductorRepository.findById(id);

    if (!conductor) {
      throw new ConductorNotFoundException(id);
    }

    if (dto.empresaId !== undefined && dto.empresaId !== null && dto.empresaId !== conductor.empresaId) {
      const empresa = await this.empresaRepository.findById(dto.empresaId);
      if (!empresa) {
        throw new EmpresaNotFoundException(dto.empresaId);
      }
      if (!empresa.isActive) {
        throw new EmpresaInactiveException(dto.empresaId);
      }
    }

    conductor.update({
      nombre: dto.nombre,
      descripcion: dto.descripcion,
      empresaId: dto.empresaId,
    });

    const updated = await this.conductorRepository.update(id, {
      nombre: conductor.nombre,
      descripcion: conductor.descripcion,
      empresaId: conductor.empresaId,
    });

    if (!updated) {
      throw new ConductorNotFoundException(id);
    }

    return updated;
  }
}
