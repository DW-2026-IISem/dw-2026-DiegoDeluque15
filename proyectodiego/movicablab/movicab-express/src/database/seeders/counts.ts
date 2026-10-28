/**
 * Cantidad de registros por feature/entidad.
 * Prioridad: CLI (--passengers=N) > env (SEED_PASSENGERS) > default de este archivo.
 *
 * Cuando agregues features, suma aquí la clave y léela en el runner.
 */
export type SeedCounts = {
  passengers: number;
  vehicle_types: number;
  companies: number;
  drivers: number;
  vehicles: number;
  shifts: number;
  fares: number;
  trips: number;
  payments: number;
  ratings: number;
  users: number;
  roles: number;
  role_users: number;
  resource_roles: number;
  resources: number;
};

export const DEFAULT_SEED_COUNTS: SeedCounts = {
  passengers: 10,
  vehicle_types: 25,
  companies: 15,
  drivers: 20,
  vehicles: 20,
  shifts: 20,
  fares: 5,
  trips: 10,
  payments: 0, // seeder determina la cantidad por trips cerradas
  ratings: 0,
  users: 2,
  roles: 2,
  role_users: 2,
  resource_roles: 0,
  resources: 0,
};

export function resolveSeedCounts(argv: string[] = process.argv.slice(2)): SeedCounts {
  const counts: SeedCounts = { ...DEFAULT_SEED_COUNTS };

  const envPassengers = process.env.SEED_PASSENGERS;
  if (envPassengers !== undefined && envPassengers !== "") {
    counts.passengers = Number(envPassengers);
  }

  const envCompanies = process.env.SEED_COMPANIES;
  if (envCompanies !== undefined && envCompanies !== "") {
    counts.companies = Number(envCompanies);
  }

  const envTrips = process.env.SEED_TRIPS;
  if (envTrips !== undefined && envTrips !== "") {
    counts.trips = Number(envTrips);
  }

  const envFares = process.env.SEED_FARES;
  if (envFares !== undefined && envFares !== "") {
    counts.fares = Number(envFares);
  }

  const envShifts = process.env.SEED_SHIFTS;
  if (envShifts !== undefined && envShifts !== "") {
    counts.shifts = Number(envShifts);
  }

  const envVehicles = process.env.SEED_VEHICLES;
  if (envVehicles !== undefined && envVehicles !== "") {
    counts.vehicles = Number(envVehicles);
  }

  const envDrivers = process.env.SEED_DRIVERS;
  if (envDrivers !== undefined && envDrivers !== "") {
    counts.drivers = Number(envDrivers);
  }

  const envVehicleTypes = process.env.SEED_VEHICLE_TYPES;
  if (envVehicleTypes !== undefined && envVehicleTypes !== "") {
    counts.vehicle_types = Number(envVehicleTypes);
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
