import dotenv from "dotenv";
import { sequelize, testConnection } from "../db";

// Business Models
import "../../features/business/passenger/passenger.model";
import "../../features/business/vehicle-type/vehicle-type.model";
import "../../features/business/company/company.model";
import "../../features/business/driver/driver.model";
import "../../features/business/vehicle/vehicle.model";
import "../../features/business/shift/shift.model";
import "../../features/business/fare/fare.model";
import "../../features/business/trip/trip.model";
import "../../features/business/payment/payment.model";
import "../../features/business/rating/rating.model";
import "../../features/business/settlement/settlement.model";

// Auth Models
import "../../features/auth/role-users/role-user.model";
import "../../features/auth/resource-roles/resource-role.model";

// Auth Seeders
import { seedRoleUsers } from "../../features/auth/role-users/role-users.seeder";
import { seedResourceRoles } from "../../features/auth/resource-roles/resource-roles.seeder";
import { seedRoles } from "../../features/auth/roles/roles.seeder";
import { seedResources } from "../../features/auth/resources/resources.seeder";
import { seedUsers } from "../../features/auth/users/users.seeder";

// Business Seeders
import { seedPassengers } from "../../features/business/passenger/passenger.seeder";
import { seedVehicleTypes } from "../../features/business/vehicle-type/vehicle-type.seeder";
import { seedCompanies } from "../../features/business/company/company.seeder";
import { seedDrivers } from "../../features/business/driver/driver.seeder";
import { seedVehicles } from "../../features/business/vehicle/vehicle.seeder";
import { seedShifts } from "../../features/business/shift/shift.seeder";
import { seedFares } from "../../features/business/fare/fare.seeder";
import { seedTrips } from "../../features/business/trip/trip.seeder";
import { seedPayments } from "../../features/business/payment/payment.seeder";
import { seedRatings } from "../../features/business/rating/rating.seeder";

import { resolveSeedCounts } from "./counts";

dotenv.config();

/**
 * SeedersRunner — ejecuta TODOS los seeders de features.
 *
 * Ubicación: `src/database/seeders/` (orquestación fuera de cada feature).
 * Cada feature exporta su seeder.
 *
 * Uso:
 *   npm run db:seed
 *   npm run db:seed -- --passengers=20
 *   SEED_PASSENGERS=5 npm run db:seed
 */
export async function runAllSeeders(): Promise<void> {
  const counts = resolveSeedCounts();
  console.log("🌱 Iniciando SeedersRunner...");
  console.log("📊 Conteos:", counts);

  const ok = await testConnection();
  if (!ok) {
    throw new Error("No hay conexión a la base de datos");
  }

  const isMysql = sequelize.getDialect() === "mysql" || sequelize.getDialect() === "mariadb";
  if (isMysql) {
    await sequelize.query("SET FOREIGN_KEY_CHECKS = 0");
  }
  try {
    await sequelize.sync({ force: true });
  } finally {
    if (isMysql) {
      await sequelize.query("SET FOREIGN_KEY_CHECKS = 1");
    }
  }

  await seedRoles();
  await seedResources();
  await seedUsers(counts.users);
  await seedRoleUsers();
  await seedResourceRoles();

  // Orden: business (padres -> hijos)
  await seedPassengers(counts.passengers);
  await seedVehicleTypes(counts.vehicle_types);
  await seedCompanies(counts.companies);
  await seedDrivers(counts.drivers);
  await seedVehicles(counts.vehicles);
  await seedShifts(counts.shifts);
  await seedFares(counts.fares);
  await seedTrips(counts.trips);
  await seedPayments();
  await seedRatings();

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
