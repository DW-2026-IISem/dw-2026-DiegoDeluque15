/**
 * Puerto de consulta: ¿tiene la Empresa conductores activos asociados?
 *
 * Implementación actual: StubConductorActivoAdapter (siempre retorna false).
 * ISS-06 (feature Conductor) debe reemplazar este stub por una
 * consulta real a la tabla `conductores` con empresa_id y is_active = true.
 */
export const CONDUCTOR_ACTIVO_PORT = Symbol('CONDUCTOR_ACTIVO_PORT');

export interface IConductorActivoPort {
  hasActiveConductoresForEmpresa(empresaId: number): Promise<boolean>;
}
