import { faker } from "@faker-js/faker";
import { Vehicle } from "./vehicle.model";
import { Company } from "../company/company.model";
import { VehicleType } from "../vehicle-type/vehicle-type.model";

/**
 * Seeder for Vehicle (fake data with @faker-js/faker).
 * - company_id: required, taken randomly from active companies.
 * - vehicle_type_id: optional (50% null, 50% existing type).
 * Invoked from SeedersRunner AFTER seedCompanies and seedVehicleTypes.
 * Idempotent: if rows already exist, skips insertion.
 */
export async function seedVehicles(count: number): Promise<number> {
  if (count <= 0) {
    console.log("  vehicles: count=0, skipped");
    return 0;
  }

  const existing = await Vehicle.count();
  if (existing > 0) {
    console.log(`  vehicles: ${existing} record(s) already exist, skipping seeder`);
    return 0;
  }

  const companies = await Company.findAll({ where: { status: "active" }, attributes: ["id"] });
  const companyIds = companies.map((c) => c.id);

  if (companyIds.length === 0) {
    console.log("  vehicles: no active companies, skipping seeder");
    return 0;
  }

  const types = await VehicleType.findAll({ attributes: ["id"] });
  const typeIds = types.map((t) => t.id);

  const rows = Array.from({ length: count }, () => {
    const company_id = companyIds[Math.floor(Math.random() * companyIds.length)];
    const useType = Math.random() > 0.5 && typeIds.length > 0;
    const vehicle_type_id = useType
      ? typeIds[Math.floor(Math.random() * typeIds.length)]
      : null;
    return {
      name: faker.vehicle.vehicle(),
      description: faker.lorem.sentence(),
      company_id,
      vehicle_type_id,
      status: "active" as const,
    };
  });

  await Vehicle.bulkCreate(rows);
  console.log(`  vehicles: inserted ${count} fake record(s)`);
  return count;
}
