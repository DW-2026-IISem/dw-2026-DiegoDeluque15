import { Conductor } from '../../domain/entities/conductor.entity';

export class ConductorMapper {
  static toResponse(conductor: Conductor): Record<string, unknown> {
    return {
      id: conductor.id,
      nombre: conductor.nombre,
      descripcion: conductor.descripcion,
      isActive: conductor.isActive,
      empresaId: conductor.empresaId,
      createdAt: conductor.createdAt.toISOString(),
      updatedAt: conductor.updatedAt.toISOString(),
    };
  }
}
