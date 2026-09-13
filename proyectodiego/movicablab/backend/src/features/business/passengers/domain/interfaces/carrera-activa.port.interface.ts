/**
 * Puerto de consulta de carreras bloqueantes para un pasajero.
 *
 * Implementación actual: StubCarreraActivaAdapter (siempre retorna false).
 * El bloqueo real de DELETE (409) por carreras en estado `aceptada` o `en_curso`
 * no puede verificarse hasta ISS-09 (feature Carrera), cuando se reemplace el stub
 * por una consulta real a la tabla `carreras`.
 */
export const CARRERA_ACTIVA_PORT = Symbol('CARRERA_ACTIVA_PORT');

export interface ICarreraActivaPort {
  hasBlockingCarrerasForPasajero(pasajeroId: number): Promise<boolean>;
}
