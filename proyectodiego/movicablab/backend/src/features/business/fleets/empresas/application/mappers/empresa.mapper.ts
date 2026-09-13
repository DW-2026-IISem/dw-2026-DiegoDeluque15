import { Empresa } from '../../domain/entities/empresa.entity';

export class EmpresaMapper {
  static toResponse(empresa: Empresa): Record<string, unknown> {
    return {
      id: empresa.id,
      nit: empresa.nit,
      razonSocial: empresa.razonSocial,
      contactoPrincipal: empresa.contactoPrincipal,
      isActive: empresa.isActive,
    };
  }
}
