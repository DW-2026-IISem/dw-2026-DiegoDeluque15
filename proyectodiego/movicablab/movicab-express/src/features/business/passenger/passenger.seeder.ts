import { faker } from "@faker-js/faker";
import { Passenger } from "./passenger.model";

/**
 * Seeder for Passenger (fake data with @faker-js/faker).
 * Invoked from `src/database/seeders` (SeedersRunner), not from the App.
 * Idempotent: if rows already exist, skips insertion.
 */
export async function seedPassengers(count: number): Promise<number> {
  if (count <= 0) {
    console.log("  passengers: count=0, skipped");
    return 0;
  }

  const existing = await Passenger.count();
  if (existing > 0) {
    console.log(`  passengers: ${existing} record(s) already exist, skipping seeder`);
    return 0;
  }

  const rows = Array.from({ length: count }, (_, i) => ({
    name: faker.person.fullName(),
    address: faker.location.streetAddress(),
    phone: faker.phone.number({ style: "national" }),
    email: `passenger.${i}.${faker.string.alphanumeric(6)}@example.com`.toLowerCase(),
    password: "Password123!",
    status: "active" as const,
  }));

  await Passenger.bulkCreate(rows);
  console.log(`  passengers: inserted ${count} fake record(s)`);
  return count;
}
