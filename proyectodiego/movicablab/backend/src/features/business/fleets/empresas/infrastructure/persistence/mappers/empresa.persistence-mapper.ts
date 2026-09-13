import { Empresa } from '../../../domain/entities/empresa.entity';
import { EmpresaModel } from '../models/empresa.model';

export class EmpresaPersistenceMapper {
  static toDomain(model: EmpresaModel): Empresa {
    return new Empresa({
      id: model.id,
      nit: model.nit,
      razonSocial: model.razonSocial,
      contactoPrincipal: model.contactoPrincipal,
      isActive: model.isActive,
    });
  }
}
