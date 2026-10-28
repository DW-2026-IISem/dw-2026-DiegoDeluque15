import { faker } from "@faker-js/faker";
import { VehicleType } from "./vehicle-type.model";

/**
 * Seeder for VehicleType (fake data with @faker-js/faker).
 * Invoked from `src/database/seeders` (SeedersRunner), not from the App.
 * Idempotent: if rows already exist, skips insertion.
 */
export async function seedVehicleTypes(count: number): Promise<number> {
  if (count <= 0) {
    console.log("  vehicle_types: count=0, skipped");
    return 0;
  }

  const existing = await VehicleType.count();
  if (existing > 0) {
    console.log(`  vehicle_types: ${existing} record(s) already exist, skipping seeder`);
    return 0;
  }

  const rows = Array.from({ length: count }, () => ({
    name: faker.vehicle.type(),
    description: faker.lorem.sentence(),
    status: "active" as const,
  }));

  await VehicleType.bulkCreate(rows);
  console.log(`  vehicle_types: inserted ${count} fake record(s)`);
  return count;
}
