import { Pasajero } from '../../domain/entities/pasajero.entity';

export class PasajeroMapper {
  static toResponse(pasajero: Pasajero): Record<string, unknown> {
    return {
      id: pasajero.id,
      nombre: pasajero.nombre,
      descripcion: pasajero.descripcion,
      isActive: pasajero.isActive,
      createdAt: pasajero.createdAt.toISOString(),
      updatedAt: pasajero.updatedAt.toISOString(),
    };
  }
}
