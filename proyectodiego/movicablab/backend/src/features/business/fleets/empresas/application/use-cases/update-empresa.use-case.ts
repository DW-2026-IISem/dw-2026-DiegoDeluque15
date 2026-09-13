import { Inject, Injectable } from '@nestjs/common';
import { Empresa } from '../../domain/entities/empresa.entity';
import { EmpresaNotFoundException } from '../../domain/exceptions/empresa-not-found.exception';
import {
  IEmpresaRepository,
  EMPRESA_REPOSITORY,
} from '../../domain/interfaces/empresa.repository.interface';
import { UpdateEmpresaDto } from '../dto/update-empresa.dto';

@Injectable()
export class UpdateEmpresaUseCase {
  constructor(
    @Inject(EMPRESA_REPOSITORY)
    private readonly empresaRepository: IEmpresaRepository,
  ) {}

  /**
   * NIT es inmutable tras creación: aunque el DTO contenga `nit`,
   * se ignora y nunca se pasa al repositorio.
   */
  async execute(id: number, dto: UpdateEmpresaDto): Promise<Empresa> {
    const empresa = await this.empresaRepository.findById(id);

    if (!empresa) {
      throw new EmpresaNotFoundException(id);
    }

    const updated = await this.empresaRepository.update(id, {
      razonSocial: dto.razonSocial,
      contactoPrincipal: dto.contactoPrincipal,
    });

    if (!updated) {
      throw new EmpresaNotFoundException(id);
    }

    return updated;
  }
}
