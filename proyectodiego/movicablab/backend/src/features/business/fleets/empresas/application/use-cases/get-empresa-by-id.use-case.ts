import { Inject, Injectable } from '@nestjs/common';
import { Empresa } from '../../domain/entities/empresa.entity';
import { EmpresaNotFoundException } from '../../domain/exceptions/empresa-not-found.exception';
import {
  IEmpresaRepository,
  EMPRESA_REPOSITORY,
} from '../../domain/interfaces/empresa.repository.interface';

@Injectable()
export class GetEmpresaByIdUseCase {
  constructor(
    @Inject(EMPRESA_REPOSITORY)
    private readonly empresaRepository: IEmpresaRepository,
  ) {}

  async execute(id: number): Promise<Empresa> {
    const empresa = await this.empresaRepository.findById(id);

    if (!empresa) {
      throw new EmpresaNotFoundException(id);
    }

    return empresa;
  }
}
