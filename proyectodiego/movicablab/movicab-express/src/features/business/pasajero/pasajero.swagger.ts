/**
 * Documentación OpenAPI del feature Pasajero.
 * Se agrega desde `src/swagger` (registry externo), no se monta aquí.
 *
 * Leyenda: endpoints documentados como SIN AUTH (sin middleware JWT).
 */

export const pasajeroSwagger = {
  tags: [
    {
      name: "Pasajeros",
      description: "CRUD de pasajeros — **SIN AUTH** (sin middleware JWT)",
    },
  ],
  paths: {
    "/api/pasajeros": {
      get: {
        tags: ["Pasajeros"],
        summary: "Listar pasajeros activos",
        description: "SIN AUTH — retorna pasajeros con status=active (sin password)",
        security: [],
        responses: {
          "200": {
            description: "Lista de pasajeros",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    pasajeros: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Pasajero" },
                    },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Pasajeros"],
        summary: "Crear pasajero",
        description: "SIN AUTH",
        security: [],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/PasajeroCreate" },
            },
          },
        },
        responses: {
          "201": {
            description: "Pasajero creado",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    pasajero: { $ref: "#/components/schemas/Pasajero" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/pasajeros/{id}": {
      get: {
        tags: ["Pasajeros"],
        summary: "Obtener pasajero por id",
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
            description: "Pasajero encontrado",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    pasajero: { $ref: "#/components/schemas/Pasajero" },
                  },
                },
              },
            },
          },
          "404": { description: "No encontrado" },
        },
      },
      put: {
        tags: ["Pasajeros"],
        summary: "Actualizar pasajero (PUT — reemplazo)",
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
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/PasajeroUpdate" },
            },
          },
        },
        responses: {
          "200": { description: "Actualizado" },
          "404": { description: "No encontrado" },
        },
      },
      patch: {
        tags: ["Pasajeros"],
        summary: "Actualizar pasajero (PATCH — parcial)",
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
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/PasajeroPatch" },
            },
          },
        },
        responses: {
          "200": { description: "Actualizado" },
          "404": { description: "No encontrado" },
        },
      },
      delete: {
        tags: ["Pasajeros"],
        summary: "Eliminar pasajero (físico)",
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
          "200": { description: "Eliminado" },
          "404": { description: "No encontrado" },
        },
      },
    },
    "/api/pasajeros/{id}/deactivate": {
      patch: {
        tags: ["Pasajeros"],
        summary: "Eliminar pasajero (lógico)",
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
          "200": { description: "Desactivado" },
          "404": { description: "No encontrado" },
        },
      },
    },
  },
  components: {
    schemas: {
      Pasajero: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          name: { type: "string", example: "Ana Pérez" },
          address: { type: "string", example: "Calle 10 #20-30" },
          phone: { type: "string", example: "3001234567" },
          email: { type: "string", format: "email", example: "ana@example.com" },
          status: { type: "string", enum: ["active", "inactive"], example: "active" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      PasajeroCreate: {
        type: "object",
        required: ["name", "phone", "email", "password"],
        properties: {
          name: { type: "string" },
          address: { type: "string" },
          phone: { type: "string" },
          email: { type: "string", format: "email" },
          password: { type: "string", format: "password" },
          status: { type: "string", enum: ["active", "inactive"], default: "active" },
        },
      },
      PasajeroUpdate: {
        type: "object",
        required: ["name", "phone", "email"],
        properties: {
          name: { type: "string" },
          address: { type: "string" },
          phone: { type: "string" },
          email: { type: "string", format: "email" },
          password: { type: "string", format: "password" },
          status: { type: "string", enum: ["active", "inactive"] },
        },
      },
      PasajeroPatch: {
        type: "object",
        properties: {
          name: { type: "string" },
          address: { type: "string" },
          phone: { type: "string" },
          email: { type: "string", format: "email" },
          password: { type: "string", format: "password" },
          status: { type: "string", enum: ["active", "inactive"] },
        },
      },
    },
  },
};
