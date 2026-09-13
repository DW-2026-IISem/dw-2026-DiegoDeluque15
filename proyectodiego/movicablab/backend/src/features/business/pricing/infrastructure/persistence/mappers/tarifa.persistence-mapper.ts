import { Tarifa } from '../../../domain/entities/tarifa.entity';
import { TarifaModel } from '../models/tarifa.model';

export class TarifaPersistenceMapper {
  static toDomain(model: TarifaModel): Tarifa {
    return new Tarifa({
      id: model.id,
      nombre: model.nombre,
      reglaCalculo: model.reglaCalculo,
      valorBase: Number(model.valorBase),
      vigenciaDesde: model.vigenciaDesde,
      vigenciaHasta: model.vigenciaHasta,
      isActive: model.isActive,
    });
  }
}
