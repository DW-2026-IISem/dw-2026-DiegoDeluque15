import { faker } from "@faker-js/faker";
import { Vehiculo } from "./vehiculo.model";
import { Empresa } from "../empresa/empresa.model";
import { TipoVehiculo } from "../tipo-vehiculo/tipo-vehiculo.model";

/**
 * Seeder del feature Vehiculo (datos falsos con @faker-js/faker).
 * - empresa_id: obligatorio, tomado aleatoriamente de empresas active.
 * - tipo_vehiculo_id: opcional (50% null, 50% tipo existente).
 * Se invoca desde SeedersRunner DESPUES de seedEmpresas y seedTipoVehiculos.
 * Idempotente: si ya hay filas, no vuelve a insertar.
 */
export async function seedVehiculos(count: number): Promise<number> {
  if (count <= 0) {
    console.log("  vehiculos: count=0, se omite");
    return 0;
  }

  const existing = await Vehiculo.count();
  if (existing > 0) {
    console.log(`  vehiculos: ya hay ${existing} registro(s), se omite seeder`);
    return 0;
  }

  const empresas = await Empresa.findAll({ where: { status: "active" }, attributes: ["id"] });
  const empresaIds = empresas.map((e) => e.id);

  if (empresaIds.length === 0) {
    console.log("  vehiculos: no hay empresas active, se omite seeder");
    return 0;
  }

  const tipos = await TipoVehiculo.findAll({ attributes: ["id"] });
  const tipoIds = tipos.map((t) => t.id);

  const rows = Array.from({ length: count }, () => {
    const empresa_id = empresaIds[Math.floor(Math.random() * empresaIds.length)];
    const useTipo = Math.random() > 0.5 && tipoIds.length > 0;
    const tipo_vehiculo_id = useTipo
      ? tipoIds[Math.floor(Math.random() * tipoIds.length)]
      : null;
    return {
      nombre: faker.vehicle.vehicle(),
      descripcion: faker.lorem.sentence(),
      empresa_id,
      tipo_vehiculo_id,
      status: "active" as const,
    };
  });

  await Vehiculo.bulkCreate(rows);
  console.log(`  vehiculos: insertados ${count} registro(s) falsos`);
  return count;
}
