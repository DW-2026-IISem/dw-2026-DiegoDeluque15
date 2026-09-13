import { Tarifa } from '../../domain/entities/tarifa.entity';

export class TarifaMapper {
  static toResponse(tarifa: Tarifa): Record<string, unknown> {
    return {
      id: tarifa.id,
      nombre: tarifa.nombre,
      reglaCalculo: tarifa.reglaCalculo,
      valorBase: tarifa.valorBase,
      vigenciaDesde: tarifa.vigenciaDesde.toISOString(),
      vigenciaHasta: tarifa.vigenciaHasta.toISOString(),
      isActive: tarifa.isActive,
    };
  }
}
