/**
 * OpenAPI documentation for the Company feature.
 * Added from `src/swagger` (external registry), not mounted here.
 */

export const companySwagger = {
  tags: [
    {
      name: "Companies",
      description: "CRUD de empresas — **SIN AUTH** (sin middleware JWT)",
    },
  ],
  paths: {
    "/api/empresas": {
      get: {
        tags: ["Companies"],
        summary: "Listar empresas activas",
        description: "SIN AUTH — retorna empresas con status=active",
        security: [],
        responses: {
          "200": {
            description: "Lista de empresas",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    companies: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Company" },
                    },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Companies"],
        summary: "Crear empresa",
        description: "SIN AUTH — tax_id debe ser unico (409 si ya existe)",
        security: [],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CompanyCreate" },
            },
          },
        },
        responses: {
          "201": {
            description: "Empresa creada",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    company: { $ref: "#/components/schemas/Company" },
                  },
                },
              },
            },
          },
          "409": { description: "tax_id duplicado" },
        },
      },
    },
    "/api/empresas/{id}": {
      get: {
        tags: ["Companies"],
        summary: "Obtener empresa por id",
        description: "SIN AUTH",
        security: [],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "integer" } },
        ],
        responses: {
          "200": {
            description: "Empresa encontrada",
            content: {
              "application/json": {
                schema: { type: "object", properties: { company: { $ref: "#/components/schemas/Company" } } },
              },
            },
          },
          "404": { description: "No encontrada" },
        },
      },
      put: {
        tags: ["Companies"],
        summary: "Actualizar empresa (PUT — reemplazo)",
        description: "SIN AUTH — valida tax_id unico (409 si duplicado)",
        security: [],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/CompanyUpdate" } } } },
        responses: { "200": { description: "Actualizada" }, "404": { description: "No encontrada" }, "409": { description: "tax_id duplicado" } },
      },
      patch: {
        tags: ["Companies"],
        summary: "Actualizar empresa (PATCH — parcial)",
        description: "SIN AUTH — valida tax_id unico (409 si duplicado)",
        security: [],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/CompanyPatch" } } } },
        responses: { "200": { description: "Actualizada" }, "404": { description: "No encontrada" }, "409": { description: "tax_id duplicado" } },
      },
      delete: {
        tags: ["Companies"],
        summary: "Eliminar empresa (fisico)",
        description: "SIN AUTH — borra la fila",
        security: [],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: { "200": { description: "Eliminada" }, "404": { description: "No encontrada" } },
      },
    },
    "/api/empresas/{id}/deactivate": {
      patch: {
        tags: ["Companies"],
        summary: "Eliminar empresa (logico)",
        description: "SIN AUTH — status = inactive",
        security: [],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: { "200": { description: "Desactivada" }, "404": { description: "No encontrada" } },
      },
    },
  },
  components: {
    schemas: {
      Company: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          tax_id: { type: "string", example: "900123456-1" },
          legal_name: { type: "string", example: "TransMovil S.A.S" },
          primary_contact: { type: "string", example: "Juan Perez", nullable: true },
          status: { type: "string", enum: ["active", "inactive"], example: "active" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      CompanyCreate: {
        type: "object",
        required: ["tax_id", "legal_name"],
        properties: {
          tax_id: { type: "string" },
          legal_name: { type: "string" },
          primary_contact: { type: "string" },
          status: { type: "string", enum: ["active", "inactive"], default: "active" },
        },
      },
      CompanyUpdate: {
        type: "object",
        required: ["tax_id", "legal_name"],
        properties: {
          tax_id: { type: "string" },
          legal_name: { type: "string" },
          primary_contact: { type: "string" },
          status: { type: "string", enum: ["active", "inactive"] },
        },
      },
      CompanyPatch: {
        type: "object",
        properties: {
          tax_id: { type: "string" },
          legal_name: { type: "string" },
          primary_contact: { type: "string" },
          status: { type: "string", enum: ["active", "inactive"] },
        },
      },
    },
  },
};
