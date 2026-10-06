import { Application } from "express";
import swaggerUi from "swagger-ui-express";
import { pasajeroSwagger } from "../features/business/pasajero/pasajero.swagger";
import { vehiculoTypeSwagger } from "../features/business/tipo-vehiculo/tipo-vehiculo.swagger";
import { empresaSwagger } from "../features/business/empresa/empresa.swagger";
import { conductorSwagger } from "../features/business/conductor/conductor.swagger";
import { vehiculoSwagger } from "../features/business/vehiculo/vehiculo.swagger";
import { turnoSwagger } from "../features/business/turno/turno.swagger";
import { tarifaSwagger } from "../features/business/tarifa/tarifa.swagger";
import { carreraSwagger } from "../features/business/carrera/carrera.swagger";
import { pagoSwagger } from "../features/business/pago/pago.swagger";
import { calificacionSwagger } from "../features/business/calificacion/calificacion.swagger";
import { liquidacionSwagger } from "../features/business/liquidacion/liquidacion.swagger";
import { sessionSwagger } from "../features/auth/session/session.swagger";
import { refreshTokensSwagger } from "../features/auth/refresh-tokens/refresh-tokens.swagger";
import { usersSwagger } from "../features/auth/users/users.swagger";
import { rolesSwagger } from "../features/auth/roles/roles.swagger";
import { resourcesSwagger } from "../features/auth/resources/resources.swagger";
import { roleUsersSwagger } from "../features/auth/role-users/role-users.swagger";
import { resourceRolesSwagger } from "../features/auth/resource-roles/resource-roles.swagger";
import { bearerSecurityScheme } from "../shared/http/swagger-security";
import { unauthorizedResponse, forbiddenResponse } from "../shared/http/swagger-security";

export type FeatureSwaggerModule = {
  tags: unknown[];
  paths: Record<string, unknown>;
  components?: { schemas?: Record<string, unknown> };
};

const featureSwaggerModules: FeatureSwaggerModule[] = [
  sessionSwagger,
  refreshTokensSwagger,
  usersSwagger,
  rolesSwagger,
  resourcesSwagger,
  roleUsersSwagger,
  resourceRolesSwagger,
  pasajeroSwagger,
  vehiculoTypeSwagger,
  empresaSwagger,
  conductorSwagger,
  vehiculoSwagger,
  turnoSwagger,
  tarifaSwagger,
  carreraSwagger,
  pagoSwagger,
  calificacionSwagger,
  liquidacionSwagger,
];

export function buildOpenApiDocument() {
  const tags: unknown[] = [];
  const paths: Record<string, unknown> = {};
  const schemas: Record<string, unknown> = {};

  for (const mod of featureSwaggerModules) {
    tags.push(...mod.tags);
    Object.assign(paths, mod.paths);
    if (mod.components?.schemas) {
      Object.assign(schemas, mod.components.schemas);
    }
  }

  return {
    openapi: "3.0.3",
    info: {
      title: "MoviCab API",
      version: "2.0.0",
      description: `API MoviCab (Express + Sequelize) con **Auth con RBAC**.

**Las tres modalidades de acceso**:
- **OPEN**: /api/sesion/login, /refresh, /logout.
- **JWT**: /api/sesion/perfil, /api/permisos, /api/sesiones/*.
- **JWT + RBAC**: CRUD de negocio.

Credenciales de laboratorio:  admin / Admin123! y seller / Seller123!`,
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 4000}`,
        description: "Local",
      },
    ],
    tags,
    paths,
    security: [{ bearerAuth: [] }],
    components: {
      securitySchemes: bearerSecurityScheme,
      responses: {
        Unauthorized: unauthorizedResponse,
        Forbidden: forbiddenResponse,
      },
      schemas,
    },
  };
}

export function setupSwagger(app: Application): void {
  const document = buildOpenApiDocument();
  app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(document));
  app.get("/api/docs.json", (_req, res) => {
    res.json(document);
  });
  console.log("?? Swagger UI: /api/docs  |  OpenAPI JSON: /api/docs.json");
}
