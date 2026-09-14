/**
 * Puerto de consulta: ¿tiene el Turno carreras activas (en_curso) asociadas?
 *
 * Implementación real: CarreraActivaTurnoAdapter (ISS-08).
 * Consulta la tabla `carreras` filtrando por turno_id y estado IN ('solicitada','aceptada','en_curso').
 */
export const CARRERA_ACTIVA_PORT = Symbol('CARRERA_ACTIVA_PORT');

export interface ICarreraActivaPort {
  hasActiveCarrerasForTurno(turnoId: number): Promise<boolean>;
}
