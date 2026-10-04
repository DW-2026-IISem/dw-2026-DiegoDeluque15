import { Role } from "./role.model";

/**
 * Seeder del catálogo de roles (`roles`).
 *
 * Crea los dos roles canónicos del sistema MoviCab. Es determinista e
 * idempotente: `findOrCreate` por nombre y reactivación si ya existía inactivo.
 *
 * Los roles nacen **sin permisos**: las concesiones las crea el seeder de
 * `resource_roles` (ISS-19). ADMIN recibe todos los recursos, DESPACHO
 * solo los que necesita para operar carreras.
 */
export const SEED_ROLES = [
  { name: "ADMIN", description: "Administración total del sistema: gestiona usuarios, roles, permisos y todas las entidades" },
  { name: "DESPACHO", description: "Operación de despacho: consulta todo el catálogo y puede crear/actualizar Carreras" },
] as const;

export async function seedRoles(): Promise<number> {
  let created = 0;

  for (const item of SEED_ROLES) {
    const [role, wasCreated] = await Role.findOrCreate({
      where: { name: item.name },
      defaults: { name: item.name, description: item.description, status: "active" },
    });

    if (wasCreated) {
      created++;
      continue;
    }
    if (role.status !== "active") {
      await role.update({ status: "active" });
    }
  }

  console.log(`✅ roles: catálogo reconciliado (${SEED_ROLES.length} roles, ${created} nuevos)`);
  return created;
}
