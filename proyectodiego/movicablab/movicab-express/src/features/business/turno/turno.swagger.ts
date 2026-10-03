export const turnoSwagger = {
  tags: [{ name: "Turnos", description: "CRUD de turnos" }],
  paths: {
    "/api/turnos": {
      get: {
        tags: ["Turnos"],
        summary: "Listar turnos activos",
        responses: {
          "200": {
            description: "Lista de turnos",
            content: { "application/json": { schema: { type: "object", properties: { turnos: { type: "array", items: { $ref: "#/components/schemas/Turno" } } } } } }
          }
        }
      },
      post: {
        tags: ["Turnos"],
        summary: "Crear turno",
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/TurnoCreate" } } } },
        responses: {
          "201": { description: "Turno creado" },
          "400": { description: "FKs faltantes o inactivos" },
          "404": { description: "FKs no encontrados" },
          "409": { description: "Conflicto: Conductor o vehiculo ya estan en un turno activo" }
        }
      }
    },
    "/api/turnos/{id}": {
      get: {
        tags: ["Turnos"],
        summary: "Obtener turno",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: { "200": { description: "Turno encontrado" }, "404": { description: "No encontrado" } }
      },
      put: {
        tags: ["Turnos"],
        summary: "Actualizar turno (PUT)",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/TurnoUpdate" } } } },
        responses: {
          "200": { description: "Actualizado" },
          "400": { description: "FKs faltantes o inactivos" },
          "404": { description: "No encontrado" },
          "409": { description: "Conflicto" }
        }
      },
      patch: {
        tags: ["Turnos"],
        summary: "Actualizar turno (PATCH)",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/TurnoPatch" } } } },
        responses: {
          "200": { description: "Actualizado" },
          "400": { description: "FKs inactivos" },
          "404": { description: "No encontrado" },
          "409": { description: "Conflicto" }
        }
      },
      delete: {
        tags: ["Turnos"],
        summary: "Eliminar turno fisico",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: { "200": { description: "Eliminado" }, "404": { description: "No encontrado" } }
      }
    },
    "/api/turnos/{id}/deactivate": {
      patch: {
        tags: ["Turnos"],
        summary: "Desactivar turno logico (libera al conductor y vehiculo)",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: { "200": { description: "Desactivado" }, "404": { description: "No encontrado" } }
      }
    }
  },
  components: {
    schemas: {
      Turno: {
        type: "object",
        properties: {
          id: { type: "integer" },
          nombre: { type: "string" },
          descripcion: { type: "string", nullable: true },
          conductor_id: { type: "integer" },
          vehiculo_id: { type: "integer" },
          status: { type: "string", enum: ["active", "inactive"] },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" }
        }
      },
      TurnoCreate: {
        type: "object",
        required: ["nombre", "conductor_id", "vehiculo_id"],
        properties: {
          nombre: { type: "string" },
          descripcion: { type: "string" },
          conductor_id: { type: "integer" },
          vehiculo_id: { type: "integer" },
          status: { type: "string", enum: ["active", "inactive"], default: "active" }
        }
      },
      TurnoUpdate: {
        type: "object",
        required: ["nombre", "conductor_id", "vehiculo_id"],
        properties: {
          nombre: { type: "string" },
          descripcion: { type: "string" },
          conductor_id: { type: "integer" },
          vehiculo_id: { type: "integer" },
          status: { type: "string", enum: ["active", "inactive"] }
        }
      },
      TurnoPatch: {
        type: "object",
        properties: {
          nombre: { type: "string" },
          descripcion: { type: "string" },
          conductor_id: { type: "integer" },
          vehiculo_id: { type: "integer" },
          status: { type: "string", enum: ["active", "inactive"] }
        }
      }
    }
  }
};
