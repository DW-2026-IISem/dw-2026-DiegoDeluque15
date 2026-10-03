export const vehiculoSwagger = {
  tags: [
    {
      name: "Vehiculos",
      description: "CRUD de vehiculos — SIN AUTH",
    },
  ],
  paths: {
    "/api/vehiculos": {
      get: {
        tags: ["Vehiculos"],
        summary: "Listar vehiculos activos",
        description: "Retorna vehiculos con status=active, incluye empresa y tipo anidados",
        security: [],
        responses: {
          "200": {
            description: "Lista de vehiculos",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    vehiculos: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Vehiculo" },
                    },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Vehiculos"],
        summary: "Crear vehiculo",
        description: "empresa_id es obligatoria (404 si no existe, 400 si inactive). tipo_vehiculo_id es opcional (404 si no existe).",
        security: [],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/VehiculoCreate" },
            },
          },
        },
        responses: {
          "201": { description: "Vehiculo creado" },
          "400": { description: "empresa_id faltante o empresa inactive" },
          "404": { description: "empresa_id o tipo_vehiculo_id no encontrado" },
        },
      },
    },
    "/api/vehiculos/{id}": {
      get: {
        tags: ["Vehiculos"],
        summary: "Obtener vehiculo por id",
        security: [],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          "200": { description: "Vehiculo encontrado" },
          "404": { description: "No encontrado" },
        },
      },
      put: {
        tags: ["Vehiculos"],
        summary: "Actualizar vehiculo (PUT)",
        security: [],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": { schema: { $ref: "#/components/schemas/VehiculoUpdate" } },
          },
        },
        responses: {
          "200": { description: "Actualizado" },
          "400": { description: "empresa_id faltante o inactive" },
          "404": { description: "No encontrado" },
        },
      },
      patch: {
        tags: ["Vehiculos"],
        summary: "Actualizar vehiculo (PATCH)",
        security: [],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": { schema: { $ref: "#/components/schemas/VehiculoPatch" } },
          },
        },
        responses: {
          "200": { description: "Actualizado" },
          "400": { description: "empresa_id inactive" },
          "404": { description: "No encontrado" },
        },
      },
      delete: {
        tags: ["Vehiculos"],
        summary: "Eliminar vehiculo (fisico)",
        security: [],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          "200": { description: "Eliminado" },
          "404": { description: "No encontrado" },
        },
      },
    },
    "/api/vehiculos/{id}/deactivate": {
      patch: {
        tags: ["Vehiculos"],
        summary: "Eliminar vehiculo (logico)",
        security: [],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          "200": { description: "Desactivado" },
          "404": { description: "No encontrado" },
        },
      },
    },
  },
  components: {
    schemas: {
      Vehiculo: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          nombre: { type: "string", example: "Toyota Fortuner" },
          descripcion: { type: "string", nullable: true },
          empresa_id: { type: "integer", example: 1 },
          tipo_vehiculo_id: { type: "integer", nullable: true },
          status: { type: "string", enum: ["active", "inactive"] },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      VehiculoCreate: {
        type: "object",
        required: ["nombre", "empresa_id"],
        properties: {
          nombre: { type: "string" },
          descripcion: { type: "string" },
          empresa_id: { type: "integer" },
          tipo_vehiculo_id: { type: "integer", nullable: true },
          status: { type: "string", enum: ["active", "inactive"], default: "active" },
        },
      },
      VehiculoUpdate: {
        type: "object",
        required: ["nombre", "empresa_id"],
        properties: {
          nombre: { type: "string" },
          descripcion: { type: "string" },
          empresa_id: { type: "integer" },
          tipo_vehiculo_id: { type: "integer", nullable: true },
          status: { type: "string", enum: ["active", "inactive"] },
        },
      },
      VehiculoPatch: {
        type: "object",
        properties: {
          nombre: { type: "string" },
          descripcion: { type: "string" },
          empresa_id: { type: "integer" },
          tipo_vehiculo_id: { type: "integer", nullable: true },
          status: { type: "string", enum: ["active", "inactive"] },
        },
      },
    },
  },
};
