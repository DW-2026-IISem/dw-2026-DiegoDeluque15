import { Inject, Injectable } from '@nestjs/common';
import { EmpresaNotFoundException } from '../../../empresas/domain/exceptions/empresa-not-found.exception';
import {
  EMPRESA_REPOSITORY,
  IEmpresaRepository,
} from '../../../empresas/domain/interfaces/empresa.repository.interface';
import { Vehiculo } from '../../domain/entities/vehiculo.entity';
import { EmpresaInactiveException } from '../../domain/exceptions/empresa-inactive.exception';
import {
  IVehiculoRepository,
  VEHICULO_REPOSITORY,
} from '../../domain/interfaces/vehiculo.repository.interface';
import { CreateVehiculoDto } from '../dto/create-vehiculo.dto';

@Injectable()
export class CreateVehiculoUseCase {
  constructor(
    @Inject(VEHICULO_REPOSITORY)
    private readonly vehiculoRepository: IVehiculoRepository,
    @Inject(EMPRESA_REPOSITORY)
    private readonly empresaRepository: IEmpresaRepository,
  ) {}

  async execute(dto: CreateVehiculoDto): Promise<Vehiculo> {
    const empresa = await this.empresaRepository.findById(dto.empresaId);

    if (!empresa) {
      throw new EmpresaNotFoundException(dto.empresaId);
    }

    if (!empresa.isActive) {
      throw new EmpresaInactiveException(dto.empresaId);
    }

    const props = Vehiculo.create({
      nombre: dto.nombre,
      descripcion: dto.descripcion ?? null,
      empresaId: dto.empresaId,
    });

    return this.vehiculoRepository.create(props);
  }
}
