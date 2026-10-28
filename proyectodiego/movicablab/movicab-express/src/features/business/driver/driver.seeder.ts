import { faker } from "@faker-js/faker";
import { Driver } from "./driver.model";
import { Company } from "../company/company.model";

/**
 * Seeder for Driver (fake data with @faker-js/faker).
 * Assigns company_id randomly from active companies already seeded.
 * Invoked from SeedersRunner AFTER seedCompanies.
 * Idempotent: if rows already exist, skips insertion.
 */
export async function seedDrivers(count: number): Promise<number> {
  if (count <= 0) {
    console.log("  drivers: count=0, skipped");
    return 0;
  }

  const existing = await Driver.count();
  if (existing > 0) {
    console.log(`  drivers: ${existing} record(s) already exist, skipping seeder`);
    return 0;
  }

  const companies = await Company.findAll({ where: { status: "active" }, attributes: ["id"] });
  const companyIds = companies.map((c) => c.id);

  const rows = Array.from({ length: count }, () => {
    const company_id =
      companyIds.length > 0
        ? companyIds[Math.floor(Math.random() * companyIds.length)]
        : null;
    return {
      name: faker.person.fullName(),
      description: faker.lorem.sentence(),
      company_id,
      status: "active" as const,
    };
  });

  await Driver.bulkCreate(rows);
  console.log(`  drivers: inserted ${count} fake record(s)`);
  return count;
}
