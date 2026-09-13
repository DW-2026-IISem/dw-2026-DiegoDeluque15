import { Inject, Injectable } from '@nestjs/common';
import { Empresa } from '../../domain/entities/empresa.entity';
import { EmpresaNitAlreadyExistsException } from '../../domain/exceptions/empresa-nit-already-exists.exception';
import {
  IEmpresaRepository,
  EMPRESA_REPOSITORY,
} from '../../domain/interfaces/empresa.repository.interface';
import { CreateEmpresaDto } from '../dto/create-empresa.dto';

@Injectable()
export class CreateEmpresaUseCase {
  constructor(
    @Inject(EMPRESA_REPOSITORY)
    private readonly empresaRepository: IEmpresaRepository,
  ) {}

  async execute(dto: CreateEmpresaDto): Promise<Empresa> {
    // Validar NIT único
    const existing = await this.empresaRepository.findByNit(dto.nit.trim());

    if (existing) {
      throw new EmpresaNitAlreadyExistsException(dto.nit.trim());
    }

    const props = Empresa.create({
      nit: dto.nit,
      razonSocial: dto.razonSocial,
      contactoPrincipal: dto.contactoPrincipal ?? null,
    });

    return this.empresaRepository.create(props);
  }
}
