export const shiftSwagger = {
  tags: [{ name: "Shifts", description: "CRUD de turnos" }],
  paths: {
    "/api/turnos": {
      get: {
        tags: ["Shifts"],
        summary: "Listar turnos activos",
        responses: {
          "200": {
            description: "Lista de turnos",
            content: { "application/json": { schema: { type: "object", properties: { shifts: { type: "array", items: { $ref: "#/components/schemas/Shift" } } } } } },
          },
        },
      },
      post: {
        tags: ["Shifts"],
        summary: "Crear turno",
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/ShiftCreate" } } } },
        responses: {
          "201": { description: "Turno creado" },
          "400": { description: "FKs faltantes o inactivos" },
          "404": { description: "FKs no encontrados" },
          "409": { description: "Conflicto: driver o vehicle ya en turno activo" },
        },
      },
    },
    "/api/turnos/{id}": {
      get: {
        tags: ["Shifts"],
        summary: "Obtener turno",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: { "200": { description: "Turno encontrado" }, "404": { description: "No encontrado" } },
      },
      put: {
        tags: ["Shifts"],
        summary: "Actualizar turno (PUT)",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/ShiftUpdate" } } } },
        responses: { "200": { description: "Actualizado" }, "400": { description: "FKs inactivos" }, "404": { description: "No encontrado" }, "409": { description: "Conflicto" } },
      },
      patch: {
        tags: ["Shifts"],
        summary: "Actualizar turno (PATCH)",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/ShiftPatch" } } } },
        responses: { "200": { description: "Actualizado" }, "400": { description: "FKs inactivos" }, "404": { description: "No encontrado" }, "409": { description: "Conflicto" } },
      },
      delete: {
        tags: ["Shifts"],
        summary: "Eliminar turno fisico",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: { "200": { description: "Eliminado" }, "404": { description: "No encontrado" } },
      },
    },
    "/api/turnos/{id}/deactivate": {
      patch: {
        tags: ["Shifts"],
        summary: "Desactivar turno (libera driver y vehicle)",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: { "200": { description: "Desactivado" }, "404": { description: "No encontrado" } },
      },
    },
  },
  components: {
    schemas: {
      Shift: {
        type: "object",
        properties: {
          id: { type: "integer" },
          name: { type: "string" },
          description: { type: "string", nullable: true },
          driver_id: { type: "integer" },
          vehicle_id: { type: "integer" },
          status: { type: "string", enum: ["active", "inactive"] },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      ShiftCreate: {
        type: "object",
        required: ["name", "driver_id", "vehicle_id"],
        properties: {
          name: { type: "string" },
          description: { type: "string" },
          driver_id: { type: "integer" },
          vehicle_id: { type: "integer" },
          status: { type: "string", enum: ["active", "inactive"], default: "active" },
        },
      },
      ShiftUpdate: {
        type: "object",
        required: ["name", "driver_id", "vehicle_id"],
        properties: {
          name: { type: "string" },
          description: { type: "string" },
          driver_id: { type: "integer" },
          vehicle_id: { type: "integer" },
          status: { type: "string", enum: ["active", "inactive"] },
        },
      },
      ShiftPatch: {
        type: "object",
        properties: {
          name: { type: "string" },
          description: { type: "string" },
          driver_id: { type: "integer" },
          vehicle_id: { type: "integer" },
          status: { type: "string", enum: ["active", "inactive"] },
        },
      },
    },
  },
};
