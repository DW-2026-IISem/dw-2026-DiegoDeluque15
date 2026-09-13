/**
 * Puerto de consulta: ¿tiene la Empresa vehículos activos asociados?
 *
 * Implementación actual: VehiculoActivoAdapter (ISS-05) consulta la tabla `vehiculos`
 * con empresa_id e is_active = true.
 */
export const VEHICULO_ACTIVO_PORT = Symbol('VEHICULO_ACTIVO_PORT');

export interface IVehiculoActivoPort {
  hasActiveVehiculosForEmpresa(empresaId: number): Promise<boolean>;
}
