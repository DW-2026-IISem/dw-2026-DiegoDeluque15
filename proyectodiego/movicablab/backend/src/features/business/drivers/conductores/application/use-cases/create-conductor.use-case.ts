import { Inject, Injectable } from '@nestjs/common';
import { EmpresaNotFoundException } from '../../../../fleets/empresas/domain/exceptions/empresa-not-found.exception';
import {
  EMPRESA_REPOSITORY,
  IEmpresaRepository,
} from '../../../../fleets/empresas/domain/interfaces/empresa.repository.interface';
import { Conductor } from '../../domain/entities/conductor.entity';
import { EmpresaInactiveException } from '../../domain/exceptions/empresa-inactive.exception';
import {
  CONDUCTOR_REPOSITORY,
  IConductorRepository,
} from '../../domain/interfaces/conductor.repository.interface';
import { CreateConductorDto } from '../dto/create-conductor.dto';

@Injectable()
export class CreateConductorUseCase {
  constructor(
    @Inject(CONDUCTOR_REPOSITORY)
    private readonly conductorRepository: IConductorRepository,
    @Inject(EMPRESA_REPOSITORY)
    private readonly empresaRepository: IEmpresaRepository,
  ) {}

  async execute(dto: CreateConductorDto): Promise<Conductor> {
    if (dto.empresaId) {
      const empresa = await this.empresaRepository.findById(dto.empresaId);

      if (!empresa) {
        throw new EmpresaNotFoundException(dto.empresaId);
      }

      if (!empresa.isActive) {
        throw new EmpresaInactiveException(dto.empresaId);
      }
    }

    const props = Conductor.create({
      nombre: dto.nombre,
      descripcion: dto.descripcion ?? null,
      empresaId: dto.empresaId ?? null,
    });

    return this.conductorRepository.create(props);
  }
}
