/**
 * Catálogo de recursos del sistema MoviCab Express (fuente única de verdad).
 *
 * Un "recurso" es el par (method, path) que identifica un endpoint HTTP.
 * El motor RBAC (`resource-match.ts`) usa este catálogo para autorizar cada
 * petición: comprueba si el rol del usuario tiene concedido ese par exacto.
 *
 * Este catálogo fue generado recorriendo todos los archivos *.routes.ts del
 * proyecto — un recurso por cada .get()/.post()/.put()/.patch()/.delete()
 * registrado, sin deduplicar paths (PUT y PATCH sobre el mismo path son 2 recursos).
 *
 * Distribución por entidad:
 *
 * | Entidad                                         | Recursos |
 * |--------------------------------------------------|----------|
 * | Pasajeros                                      | 7        |
 * | Tipos de Vehículo                              | 7        |
 * | Empresas                                       | 7        |
 * | Conductores                                    | 7        |
 * | Vehículos                                      | 7        |
 * | Turnos                                         | 7        |
 * | Tarifas                                        | 8        |
 * | Carreras                                       | 6        |
 * | Pagos                                          | 3        | (inmutable: GET×2 + POST)
 * | Calificaciones                                 | 7        |
 * | Liquidaciones                                  | 3        | (inmutable: GET×2 + POST)
 * | Usuarios                                       | 9        |
 * | Roles                                          | 7        |
 * | Recursos                                       | 7        |
 * | **Total**                                        | **92**    |
 *
 * Nota: las operaciones de sesión (`/api/sesion/*`) son modalidad OPEN/JWT,
 * no pasan por la matriz RBAC — no son recursos.
 */
export interface CatalogResource {
  method: string;
  path: string;
  description: string;
  /** `true` si el rol DESPACHO recibe esta concesión. */
  despacho?: boolean;
}

