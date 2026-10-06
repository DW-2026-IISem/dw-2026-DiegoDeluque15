import os
import re

# 1. Update config/index.ts
config_path = 'src/config/index.ts'
with open(config_path, 'r') as f:
    config = f.read()

if 'private errorHandling()' not in config:
    config = config.replace('private docs(): void {', 'private errorHandling(): void {\n    const bodyErrorHandler: any = (err: any, _req: any, res: any, next: any) => {\n      if (err instanceof SyntaxError && "body" in err) {\n        res.status(400).json({ error: "Malformed JSON body" });\n        return;\n      }\n      next(err);\n    };\n    this.app.use(bodyErrorHandler);\n  }\n\n  private docs(): void {')
    config = config.replace('this.docs();', 'this.docs();\n    this.errorHandling();')

with open(config_path, 'w') as f:
    f.write(config)

# 3. Update swagger/index.ts
swagger_path = 'src/swagger/index.ts'
with open(swagger_path, 'r') as f:
    swagger = f.read()

imports = '''import { sessionSwagger } from "../features/auth/session/session.swagger";
import { refreshTokensSwagger } from "../features/auth/refresh-tokens/refresh-tokens.swagger";
import { usersSwagger } from "../features/auth/users/users.swagger";
import { rolesSwagger } from "../features/auth/roles/roles.swagger";
import { resourcesSwagger } from "../features/auth/resources/resources.swagger";
import { roleUsersSwagger } from "../features/auth/role-users/role-users.swagger";
import { resourceRolesSwagger } from "../features/auth/resource-roles/resource-roles.swagger";
import { bearerSecurityScheme } from "../shared/http/swagger-security";
import { unauthorizedResponse, forbiddenResponse } from "../shared/http/swagger-security";'''

if 'sessionSwagger' not in swagger:
    swagger = swagger.replace('import { liquidacionSwagger } from "../features/business/liquidacion/liquidacion.swagger";', 'import { liquidacionSwagger } from "../features/business/liquidacion/liquidacion.swagger";\n' + imports)

    feature_array = '''const featureSwaggerModules: FeatureSwaggerModule[] = [
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
];'''
    swagger = re.sub(r'const featureSwaggerModules: FeatureSwaggerModule\[\] = \[.*?\];', feature_array, swagger, flags=re.DOTALL)

    build_doc = '''return {
    openapi: "3.0.3",
    info: {
      title: "MoviCab API",
      version: "2.0.0",
      description: "API MoviCab (Express + Sequelize) con **Auth con RBAC**.\\n\\n**Las tres modalidades de acceso**:\\n- **OPEN**: /api/sesion/login, /refresh, /logout.\\n- **JWT**: /api/sesion/perfil, /api/permisos, /api/sesiones/*.\\n- **JWT + RBAC**: CRUD de negocio.\\n\\nCredenciales de laboratorio: dmin / Admin123! y seller / Seller123!.",
    },
    servers: [
      {
        url: http://localhost:,
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
  };'''
    swagger = re.sub(r'return \{\s*openapi.*?components: \{ schemas \},\s*\};', build_doc, swagger, flags=re.DOTALL)

with open(swagger_path, 'w') as f:
    f.write(swagger)

# 4. Update seeders/index.ts
seeder_path = 'src/database/seeders/index.ts'
with open(seeder_path, 'r') as f:
    seeder = f.read()

if 'import "../../features/business/liquidacion/liquidacion.model";' not in seeder:
    seeder = seeder.replace('import "../../features/business/calificacion/calificacion.model";', 'import "../../features/business/calificacion/calificacion.model";\nimport "../../features/business/liquidacion/liquidacion.model";')

with open(seeder_path, 'w') as f:
    f.write(seeder)

print("Patched successfully")
