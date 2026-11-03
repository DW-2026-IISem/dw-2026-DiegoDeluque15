export const settlementSwagger = {
  tags: [{ name: "Settlements", description: "Proceso transaccional de liquidación a conductores" }],
  paths: {
    "/api/liquidaciones": {
      get: {
        tags: ["Settlements"],
        summary: "Listar todas las liquidaciones",
        responses: { "200": { description: "Lista" } }
      },
      post: {
        tags: ["Settlements"],
        summary: "Generar liquidación transaccional",
        description: "Agrupa trips cerradas sin liquidar de un driver en un rango de fechas. Calcula el total y setea la FK settlement_id en todas esas trips de manera atómica.",
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/SettlementCreate" } } } },
        responses: {
          "201": { description: "Liquidación generada exitosamente y trips vinculadas" },
          "400": { description: "Parámetros faltantes, o no hay nada que liquidar" },
          "404": { description: "Driver inexistente" }
        }
      }
    },
    "/api/liquidaciones/{id}": {
      get: {
        tags: ["Settlements"],
        summary: "Obtener por ID (incluye detalle de trips)",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: { "200": { description: "Encontrada" }, "404": { description: "No encontrada" } }
      }
    }
  },
  components: {
    schemas: {
      Settlement: {
        type: "object",
        properties: {
          id: { type: "integer" },
          driver_id: { type: "integer" },
          date_from: { type: "string", format: "date-time" },
          date_to: { type: "string", format: "date-time" },
          generated_at: { type: "string", format: "date-time" },
          total_amount: { type: "number" },
          status: { type: "string" },
          notes: { type: "string" }
        }
      },
      SettlementCreate: {
        type: "object",
        required: ["driver_id", "date_from", "date_to"],
        properties: {
          driver_id: { type: "integer" },
          date_from: { type: "string", format: "date-time" },
          date_to: { type: "string", format: "date-time" },
          notes: { type: "string" }
        }
      }
    }
  }
};
