import { Resource } from "../resources/resource.model";
import { Role } from "../roles/role.model";
import { ResourceRolesService } from "./resource-roles.service";

/**
 * Seeder de las concesiones rol ↔ recurso (`resource_roles`).
 * **Es el que construye la matriz de permisos real de MoviCab.**
 *
 * Reparto de referencia:
 *  - ADMIN    → los **92** recursos (administración total).
 *  - DESPACHO → subconjunto de recursos de operación (ver regla abajo).
 *
 * Regla DESPACHO (programática, no hardcodeada):
 *  - GET de TODAS las entidades de negocio (pasajeros, tipos-vehiculo,
 *    empresas, conductores, vehiculos, turnos, tarifas, calificaciones).
 *  - Todas las demás entidades de negocio (incluidas pagos y liquidaciones) en solo lectura.
 *  - POST + PATCH de carreras (puede crear, modificar observaciones y cambiar
 *    estado de una carrera, incluyendo PATCH /:id/estado), pero NO DELETE.
 *  - NO acceso a /api/usuarios, /api/roles, /api/recursos (auth management).
 *
 * `reconcileRole` es determinista: volver a ejecutar el seeder reconcilia el
 * catálogo en vez de duplicar filas.
 */
export async function seedResourceRoles(): Promise<number> {
  const service = new ResourceRolesService();

  // Carga todos los recursos activos y los indexa por "METHOD path"
  const resources = await Resource.findAll({ where: { status: "active" } });
  const idByOperation = new Map<string, number>(
    resources.map((r) => [`${r.method} ${r.path}`, r.id])
  );

  // ── Recursos para ADMIN: absolutamente todos ──────────────────────────
  const adminIds = resources.map((r) => r.id);

  // ── Recursos para DESPACHO: regla programática ────────────────────────
  const AUTH_PREFIXES = ["/api/usuarios", "/api/roles", "/api/recursos"];

  const despachoIds = resources
    .filter((r) => {
      // Excluir gestión de auth/admin (usuarios, roles, recursos)
      if (AUTH_PREFIXES.some((prefix) => r.path.startsWith(prefix))) return false;

      // Carreras: todos los métodos excepto DELETE (GET, POST, PATCH incluido /estado)
      if (r.path.startsWith("/api/carreras")) {
        return r.method !== "DELETE";
      }

      // Pagos, calificaciones, liquidaciones: ahora son solo lectura (caen en la regla general abajo)

      // Resto de entidades de negocio (incluye calificaciones): solo lectura (GET)
      return r.method === "GET";
    })
    .map((r) => r.id);

  let total = 0;

  const admin = await Role.findOne({ where: { name: "ADMIN" } });
  if (admin) {
    const result = await service.reconcileRole(admin.id, adminIds);
    console.log(
      `✅ resource_roles: ADMIN → ${result.total_active} recursos ` +
        `(${result.activated} altas, ${result.deactivated} bajas)`
    );
    total += result.total_active;
  } else {
    console.log("⚠️  resource_roles: rol ADMIN no encontrado, se omite");
  }

  const despacho = await Role.findOne({ where: { name: "DESPACHO" } });
  if (despacho) {
    const result = await service.reconcileRole(despacho.id, despachoIds);
    console.log(
      `✅ resource_roles: DESPACHO → ${result.total_active} recursos ` +
        `(${result.activated} altas, ${result.deactivated} bajas)`
    );
    total += result.total_active;
  } else {
    console.log("⚠️  resource_roles: rol DESPACHO no encontrado, se omite");
  }

  return total;
}
