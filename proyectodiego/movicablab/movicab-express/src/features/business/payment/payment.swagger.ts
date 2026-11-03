export const paymentSwagger = {
  tags: [{ name: "Payments", description: "Registro de pagos (INMUTABLE — sin update ni delete)" }],
  paths: {
    "/api/pagos": {
      get: {
        tags: ["Payments"],
        summary: "Listar todos los pagos",
        responses: { "200": { description: "Lista de pagos" } }
      },
      post: {
        tags: ["Payments"],
        summary: "Registrar pago (monto siempre viene de Trip.total, no del body)",
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/PaymentCreate" } } } },
        responses: {
          "201": { description: "Pago registrado" },
          "400": { description: "Faltan campos requeridos (reference_id, payment_method)" },
          "404": { description: "Trip no encontrada" },
          "409": { description: "Trip no está en estado 'cerrada'" }
        }
      }
    },
    "/api/pagos/{id}": {
      get: {
        tags: ["Payments"],
        summary: "Obtener pago por ID",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: { "200": { description: "Pago encontrado" }, "404": { description: "No encontrado" } }
      }
    }
  },
  components: {
    schemas: {
      Payment: {
        type: "object",
        properties: {
          id: { type: "integer" },
          reference_type: { type: "string", example: "carrera" },
          reference_id: { type: "integer", description: "ID de la Carrera/Trip" },
          payment_method: { type: "string", example: "efectivo" },
          amount: { type: "number", description: "Copiado de Trip.total en el servidor" },
          paid_at: { type: "string", format: "date-time" },
          status: { type: "string", example: "registrado" }
        }
      },
      PaymentCreate: {
        type: "object",
        required: ["reference_id", "payment_method"],
        properties: {
          reference_id: { type: "integer", description: "ID de la Trip cerrada" },
          payment_method: { type: "string", enum: ["efectivo", "tarjeta", "transferencia", "nequi"] }
        }
      }
    }
  }
};
