export const vehicleSwagger = {
  tags: [{ name: "Vehicles", description: "CRUD de vehiculos — SIN AUTH" }],
  paths: {
    "/api/vehiculos": {
      get: {
        tags: ["Vehicles"],
        summary: "Listar vehiculos activos",
        description: "Retorna vehiculos con status=active, incluye company y vehicle_type anidados",
        security: [],
        responses: {
          "200": {
            description: "Lista de vehiculos",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    vehicles: { type: "array", items: { $ref: "#/components/schemas/Vehicle" } },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Vehicles"],
        summary: "Crear vehiculo",
        description: "company_id es obligatoria. vehicle_type_id es opcional.",
        security: [],
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/VehicleCreate" } } } },
        responses: {
          "201": { description: "Vehiculo creado" },
          "400": { description: "company_id faltante o company inactive" },
          "404": { description: "company_id o vehicle_type_id no encontrado" },
        },
      },
    },
    "/api/vehiculos/{id}": {
      get: {
        tags: ["Vehicles"],
        summary: "Obtener vehiculo por id",
        security: [],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: { "200": { description: "Encontrado" }, "404": { description: "No encontrado" } },
      },
      put: {
        tags: ["Vehicles"],
        summary: "Actualizar vehiculo (PUT)",
        security: [],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/VehicleUpdate" } } } },
        responses: { "200": { description: "Actualizado" }, "400": { description: "company inactive" }, "404": { description: "No encontrado" } },
      },
      patch: {
        tags: ["Vehicles"],
        summary: "Actualizar vehiculo (PATCH)",
        security: [],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/VehiclePatch" } } } },
        responses: { "200": { description: "Actualizado" }, "400": { description: "company inactive" }, "404": { description: "No encontrado" } },
      },
      delete: {
        tags: ["Vehicles"],
        summary: "Eliminar vehiculo (fisico)",
        security: [],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: { "200": { description: "Eliminado" }, "404": { description: "No encontrado" } },
      },
    },
    "/api/vehiculos/{id}/deactivate": {
      patch: {
        tags: ["Vehicles"],
        summary: "Desactivar vehiculo (logico)",
        security: [],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: { "200": { description: "Desactivado" }, "404": { description: "No encontrado" } },
      },
    },
  },
  components: {
    schemas: {
      Vehicle: {
        type: "object",
        properties: {
          id: { type: "integer" },
          name: { type: "string", example: "Toyota Fortuner" },
          description: { type: "string", nullable: true },
          company_id: { type: "integer" },
          vehicle_type_id: { type: "integer", nullable: true },
          status: { type: "string", enum: ["active", "inactive"] },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      VehicleCreate: {
        type: "object",
        required: ["name", "company_id"],
        properties: {
          name: { type: "string" },
          description: { type: "string" },
          company_id: { type: "integer" },
          vehicle_type_id: { type: "integer", nullable: true },
          status: { type: "string", enum: ["active", "inactive"], default: "active" },
        },
      },
      VehicleUpdate: {
        type: "object",
        required: ["name", "company_id"],
        properties: {
          name: { type: "string" },
          description: { type: "string" },
          company_id: { type: "integer" },
          vehicle_type_id: { type: "integer", nullable: true },
          status: { type: "string", enum: ["active", "inactive"] },
        },
      },
      VehiclePatch: {
        type: "object",
        properties: {
          name: { type: "string" },
          description: { type: "string" },
          company_id: { type: "integer" },
          vehicle_type_id: { type: "integer", nullable: true },
          status: { type: "string", enum: ["active", "inactive"] },
        },
      },
    },
  },
};
