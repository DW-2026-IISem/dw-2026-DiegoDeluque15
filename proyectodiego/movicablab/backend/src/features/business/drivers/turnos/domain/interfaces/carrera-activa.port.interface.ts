/**
 * Puerto de consulta: ¿tiene el Turno carreras activas (en_curso) asociadas?
 *
 * Implementación actual: StubCarreraActivaAdapter (siempre retorna false).
 * El bloqueo real de DELETE (409) por carreras en curso no puede verificarse
 * hasta ISS-08 (feature Carrera), cuando se reemplace el stub por una consulta
 * real a la tabla `carreras` con turno_id y estado IN ('solicitada','aceptada','en_curso').
 */
export const CARRERA_ACTIVA_PORT = Symbol('CARRERA_ACTIVA_PORT');

export interface ICarreraActivaPort {
  hasActiveCarrerasForTurno(turnoId: number): Promise<boolean>;
}
