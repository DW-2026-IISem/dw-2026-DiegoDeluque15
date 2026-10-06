import os

swagger_path = 'src/swagger/index.ts'
with open(swagger_path, 'r') as f:
    swagger = f.read()

setup_swagger = '''
/** Monta Swagger UI y el JSON OpenAPI */
export function setupSwagger(app: any): void {
  const document = buildOpenApiDocument();
  app.use("/api/docs", __importStar(require("swagger-ui-express")).serve, __importStar(require("swagger-ui-express")).setup(document));
  app.get("/api/docs.json", (_req: any, res: any) => {
    res.json(document);
  });
  console.log("?? Swagger UI: /api/docs  |  OpenAPI JSON: /api/docs.json");
}
'''

if 'export function setupSwagger' not in swagger:
    swagger += '\n' + '''
import swaggerUi from "swagger-ui-express";
export function setupSwagger(app: Application): void {
  const document = buildOpenApiDocument();
  app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(document));
  app.get("/api/docs.json", (_req, res) => {
    res.json(document);
  });
  console.log("?? Swagger UI: /api/docs  |  OpenAPI JSON: /api/docs.json");
}
'''
    with open(swagger_path, 'w') as f:
        f.write(swagger)