export const RESOURCE_CATALOG: readonly CatalogResource[] = [
  // ── Pasajeros (7) ─────────────────────────────────────────
  { method: "GET", path: "/api/pasajeros", description: "Listar pasajeros", despacho: true },
  { method: "GET", path: "/api/pasajeros/:id", description: "Consultar pasajero", despacho: true },
  { method: "POST", path: "/api/pasajeros", description: "Crear pasajero" },
  { method: "PUT", path: "/api/pasajeros/:id", description: "Reemplazar pasajero" },
  { method: "PATCH", path: "/api/pasajeros/:id", description: "Modificar pasajero" },
  { method: "DELETE", path: "/api/pasajeros/:id", description: "Eliminar pasajero" },
  { method: "PATCH", path: "/api/pasajeros/:id/deactivate", description: "Desactivar pasajero" },

  // ── Tipos de Vehículo (7) ─────────────────────────────────
  { method: "GET", path: "/api/tipos-vehiculo", description: "Listar tipos-vehiculo", despacho: true },
  { method: "GET", path: "/api/tipos-vehiculo/:id", description: "Consultar tipo de vehículo", despacho: true },
  { method: "POST", path: "/api/tipos-vehiculo", description: "Crear tipo de vehículo" },
  { method: "PUT", path: "/api/tipos-vehiculo/:id", description: "Reemplazar tipo de vehículo" },
  { method: "PATCH", path: "/api/tipos-vehiculo/:id", description: "Modificar tipo de vehículo" },
  { method: "DELETE", path: "/api/tipos-vehiculo/:id", description: "Eliminar tipo de vehículo" },
  { method: "PATCH", path: "/api/tipos-vehiculo/:id/deactivate", description: "Desactivar tipo de vehículo" },

  // ── Empresas (7) ──────────────────────────────────────────
  { method: "GET", path: "/api/empresas", description: "Listar empresas", despacho: true },
  { method: "GET", path: "/api/empresas/:id", description: "Consultar empresa", despacho: true },
  { method: "POST", path: "/api/empresas", description: "Crear empresa" },
  { method: "PUT", path: "/api/empresas/:id", description: "Reemplazar empresa" },
  { method: "PATCH", path: "/api/empresas/:id", description: "Modificar empresa" },
  { method: "DELETE", path: "/api/empresas/:id", description: "Eliminar empresa" },
  { method: "PATCH", path: "/api/empresas/:id/deactivate", description: "Desactivar empresa" },

  // ── Conductores (7) ───────────────────────────────────────
  { method: "GET", path: "/api/conductores", description: "Listar conductores", despacho: true },
  { method: "GET", path: "/api/conductores/:id", description: "Consultar conductor", despacho: true },
  { method: "POST", path: "/api/conductores", description: "Crear conductor" },
  { method: "PUT", path: "/api/conductores/:id", description: "Reemplazar conductor" },
  { method: "PATCH", path: "/api/conductores/:id", description: "Modificar conductor" },
  { method: "DELETE", path: "/api/conductores/:id", description: "Eliminar conductor" },
  { method: "PATCH", path: "/api/conductores/:id/deactivate", description: "Desactivar conductor" },

  // ── Vehículos (7) ─────────────────────────────────────────
  { method: "GET", path: "/api/vehiculos", description: "Listar vehiculos", despacho: true },
  { method: "POST", path: "/api/vehiculos", description: "Crear vehículo" },
  { method: "GET", path: "/api/vehiculos/:id", description: "Consultar vehículo", despacho: true },
  { method: "PUT", path: "/api/vehiculos/:id", description: "Reemplazar vehículo" },
  { method: "PATCH", path: "/api/vehiculos/:id", description: "Modificar vehículo" },
  { method: "DELETE", path: "/api/vehiculos/:id", description: "Eliminar vehículo" },
  { method: "PATCH", path: "/api/vehiculos/:id/deactivate", description: "Desactivar vehículo" },

  // ── Turnos (7) ────────────────────────────────────────────
  { method: "GET", path: "/api/turnos", description: "Listar turnos", despacho: true },
  { method: "POST", path: "/api/turnos", description: "Crear turno" },
  { method: "GET", path: "/api/turnos/:id", description: "Consultar turno", despacho: true },
  { method: "PUT", path: "/api/turnos/:id", description: "Reemplazar turno" },
  { method: "PATCH", path: "/api/turnos/:id", description: "Modificar turno" },
  { method: "DELETE", path: "/api/turnos/:id", description: "Eliminar turno" },
  { method: "PATCH", path: "/api/turnos/:id/deactivate", description: "Desactivar turno" },

  // ── Tarifas (8) ───────────────────────────────────────────
  { method: "GET", path: "/api/tarifas/vigente", description: "Consultar tarifa vigente", despacho: true },
  { method: "GET", path: "/api/tarifas", description: "Listar tarifas", despacho: true },
  { method: "POST", path: "/api/tarifas", description: "Crear tarifa" },
  { method: "GET", path: "/api/tarifas/:id", description: "Consultar tarifa", despacho: true },
  { method: "PUT", path: "/api/tarifas/:id", description: "Reemplazar tarifa" },
  { method: "PATCH", path: "/api/tarifas/:id", description: "Modificar tarifa" },
  { method: "DELETE", path: "/api/tarifas/:id", description: "Eliminar tarifa" },
  { method: "PATCH", path: "/api/tarifas/:id/deactivate", description: "Desactivar tarifa" },

  // ── Carreras (6) ──────────────────────────────────────────
  { method: "GET", path: "/api/carreras", description: "Listar carreras", despacho: true },
  { method: "POST", path: "/api/carreras", description: "Crear carrera", despacho: true },
  { method: "PATCH", path: "/api/carreras/:id/estado", description: "Cambiar estado de carrera", despacho: true },
  { method: "GET", path: "/api/carreras/:id", description: "Consultar carrera", despacho: true },
  { method: "PATCH", path: "/api/carreras/:id", description: "Modificar carrera", despacho: true },
  { method: "DELETE", path: "/api/carreras/:id", description: "Eliminar carrera" },

  // ── Pagos (3) ─────────────────────────────────────────────
  { method: "GET", path: "/api/pagos", description: "Listar pagos", despacho: true },
  { method: "POST", path: "/api/pagos", description: "Crear pago", despacho: true },
  { method: "GET", path: "/api/pagos/:id", description: "Consultar pago", despacho: true },

  // ── Calificaciones (7) ────────────────────────────────────
  { method: "GET", path: "/api/calificaciones", description: "Listar calificaciones", despacho: true },
  { method: "POST", path: "/api/calificaciones", description: "Crear calificación", despacho: true },
  { method: "GET", path: "/api/calificaciones/:id", description: "Consultar calificación", despacho: true },
  { method: "PUT", path: "/api/calificaciones/:id", description: "Reemplazar calificación" },
  { method: "PATCH", path: "/api/calificaciones/:id", description: "Modificar calificación" },
  { method: "DELETE", path: "/api/calificaciones/:id", description: "Eliminar calificación" },
  { method: "PATCH", path: "/api/calificaciones/:id/deactivate", description: "Desactivar calificación" },

  // ── Liquidaciones (3) ─────────────────────────────────────
  { method: "GET", path: "/api/liquidaciones", description: "Listar liquidaciones", despacho: true },
  { method: "POST", path: "/api/liquidaciones", description: "Generar liquidación", despacho: true },
  { method: "GET", path: "/api/liquidaciones/:id", description: "Consultar liquidación", despacho: true },

  // ── Usuarios (9) ──────────────────────────────────────────
  { method: "GET", path: "/api/usuarios", description: "Listar usuarios" },
  { method: "GET", path: "/api/usuarios/:id", description: "Consultar usuario" },
  { method: "POST", path: "/api/usuarios", description: "Crear usuario" },
  { method: "PUT", path: "/api/usuarios/:id", description: "Reemplazar usuario" },
  { method: "PATCH", path: "/api/usuarios/:id", description: "Modificar usuario" },
  { method: "DELETE", path: "/api/usuarios/:id", description: "Eliminar usuario" },
  { method: "PATCH", path: "/api/usuarios/:id/deactivate", description: "Desactivar usuario" },
  { method: "PATCH", path: "/api/usuarios/:id/password", description: "Cambiar contraseña de usuario" },
  { method: "GET", path: "/api/usuarios/:id/permisos", description: "Consultar permisos efectivos del usuario" },

  // ── Roles (7) ─────────────────────────────────────────────
  { method: "GET", path: "/api/roles", description: "Listar roles" },
  { method: "GET", path: "/api/roles/:id", description: "Consultar rol" },
  { method: "POST", path: "/api/roles", description: "Crear rol" },
  { method: "PUT", path: "/api/roles/:id", description: "Reemplazar rol" },
  { method: "PATCH", path: "/api/roles/:id", description: "Modificar rol" },
  { method: "DELETE", path: "/api/roles/:id", description: "Eliminar rol" },
  { method: "PATCH", path: "/api/roles/:id/deactivate", description: "Desactivar rol" },

  // ── Recursos (7) ──────────────────────────────────────────
  { method: "GET", path: "/api/recursos", description: "Listar recursos" },
  { method: "GET", path: "/api/recursos/:id", description: "Consultar recurso" },
  { method: "POST", path: "/api/recursos", description: "Crear recurso" },
  { method: "PUT", path: "/api/recursos/:id", description: "Reemplazar recurso" },
  { method: "PATCH", path: "/api/recursos/:id", description: "Modificar recurso" },
  { method: "DELETE", path: "/api/recursos/:id", description: "Eliminar recurso" },
  { method: "PATCH", path: "/api/recursos/:id/deactivate", description: "Desactivar recurso" },
];

/** Recursos que recibe el rol DESPACHO. Derivado del catálogo, no duplicado. */
export const DESPACHO_RESOURCES: readonly CatalogResource[] = RESOURCE_CATALOG.filter(
  (resource) => resource.despacho === true
);
