/**
 * Cantidad de registros por feature/entidad.
 * Prioridad: CLI (--pasajeros=N) > env (SEED_PASAJEROS) > default de este archivo.
 *
 * Cuando agregues features, suma aquí la clave y léela en el runner.
 */
export type SeedCounts = {
  pasajeros: number;
  tipos_vehiculo: number;
  empresas: number;
  conductores: number;
  vehiculos: number;
};

export const DEFAULT_SEED_COUNTS: SeedCounts = {
  pasajeros: 10,
  tipos_vehiculo: 25,
  empresas: 15,
  conductores: 20,
  vehiculos: 20,
};

export function resolveSeedCounts(argv: string[] = process.argv.slice(2)): SeedCounts {
  const counts: SeedCounts = { ...DEFAULT_SEED_COUNTS };

  const envPasajeros = process.env.SEED_PASAJEROS;
  if (envPasajeros !== undefined && envPasajeros !== "") {
    counts.pasajeros = Number(envPasajeros);
  }

  const envEmpresas = process.env.SEED_EMPRESAS;
  if (envEmpresas !== undefined && envEmpresas !== "") {
    counts.empresas = Number(envEmpresas);
  }

  const envVehiculos = process.env.SEED_VEHICULOS;
  if (envVehiculos !== undefined && envVehiculos !== "") {
    counts.vehiculos = Number(envVehiculos);
  }

  const envConductores = process.env.SEED_CONDUCTORES;
  if (envConductores !== undefined && envConductores !== "") {
    counts.conductores = Number(envConductores);
  }

  const envTiposVehiculo = process.env.SEED_TIPOS_VEHICULO;
  if (envTiposVehiculo !== undefined && envTiposVehiculo !== "") {
    counts.tipos_vehiculo = Number(envTiposVehiculo);
  }

  for (const arg of argv) {
    const m = arg.match(/^--([a-zA-Z_]+)=(\d+)$/);
    if (!m) continue;
    const key = m[1] as keyof SeedCounts;
    const value = Number(m[2]);
    if (key in counts) {
      counts[key] = value;
    }
  }

  return counts;
}
