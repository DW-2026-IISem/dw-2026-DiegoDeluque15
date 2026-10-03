import { faker } from "@faker-js/faker";
import { TipoVehiculo } from "./tipo-vehiculo.model";

/**
 * Seeder del feature TipoVehiculo (datos falsos con @faker-js/faker).
 * Se invoca desde `src/database/seeders` (SeedersRunner), no desde la App.
 *
 * Idempotente: si ya hay filas, no vuelve a insertar.
 */
export async function seedTipoVehiculos(count: number): Promise<number> {
  if (count <= 0) {
    console.log("⏭️  tipos_vehiculo: count=0, se omite");
    return 0;
  }

  const existing = await TipoVehiculo.count();
  if (existing > 0) {
    console.log(`⏭️  tipos_vehiculo: ya hay ${existing} registro(s), se omite seeder`);
    return 0;
  }

  const rows = Array.from({ length: count }, () => ({
    name: faker.vehicle.type(),
    description: faker.lorem.sentence(),
    status: "active" as const,
  }));

  await TipoVehiculo.bulkCreate(rows);
  console.log(`✅ tipos_vehiculo: insertados ${count} registro(s) falsos`);
  return count;
}
