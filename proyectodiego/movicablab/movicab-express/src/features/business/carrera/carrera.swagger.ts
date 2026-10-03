export const carreraSwagger = {
  tags: [{ name: "Carreras", description: "Ciclo de vida de carreras (máquina de estados)" }],
  paths: {
    "/api/carreras": {
      get: {
        tags: ["Carreras"],
        summary: "Listar todas las carreras",
        responses: { "200": { description: "Lista de carreras" } }
      },
      post: {
        tags: ["Carreras"],
        summary: "Crear carrera (siempre en estado 'solicitada')",
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/CarreraCreate" } } } },
        responses: {
          "201": { description: "Carrera creada en estado solicitada" },
          "400": { description: "FKs faltantes o turno/tarifa inactivos" },
          "404": { description: "pasajero/turno/tarifa no encontrado" }
        }
      }
    },
    "/api/carreras/{id}": {
      get: {
        tags: ["Carreras"],
        summary: "Obtener carrera por ID",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: { "200": { description: "Encontrada" }, "404": { description: "No encontrada" } }
      },
      patch: {
        tags: ["Carreras"],
        summary: "Editar observaciones (NO cambia estado/total/fechas)",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/CarreraPatch" } } } },
        responses: { "200": { description: "Actualizada" }, "404": { description: "No encontrada" } }
      },
      delete: {
        tags: ["Carreras"],
        summary: "Eliminar física (usar /estado con 'cancelada' como flujo normal)",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: { "200": { description: "Eliminada" }, "404": { description: "No encontrada" } }
      }
    },
    "/api/carreras/{id}/estado": {
      patch: {
        tags: ["Carreras"],
        summary: "Cambiar estado (única vía). Transiciones: solicitada→aceptada, aceptada→en_curso, en_curso→cerrada, {sol|acep|en_curso}→cancelada",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/CarreraEstadoBody" } } } },
        responses: {
          "200": { description: "Estado cambiado. Si cerrada: fecha_fin y total quedan seteados" },
          "404": { description: "No encontrada" },
          "409": { description: "Transición inválida (ej. cerrada→cualquier cosa, o saltarse pasos)" }
        }
      }
    }
  },
  components: {
    schemas: {
      Carrera: {
        type: "object",
        properties: {
          id: { type: "integer" },
          pasajero_id: { type: "integer" },
          turno_id: { type: "integer" },
          tarifa_id: { type: "integer" },
          fecha_inicio: { type: "string", format: "date-time" },
          fecha_fin: { type: "string", format: "date-time", nullable: true },
          total: { type: "number", nullable: true, description: "Calculado al cerrar (= tarifa.valor_base)" },
          estado: { type: "string", enum: ["solicitada", "aceptada", "en_curso", "cerrada", "cancelada"] },
          observaciones: { type: "string", nullable: true },
          liquidacion_id: { type: "integer", nullable: true, description: "FK activada en ISS-15" }
        }
      },
      CarreraCreate: {
        type: "object",
        required: ["pasajero_id", "turno_id", "tarifa_id"],
        properties: {
          pasajero_id: { type: "integer" },
          turno_id: { type: "integer" },
          tarifa_id: { type: "integer" },
          observaciones: { type: "string" }
        }
      },
      CarreraPatch: {
        type: "object",
        properties: { observaciones: { type: "string" } }
      },
      CarreraEstadoBody: {
        type: "object",
        required: ["estado"],
        properties: {
          estado: { type: "string", enum: ["aceptada", "en_curso", "cerrada", "cancelada"] }
        }
      }
    }
  }
};
