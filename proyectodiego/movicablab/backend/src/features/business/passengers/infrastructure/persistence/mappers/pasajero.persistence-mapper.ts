import { Pasajero } from '../../../domain/entities/pasajero.entity';
import { PasajeroModel } from '../models/pasajero.model';

export class PasajeroPersistenceMapper {
  static toDomain(model: PasajeroModel): Pasajero {
    return new Pasajero({
      id: model.id,
      nombre: model.nombre,
      descripcion: model.descripcion,
      isActive: model.isActive,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    });
  }
}
