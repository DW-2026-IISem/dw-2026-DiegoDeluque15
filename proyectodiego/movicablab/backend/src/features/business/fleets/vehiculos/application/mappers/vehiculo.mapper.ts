import { Vehiculo } from '../../domain/entities/vehiculo.entity';

export class VehiculoMapper {
  static toResponse(vehiculo: Vehiculo): Record<string, unknown> {
    return {
      id: vehiculo.id,
      nombre: vehiculo.nombre,
      descripcion: vehiculo.descripcion,
      isActive: vehiculo.isActive,
      empresaId: vehiculo.empresaId,
      createdAt: vehiculo.createdAt.toISOString(),
      updatedAt: vehiculo.updatedAt.toISOString(),
    };
  }
}
