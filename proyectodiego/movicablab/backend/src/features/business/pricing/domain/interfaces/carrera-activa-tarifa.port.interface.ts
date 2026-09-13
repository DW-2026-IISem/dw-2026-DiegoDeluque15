/**
 * Puerto de consulta: ¿tiene la Tarifa carreras asociadas?
 *
 * Implementación actual: StubCarreraActivaTarifaAdapter (siempre retorna false).
 * El bloqueo real de DELETE (409) por carreras en curso/asociadas no puede verificarse
 * hasta ISS-08 (feature Carrera), cuando se reemplace el stub por una consulta real.
 */
export const CARRERA_ACTIVA_TARIFA_PORT = Symbol('CARRERA_ACTIVA_TARIFA_PORT');

export interface ICarreraActivaTarifaPort {
  hasCarrerasForTarifa(tarifaId: number): Promise<boolean>;
}
