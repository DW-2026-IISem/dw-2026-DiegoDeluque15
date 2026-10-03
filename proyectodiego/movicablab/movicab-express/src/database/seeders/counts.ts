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
  turnos: number;
  tarifas: number;
  carreras: number;
};

export const DEFAULT_SEED_COUNTS: SeedCounts = {
  pasajeros: 10,
  tipos_vehiculo: 25,
  empresas: 15,
  conductores: 20,
  vehiculos: 20,
  turnos: 20,
  tarifas: 5,
  carreras: 10,
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

  const envCarreras = process.env.SEED_CARRERAS;
  if (envCarreras !== undefined && envCarreras !== "") {
    counts.carreras = Number(envCarreras);
  }

  const envTarifas = process.env.SEED_TARIFAS;
  if (envTarifas !== undefined && envTarifas !== "") {
    counts.tarifas = Number(envTarifas);
  }

  const envTurnos = process.env.SEED_TURNOS;
  if (envTurnos !== undefined && envTurnos !== "") {
    counts.turnos = Number(envTurnos);
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
