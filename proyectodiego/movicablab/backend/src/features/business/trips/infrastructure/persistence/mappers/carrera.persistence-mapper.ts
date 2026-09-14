import { Carrera, CarreraEstado } from '../../../domain/entities/carrera.entity';
import { CarreraModel } from '../models/carrera.model';

export class CarreraPersistenceMapper {
  static toDomain(model: CarreraModel): Carrera {
    return new Carrera({
      id: model.id,
      pasajeroId: model.pasajeroId,
      turnoId: model.turnoId,
      tarifaId: model.tarifaId,
      fechaInicio: model.fechaInicio,
      fechaFin: model.fechaFin,
      total: model.total ? Number(model.total) : undefined,
      estado: model.estado as CarreraEstado,
      observaciones: model.observaciones,
      liquidacionId: model.liquidacionId,
    });
  }
}
