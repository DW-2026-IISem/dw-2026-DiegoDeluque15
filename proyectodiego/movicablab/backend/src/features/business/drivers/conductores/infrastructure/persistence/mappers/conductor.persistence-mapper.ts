import { Conductor } from '../../../domain/entities/conductor.entity';
import { ConductorModel } from '../models/conductor.model';

export class ConductorPersistenceMapper {
  static toDomain(model: ConductorModel): Conductor {
    return new Conductor({
      id: model.id,
      nombre: model.nombre,
      descripcion: model.descripcion,
      isActive: model.isActive,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
      empresaId: model.empresaId,
    });
  }
}
