import dotenv from "dotenv";
import { sequelize, testConnection } from "../db";
import "../../features/business/pasajero/pasajero.model";
import "../../features/business/tipo-vehiculo/tipo-vehiculo.model";
import "../../features/business/empresa/empresa.model";
import "../../features/business/conductor/conductor.model";
import "../../features/business/vehiculo/vehiculo.model";
import "../../features/business/turno/turno.model";
import "../../features/business/tarifa/tarifa.model";
import { seedPasajeros } from "../../features/business/pasajero/pasajero.seeder";
import { seedTipoVehiculos } from "../../features/business/tipo-vehiculo/tipo-vehiculo.seeder";
import { seedEmpresas } from "../../features/business/empresa/empresa.seeder";
import { seedConductores } from "../../features/business/conductor/conductor.seeder";
import { seedVehiculos } from "../../features/business/vehiculo/vehiculo.seeder";
import { seedTurnos } from "../../features/business/turno/turno.seeder";
import { seedTarifas } from "../../features/business/tarifa/tarifa.seeder";
import { resolveSeedCounts } from "./counts";

dotenv.config();

/**
 * SeedersRunner — ejecuta TODOS los seeders de features.
 *
 * Ubicación: `src/database/seeders/` (orquestación fuera de cada feature).
 * Cada feature exporta su seeder (ej. `features/business/pasajero/pasajero.seeder.ts`).
 *
 * Uso:
 *   npm run db:seed
 *   npm run db:seed -- --pasajeros=20
 *   SEED_PASAJEROS=5 npm run db:seed
 */
export async function runAllSeeders(): Promise<void> {
  const counts = resolveSeedCounts();
  console.log("🌱 Iniciando SeedersRunner...");
  console.log("📊 Conteos:", counts);

  const ok = await testConnection();
  if (!ok) {
    throw new Error("No hay conexión a la base de datos");
  }

  await sequelize.sync({ force: false, alter: true });

  // Orden: business (padres -> hijos)
  await seedPasajeros(counts.pasajeros);
  await seedTipoVehiculos(counts.tipos_vehiculo);
  await seedEmpresas(counts.empresas);
  await seedConductores(counts.conductores);
  await seedVehiculos(counts.vehiculos);
  await seedTurnos(counts.turnos);
  await seedTarifas(counts.tarifas);

  console.log("🌱 SeedersRunner finalizado");
}

if (require.main === module) {
  runAllSeeders()
    .then(async () => {
      await sequelize.close();
      process.exit(0);
    })
    .catch(async (err) => {
      console.error("❌ Error en seeders:", err);
      await sequelize.close();
      process.exit(1);
    });
}
