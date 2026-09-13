import { Turno } from '../../../domain/entities/turno.entity';
import { TurnoModel } from '../models/turno.model';

export class TurnoPersistenceMapper {
  static toDomain(model: TurnoModel): Turno {
    return new Turno({
      id: model.id,
      nombre: model.nombre,
      descripcion: model.descripcion,
      isActive: model.isActive,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
      conductorId: model.conductorId,
      vehiculoId: model.vehiculoId,
    });
  }
}
