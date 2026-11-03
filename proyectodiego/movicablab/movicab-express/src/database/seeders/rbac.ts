import { sequelize, testConnection } from "../db";
import { seedResourceRoles } from "../../features/auth/resource-roles/resource-roles.seeder";
import { seedResources } from "../../features/auth/resources/resources.seeder";

async function runRbacSeed(): Promise<void> {
  const connected = await testConnection();
  if (!connected) {
    throw new Error("No hay conexión a la base de datos");
  }

  await seedResources();
  await seedResourceRoles();
}

if (require.main === module) {
  runRbacSeed()
    .then(async () => {
      await sequelize.close();
      process.exit(0);
    })
    .catch(async (error) => {
      console.error("❌ Error al sincronizar el catálogo RBAC:", error);
      await sequelize.close();
      process.exit(1);
    });
}
