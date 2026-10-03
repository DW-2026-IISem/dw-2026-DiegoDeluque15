export const liquidacionSwagger = {
  tags: [{ name: "Liquidaciones", description: "Proceso transaccional de liquidación a conductores" }],
  paths: {
    "/api/liquidaciones": {
      get: {
        tags: ["Liquidaciones"],
        summary: "Listar todas las liquidaciones",
        responses: { "200": { description: "Lista" } }
      },
      post: {
        tags: ["Liquidaciones"],
        summary: "Generar liquidación transaccional",
        description: "Agrupa carreras cerradas sin liquidar de un conductor en un rango de fechas. Calcula el total y setea la FK liquidacion_id en todas esas carreras de manera atómica (Transacción completa o rollback completo).",
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/LiquidacionCreate" } } } },
        responses: {
          "201": { description: "Liquidación generada exitosamente y carreras vinculadas" },
          "400": { description: "Parámetros faltantes, o no hay nada que liquidar en ese rango para el conductor" },
          "404": { description: "Conductor inexistente" }
        }
      }
    },
    "/api/liquidaciones/{id}": {
      get: {
        tags: ["Liquidaciones"],
        summary: "Obtener por ID (incluye detalle de carreras)",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: { "200": { description: "Encontrada" }, "404": { description: "No encontrada" } }
      }
    }
  },
  components: {
    schemas: {
      Liquidacion: {
        type: "object",
        properties: { id: { type: "integer" }, conductor_id: { type: "integer" }, fecha_desde: { type: "string", format: "date-time" }, fecha_hasta: { type: "string", format: "date-time" }, fecha: { type: "string", format: "date-time" }, valor: { type: "number" }, estado: { type: "string" }, observaciones: { type: "string" } }
      },
      LiquidacionCreate: {
        type: "object",
        required: ["conductor_id", "fecha_desde", "fecha_hasta"],
        properties: { conductor_id: { type: "integer" }, fecha_desde: { type: "string", format: "date-time" }, fecha_hasta: { type: "string", format: "date-time" }, observaciones: { type: "string" } }
      }
    }
  }
};
