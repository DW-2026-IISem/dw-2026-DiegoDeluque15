/**
 * Documentacion OpenAPI del feature Conductor.
 * Se agrega desde `src/swagger` (registry externo), no se monta aqui.
 *
 * Leyenda: endpoints documentados como SIN AUTH (sin middleware JWT).
 */

export const conductorSwagger = {
  tags: [
    {
      name: "Conductores",
      description: "CRUD de conductores — **SIN AUTH** (sin middleware JWT)",
    },
  ],
  paths: {
    "/api/conductores": {
      get: {
        tags: ["Conductores"],
        summary: "Listar conductores activos",
        description: "SIN AUTH — retorna conductores con status=active, incluye empresa anidada",
        security: [],
        responses: {
          "200": {
            description: "Lista de conductores",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    conductores: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Conductor" },
                    },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Conductores"],
        summary: "Crear conductor",
        description: "SIN AUTH — si se envia empresa_id, la empresa debe existir y ser active (404/400 si no)",
        security: [],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ConductorCreate" },
            },
          },
        },
        responses: {
          "201": {
            description: "Conductor creado",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    conductor: { $ref: "#/components/schemas/Conductor" },
                  },
                },
              },
            },
          },
          "400": { description: "empresa_id referencia empresa inactive" },
          "404": { description: "empresa_id no encontrado" },
        },
      },
    },
    "/api/conductores/{id}": {
      get: {
        tags: ["Conductores"],
        summary: "Obtener conductor por id",
        description: "SIN AUTH — incluye empresa anidada",
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
            description: "Conductor encontrado",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    conductor: { $ref: "#/components/schemas/Conductor" },
                  },
                },
              },
            },
          },
          "404": { description: "No encontrado" },
        },
      },
      put: {
        tags: ["Conductores"],
        summary: "Actualizar conductor (PUT — reemplazo)",
        description: "SIN AUTH — valida empresa_id si se envía",
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
              schema: { $ref: "#/components/schemas/ConductorUpdate" },
            },
          },
        },
        responses: {
          "200": { description: "Actualizado" },
          "400": { description: "empresa_id referencia empresa inactive" },
          "404": { description: "Conductor o empresa no encontrado" },
        },
      },
      patch: {
        tags: ["Conductores"],
        summary: "Actualizar conductor (PATCH — parcial)",
        description: "SIN AUTH — valida empresa_id si se envía",
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
              schema: { $ref: "#/components/schemas/ConductorPatch" },
            },
          },
        },
        responses: {
          "200": { description: "Actualizado" },
          "400": { description: "empresa_id referencia empresa inactive" },
          "404": { description: "Conductor o empresa no encontrado" },
        },
      },
      delete: {
        tags: ["Conductores"],
        summary: "Eliminar conductor (fisico)",
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
    "/api/conductores/{id}/deactivate": {
      patch: {
        tags: ["Conductores"],
        summary: "Eliminar conductor (logico)",
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
      Conductor: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          nombre: { type: "string", example: "Carlos Martinez" },
          descripcion: { type: "string", example: "Conductor experimentado", nullable: true },
          empresa_id: { type: "integer", example: 1, nullable: true },
          status: { type: "string", enum: ["active", "inactive"], example: "active" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
          empresa: {
            nullable: true,
            allOf: [{ $ref: "#/components/schemas/EmpresaResumen" }],
          },
        },
      },
      EmpresaResumen: {
        type: "object",
        properties: {
          id: { type: "integer" },
          nit: { type: "string" },
          razon_social: { type: "string" },
        },
      },
      ConductorCreate: {
        type: "object",
        required: ["nombre"],
        properties: {
          nombre: { type: "string", minLength: 2 },
          descripcion: { type: "string" },
          empresa_id: { type: "integer", nullable: true },
          status: { type: "string", enum: ["active", "inactive"], default: "active" },
        },
      },
      ConductorUpdate: {
        type: "object",
        required: ["nombre"],
        properties: {
          nombre: { type: "string", minLength: 2 },
          descripcion: { type: "string" },
          empresa_id: { type: "integer", nullable: true },
          status: { type: "string", enum: ["active", "inactive"] },
        },
      },
      ConductorPatch: {
        type: "object",
        properties: {
          nombre: { type: "string", minLength: 2 },
          descripcion: { type: "string" },
          empresa_id: { type: "integer", nullable: true },
          status: { type: "string", enum: ["active", "inactive"] },
        },
      },
    },
  },
};
