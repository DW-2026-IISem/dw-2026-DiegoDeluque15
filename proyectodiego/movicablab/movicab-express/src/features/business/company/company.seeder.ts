import { faker } from "@faker-js/faker";
import { Company } from "./company.model";

/**
 * Seeder for Company (fake data with @faker-js/faker).
 * Invoked from `src/database/seeders` (SeedersRunner), not from the App.
 * Idempotent: if rows already exist, skips insertion.
 */
export async function seedCompanies(count: number): Promise<number> {
  if (count <= 0) {
    console.log("  companies: count=0, skipped");
    return 0;
  }

  const existing = await Company.count();
  if (existing > 0) {
    console.log(`  companies: ${existing} record(s) already exist, skipping seeder`);
    return 0;
  }

  const usedTaxIds = new Set<string>();
  const rows = Array.from({ length: count }, () => {
    let tax_id: string;
    do {
      tax_id = faker.string.numeric({ length: { min: 9, max: 10 } }) + "-" + faker.string.numeric(1);
    } while (usedTaxIds.has(tax_id));
    usedTaxIds.add(tax_id);

    return {
      tax_id,
      legal_name: faker.company.name(),
      primary_contact: faker.person.fullName(),
      status: "active" as const,
    };
  });

  await Company.bulkCreate(rows);
  console.log(`  companies: inserted ${count} fake record(s)`);
  return count;
}
