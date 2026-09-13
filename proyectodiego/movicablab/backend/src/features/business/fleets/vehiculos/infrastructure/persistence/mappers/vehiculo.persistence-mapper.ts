import { Vehiculo } from '../../../domain/entities/vehiculo.entity';
import { VehiculoModel } from '../models/vehiculo.model';

export class VehiculoPersistenceMapper {
  static toDomain(model: VehiculoModel): Vehiculo {
    return new Vehiculo({
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
