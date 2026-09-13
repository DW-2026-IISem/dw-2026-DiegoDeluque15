/**
 * Puerto de consulta: ¿tiene la Empresa vehículos activos asociados?
 *
 * Implementación actual: StubVehiculoActivoAdapter (siempre retorna false).
 * ISS-05 (feature Vehiculo) debe reemplazar este stub por una
 * consulta real a la tabla `vehiculos` con empresa_id y is_active = true.
 */
export const VEHICULO_ACTIVO_PORT = Symbol('VEHICULO_ACTIVO_PORT');

export interface IVehiculoActivoPort {
  hasActiveVehiculosForEmpresa(empresaId: number): Promise<boolean>;
}
