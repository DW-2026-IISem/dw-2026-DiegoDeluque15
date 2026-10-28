export const vehicleTypeSwagger = {
  tags: [
    {
      name: "VehicleTypes",
      description: "CRUD de tipos de vehiculo",
    },
  ],
  paths: {
    "/api/tipos-vehiculo": {
      get: {
        tags: ["VehicleTypes"],
        summary: "Listar tipos de vehiculo activos",
        security: [],
        responses: {
          "200": {
            description: "Lista de tipos de vehiculo",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    vehicle_types: {
                      type: "array",
                      items: { $ref: "#/components/schemas/VehicleType" },
                    },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["VehicleTypes"],
        summary: "Crear tipo de vehiculo",
        security: [],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/VehicleTypeCreate" } } },
        },
        responses: { "201": { description: "Creado" } },
      },
    },
    "/api/tipos-vehiculo/{id}": {
      get: {
        tags: ["VehicleTypes"],
        summary: "Obtener tipo de vehiculo por id",
        security: [],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: { "200": { description: "Encontrado" }, "404": { description: "No encontrado" } },
      },
      put: {
        tags: ["VehicleTypes"],
        summary: "Actualizar tipo de vehiculo (PUT)",
        security: [],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/VehicleTypeUpdate" } } } },
        responses: { "200": { description: "Actualizado" }, "404": { description: "No encontrado" } },
      },
      patch: {
        tags: ["VehicleTypes"],
        summary: "Actualizar tipo de vehiculo (PATCH)",
        security: [],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/VehicleTypePatch" } } } },
        responses: { "200": { description: "Actualizado" }, "404": { description: "No encontrado" } },
      },
      delete: {
        tags: ["VehicleTypes"],
        summary: "Eliminar tipo de vehiculo (fisico)",
        security: [],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: { "200": { description: "Eliminado" }, "404": { description: "No encontrado" } },
      },
    },
    "/api/tipos-vehiculo/{id}/deactivate": {
      patch: {
        tags: ["VehicleTypes"],
        summary: "Desactivar tipo de vehiculo (logico)",
        security: [],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: { "200": { description: "Desactivado" }, "404": { description: "No encontrado" } },
      },
    },
  },
  components: {
    schemas: {
      VehicleType: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          name: { type: "string", example: "SUV" },
          description: { type: "string", nullable: true },
          status: { type: "string", enum: ["active", "inactive"] },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      VehicleTypeCreate: {
        type: "object",
        required: ["name"],
        properties: {
          name: { type: "string" },
          description: { type: "string" },
          status: { type: "string", enum: ["active", "inactive"], default: "inactive" },
        },
      },
      VehicleTypeUpdate: {
        type: "object",
        required: ["name"],
        properties: {
          name: { type: "string" },
          description: { type: "string" },
          status: { type: "string", enum: ["active", "inactive"] },
        },
      },
      VehicleTypePatch: {
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
