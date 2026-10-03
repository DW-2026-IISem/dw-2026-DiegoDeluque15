/**
 * Documentacion OpenAPI del feature Empresa.
 * Se agrega desde `src/swagger` (registry externo), no se monta aqui.
 *
 * Leyenda: endpoints documentados como SIN AUTH (sin middleware JWT).
 */

export const empresaSwagger = {
  tags: [
    {
      name: "Empresas",
      description: "CRUD de empresas — **SIN AUTH** (sin middleware JWT)",
    },
  ],
  paths: {
    "/api/empresas": {
      get: {
        tags: ["Empresas"],
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
                    empresas: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Empresa" },
                    },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Empresas"],
        summary: "Crear empresa",
        description: "SIN AUTH — nit debe ser unico (409 si ya existe)",
        security: [],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/EmpresaCreate" },
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
                    empresa: { $ref: "#/components/schemas/Empresa" },
                  },
                },
              },
            },
          },
          "409": { description: "NIT duplicado" },
        },
      },
    },
    "/api/empresas/{id}": {
      get: {
        tags: ["Empresas"],
        summary: "Obtener empresa por id",
        description: "SIN AUTH",
        security: [],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: {
          "200": {
            description: "Empresa encontrada",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    empresa: { $ref: "#/components/schemas/Empresa" },
                  },
                },
              },
            },
          },
          "404": { description: "No encontrada" },
        },
      },
      put: {
        tags: ["Empresas"],
        summary: "Actualizar empresa (PUT — reemplazo)",
        description: "SIN AUTH — valida nit unico (409 si duplicado)",
        security: [],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/EmpresaUpdate" },
            },
          },
        },
        responses: {
          "200": { description: "Actualizada" },
          "404": { description: "No encontrada" },
          "409": { description: "NIT duplicado" },
        },
      },
      patch: {
        tags: ["Empresas"],
        summary: "Actualizar empresa (PATCH — parcial)",
        description: "SIN AUTH — valida nit unico (409 si duplicado)",
        security: [],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/EmpresaPatch" },
            },
          },
        },
        responses: {
          "200": { description: "Actualizada" },
          "404": { description: "No encontrada" },
          "409": { description: "NIT duplicado" },
        },
      },
      delete: {
        tags: ["Empresas"],
        summary: "Eliminar empresa (fisico)",
        description: "SIN AUTH — borra la fila",
        security: [],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: {
          "200": { description: "Eliminada" },
          "404": { description: "No encontrada" },
        },
      },
    },
    "/api/empresas/{id}/deactivate": {
      patch: {
        tags: ["Empresas"],
        summary: "Eliminar empresa (logico)",
        description: "SIN AUTH — status = inactive",
        security: [],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: {
          "200": { description: "Desactivada" },
          "404": { description: "No encontrada" },
        },
      },
    },
  },
  components: {
    schemas: {
      Empresa: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          nit: { type: "string", example: "900123456-1" },
          razon_social: { type: "string", example: "TransMovil S.A.S" },
          contacto_principal: { type: "string", example: "Juan Perez", nullable: true },
          status: { type: "string", enum: ["active", "inactive"], example: "active" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      EmpresaCreate: {
        type: "object",
        required: ["nit", "razon_social"],
        properties: {
          nit: { type: "string" },
          razon_social: { type: "string" },
          contacto_principal: { type: "string" },
          status: { type: "string", enum: ["active", "inactive"], default: "active" },
        },
      },
      EmpresaUpdate: {
        type: "object",
        required: ["nit", "razon_social"],
        properties: {
          nit: { type: "string" },
          razon_social: { type: "string" },
          contacto_principal: { type: "string" },
          status: { type: "string", enum: ["active", "inactive"] },
        },
      },
      EmpresaPatch: {
        type: "object",
        properties: {
          nit: { type: "string" },
          razon_social: { type: "string" },
          contacto_principal: { type: "string" },
          status: { type: "string", enum: ["active", "inactive"] },
        },
      },
    },
  },
};
