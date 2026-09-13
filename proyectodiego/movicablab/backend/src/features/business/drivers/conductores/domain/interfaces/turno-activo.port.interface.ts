/**
 * Puerto de consulta: ¿tiene el Conductor turnos activos asociados?
 *
 * Implementación actual: StubTurnoActivoAdapter (siempre retorna false).
 * El bloqueo real de DELETE (409) por turnos activos no puede verificarse hasta
 * ISS-06 (feature Turno), cuando se reemplace el stub por una consulta real
 * a la tabla `turnos` con conductor_id e is_active = true.
 */
export const TURNO_ACTIVO_PORT_CONDUCTOR = Symbol('TURNO_ACTIVO_PORT_CONDUCTOR');

export interface ITurnoActivoPort {
  hasActiveTurnosForConductor(conductorId: number): Promise<boolean>;
}
