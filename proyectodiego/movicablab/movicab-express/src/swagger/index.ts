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

export type FeatureSwaggerModule = {
  tags: unknown[];
  paths: Record<string, unknown>;
  components?: { schemas?: Record<string, unknown> };
};

/**
 * Registry externo: importa la documentación OpenAPI de cada feature
 * (mismo patrón que SeedersRunner).
 */
const featureSwaggerModules: FeatureSwaggerModule[] = [
  pasajeroSwagger,
  vehiculoTypeSwagger,
  empresaSwagger,
  conductorSwagger,
  vehiculoSwagger,
  turnoSwagger,
  tarifaSwagger,
  carreraSwagger,
  // userSwagger,
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
      version: "1.0.0",
      description:
        "API MoviCab (Express + Sequelize). Los endpoints de Pasajero están documentados como **SIN AUTH** Todas las rutas business son **SIN AUTH** en este lab.",
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 4000}`,
        description: "Local",
      },
    ],
    tags,
    paths,
    components: { schemas },
  };
}

/** Monta Swagger UI y el JSON OpenAPI */
export function setupSwagger(app: Application): void {
  const document = buildOpenApiDocument();
  app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(document));
  app.get("/api/docs.json", (_req, res) => {
    res.json(document);
  });
  console.log("📘 Swagger UI: /api/docs  |  OpenAPI JSON: /api/docs.json");
}
