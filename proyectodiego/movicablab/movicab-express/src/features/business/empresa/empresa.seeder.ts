import { faker } from "@faker-js/faker";
import { Empresa } from "./empresa.model";

/**
 * Seeder del feature Empresa (datos falsos con @faker-js/faker).
 * Se invoca desde `src/database/seeders` (SeedersRunner), no desde la App.
 *
 * Idempotente: si ya hay filas, no vuelve a insertar.
 */
export async function seedEmpresas(count: number): Promise<number> {
  if (count <= 0) {
    console.log("  empresas: count=0, se omite");
    return 0;
  }

  const existing = await Empresa.count();
  if (existing > 0) {
    console.log(`  empresas: ya hay ${existing} registro(s), se omite seeder`);
    return 0;
  }

  const usedNits = new Set<string>();
  const rows = Array.from({ length: count }, () => {
    let nit: string;
    do {
      nit = faker.string.numeric({ length: { min: 9, max: 10 } }) + "-" + faker.string.numeric(1);
    } while (usedNits.has(nit));
    usedNits.add(nit);

    return {
      nit,
      razon_social: faker.company.name(),
      contacto_principal: faker.person.fullName(),
      status: "active" as const,
    };
  });

  await Empresa.bulkCreate(rows);
  console.log(`  empresas: insertados ${count} registro(s) falsos`);
  return count;
}
