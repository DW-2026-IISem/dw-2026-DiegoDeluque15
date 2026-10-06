import { faker } from "@faker-js/faker";
import { Conductor } from "./conductor.model";
import { Empresa } from "../empresa/empresa.model";

/**
 * Seeder del feature Conductor (datos falsos con @faker-js/faker).
 * Asigna empresa_id aleatoriamente de las empresas active ya sembradas.
 * Se invoca desde `src/database/seeders` (SeedersRunner), DESPUES de seedEmpresas.
 *
 * Idempotente: si ya hay filas, no vuelve a insertar.
 */
export async function seedConductores(count: number): Promise<number> {
  if (count <= 0) {
    console.log("  conductores: count=0, se omite");
    return 0;
  }

  const existing = await Conductor.count();
  if (existing > 0) {
    console.log(`  conductores: ya hay ${existing} registro(s), se omite seeder`);
    return 0;
  }

  // Obtener ids de empresas active para distribuir aleatoriamente
  const empresas = await Empresa.findAll({ where: { status: "active" }, attributes: ["id"] });
  const empresaIds = empresas.map((e) => e.id);

  const rows = Array.from({ length: count }, () => {
    const empresa_id =
      empresaIds.length > 0
        ? empresaIds[Math.floor(Math.random() * empresaIds.length)]
        : null;
    return {
      nombre: faker.person.fullName(),
      descripcion: faker.lorem.sentence(),
      empresa_id,
      status: "active" as const,
    };
  });

  await Conductor.bulkCreate(rows);
  console.log(`  conductores: insertados ${count} registro(s) falsos`);
  return count;
}
