import { Turno } from '../../domain/entities/turno.entity';

export class TurnoMapper {
  static toResponse(turno: Turno): Record<string, unknown> {
    return {
      id: turno.id,
      nombre: turno.nombre,
      descripcion: turno.descripcion,
      isActive: turno.isActive,
      conductorId: turno.conductorId,
      vehiculoId: turno.vehiculoId,
      createdAt: turno.createdAt.toISOString(),
      updatedAt: turno.updatedAt.toISOString(),
    };
  }
}
