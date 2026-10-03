/**
 * Documentación OpenAPI del feature TipoVehiculo.
 * Se agrega desde `src/swagger` (registry externo), no se monta aquí.
 *
 * Leyenda: endpoints documentados como SIN AUTH (sin middleware JWT).
 */

export const vehiculoTypeSwagger = {
  tags: [
    {
      name: "TiposVehiculo",
      description: "CRUD de tipos de vehiculo — **SIN AUTH** (sin middleware JWT)",
    },
  ],
  paths: {
    "/api/tipos-vehiculo": {
      get: {
        tags: ["TiposVehiculo"],
        summary: "Listar tipos de vehiculo activos",
        description: "SIN AUTH — retorna tipos con status=active",
        security: [],
        responses: {
          "200": {
            description: "Lista de tipos de vehiculo",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    tipos_vehiculo: {
                      type: "array",
                      items: { $ref: "#/components/schemas/TipoVehiculo" },
                    },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["TiposVehiculo"],
        summary: "Crear tipo de vehiculo",
        description: "SIN AUTH",
        security: [],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/TipoVehiculoCreate" },
            },
          },
        },
        responses: {
          "201": {
            description: "Tipo de vehiculo creado",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    tipo_vehiculo: { $ref: "#/components/schemas/TipoVehiculo" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/tipos-vehiculo/{id}": {
      get: {
        tags: ["TiposVehiculo"],
        summary: "Obtener tipo de vehiculo por id",
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
            description: "Tipo de vehiculo encontrado",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    tipo_vehiculo: { $ref: "#/components/schemas/TipoVehiculo" },
                  },
                },
              },
            },
          },
          "404": { description: "No encontrado" },
        },
      },
      put: {
        tags: ["TiposVehiculo"],
        summary: "Actualizar tipo de vehiculo (PUT — reemplazo)",
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
              schema: { $ref: "#/components/schemas/TipoVehiculoUpdate" },
            },
          },
        },
        responses: {
          "200": { description: "Actualizado" },
          "404": { description: "No encontrado" },
        },
      },
      patch: {
        tags: ["TiposVehiculo"],
        summary: "Actualizar tipo de vehiculo (PATCH — parcial)",
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
              schema: { $ref: "#/components/schemas/TipoVehiculoPatch" },
            },
          },
        },
        responses: {
          "200": { description: "Actualizado" },
          "404": { description: "No encontrado" },
        },
      },
      delete: {
        tags: ["TiposVehiculo"],
        summary: "Eliminar tipo de vehiculo (físico)",
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
    "/api/tipos-vehiculo/{id}/deactivate": {
      patch: {
        tags: ["TiposVehiculo"],
        summary: "Eliminar tipo de vehiculo (lógico)",
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
      TipoVehiculo: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          name: { type: "string", example: "Electrónica" },
          description: { type: "string", example: "Dispositivos y accesorios", nullable: true },
          status: { type: "string", enum: ["active", "inactive"], example: "active" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      TipoVehiculoCreate: {
        type: "object",
        required: ["name"],
        properties: {
          name: { type: "string" },
          description: { type: "string" },
          status: { type: "string", enum: ["active", "inactive"], default: "active" },
        },
      },
      TipoVehiculoUpdate: {
        type: "object",
        required: ["name"],
        properties: {
          name: { type: "string" },
          description: { type: "string" },
          status: { type: "string", enum: ["active", "inactive"] },
        },
      },
      TipoVehiculoPatch: {
        type: "object",
        properties: {
          name: { type: "string" },
          description: { type: "string" },
          status: { type: "string", enum: ["active", "inactive"] },
        },
      },
    },
  },
};
