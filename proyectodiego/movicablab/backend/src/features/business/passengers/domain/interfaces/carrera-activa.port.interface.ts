/**
 * Puerto de consulta de carreras bloqueantes para un pasajero.
 *
 * Implementación real: CarreraActivaPasajeroAdapter (ISS-08).
 * Consulta la tabla `carreras` filtrando por pasajero_id y estado IN ('aceptada', 'en_curso').
 */
export const CARRERA_ACTIVA_PORT = Symbol('CARRERA_ACTIVA_PORT');

export interface ICarreraActivaPort {
  hasBlockingCarrerasForPasajero(pasajeroId: number): Promise<boolean>;
}
