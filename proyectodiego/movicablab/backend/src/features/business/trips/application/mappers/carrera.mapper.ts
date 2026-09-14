import { Carrera } from '../../domain/entities/carrera.entity';

export class CarreraMapper {
  static toResponse(carrera: Carrera): Record<string, unknown> {
    return {
      id: carrera.id,
      pasajeroId: carrera.pasajeroId,
      turnoId: carrera.turnoId,
      tarifaId: carrera.tarifaId,
      fechaInicio: carrera.fechaInicio.toISOString(),
      fechaFin: carrera.fechaFin ? carrera.fechaFin.toISOString() : null,
      total: carrera.total,
      estado: carrera.estado,
      observaciones: carrera.observaciones,
      liquidacionId: carrera.liquidacionId,
    };
  }
}
