/**
 * Puerto de consulta: ¿tiene el Vehículo turnos activos asociados?
 *
 * Implementación actual: StubTurnoActivoAdapter (siempre retorna false).
 * El bloqueo real de DELETE (409) por turnos activos no puede verificarse hasta
 * ISS-06 (feature Turno), cuando se reemplace el stub por una consulta real
 * a la tabla `turnos` con vehiculo_id e is_active = true.
 */
export const TURNO_ACTIVO_PORT = Symbol('TURNO_ACTIVO_PORT');

export interface ITurnoActivoPort {
  hasActiveTurnosForVehiculo(vehiculoId: number): Promise<boolean>;
}
