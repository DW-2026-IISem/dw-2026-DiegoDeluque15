export const tripSwagger = {
  tags: [{ name: "Trips", description: "Ciclo de vida de carreras / trips (máquina de estados)" }],
  paths: {
    "/api/carreras": {
      get: {
        tags: ["Trips"],
        summary: "Listar todas las carreras (trips)",
        responses: { "200": { description: "Lista de carreras" } }
      },
      post: {
        tags: ["Trips"],
        summary: "Crear carrera (siempre en estado 'solicitada')",
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/TripCreate" } } } },
        responses: {
          "201": { description: "Carrera creada en estado solicitada" },
          "400": { description: "FKs faltantes o turno/tarifa inactivos" },
          "404": { description: "passenger/shift/fare no encontrado" }
        }
      }
    },
    "/api/carreras/{id}": {
      get: {
        tags: ["Trips"],
        summary: "Obtener carrera por ID",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: { "200": { description: "Encontrada" }, "404": { description: "No encontrada" } }
      },
      patch: {
        tags: ["Trips"],
        summary: "Editar notas/observaciones (NO cambia estado/total/fechas)",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/TripPatch" } } } },
        responses: { "200": { description: "Actualizada" }, "404": { description: "No encontrada" } }
      },
      delete: {
        tags: ["Trips"],
        summary: "Eliminar física (usar /estado con 'cancelada' como flujo normal)",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: { "200": { description: "Eliminada" }, "404": { description: "No encontrada" } }
      }
    },
    "/api/carreras/{id}/estado": {
      patch: {
        tags: ["Trips"],
        summary: "Cambiar estado (única vía). Transiciones: solicitada→aceptada, aceptada→en_curso, en_curso→cerrada, {sol|acep|en_curso}→cancelada",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/TripStatusBody" } } } },
        responses: {
          "200": { description: "Estado cambiado. Si cerrada: ended_at y total quedan seteados" },
          "404": { description: "No encontrada" },
          "409": { description: "Transición inválida" }
        }
      }
    }
  },
  components: {
    schemas: {
      Trip: {
        type: "object",
        properties: {
          id: { type: "integer" },
          passenger_id: { type: "integer" },
          shift_id: { type: "integer" },
          fare_id: { type: "integer" },
          started_at: { type: "string", format: "date-time" },
          ended_at: { type: "string", format: "date-time", nullable: true },
          total: { type: "number", nullable: true, description: "Calculado al cerrar (= fare.base_value)" },
          status: { type: "string", enum: ["solicitada", "aceptada", "en_curso", "cerrada", "cancelada"] },
          notes: { type: "string", nullable: true },
          settlement_id: { type: "integer", nullable: true }
        }
      },
      TripCreate: {
        type: "object",
        required: ["passenger_id", "shift_id", "fare_id"],
        properties: {
          passenger_id: { type: "integer" },
          shift_id: { type: "integer" },
          fare_id: { type: "integer" },
          notes: { type: "string" }
        }
      },
      TripPatch: {
        type: "object",
        properties: { notes: { type: "string" } }
      },
      TripStatusBody: {
        type: "object",
        required: ["status"],
        properties: {
          status: { type: "string", enum: ["aceptada", "en_curso", "cerrada", "cancelada"] }
        }
      }
    }
  }
};
