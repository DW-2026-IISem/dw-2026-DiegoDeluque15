/**
 * Puerto de consulta: ¿tiene la Tarifa carreras asociadas?
 *
 * Implementación real: CarreraActivaTarifaAdapter (ISS-08).
 * Consulta la tabla `carreras` filtrando por tarifa_id y estado != 'cancelada'.
 */
export const CARRERA_ACTIVA_TARIFA_PORT = Symbol('CARRERA_ACTIVA_TARIFA_PORT');

export interface ICarreraActivaTarifaPort {
  hasCarrerasForTarifa(tarifaId: number): Promise<boolean>;
}
