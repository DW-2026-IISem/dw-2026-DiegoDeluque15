export const pagoSwagger = {
  tags: [{ name: "Pagos", description: "Registro de pagos (INMUTABLE — sin update ni delete)" }],
  paths: {
    "/api/pagos": {
      get: {
        tags: ["Pagos"],
        summary: "Listar todos los pagos",
        responses: { "200": { description: "Lista de pagos" } }
      },
      post: {
        tags: ["Pagos"],
        summary: "Registrar pago (monto siempre viene de Carrera.total, no del body)",
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/PagoCreate" } } } },
        responses: {
          "201": { description: "Pago registrado" },
          "400": { description: "Faltan campos requeridos (referencia_id, metodo)" },
          "404": { description: "Carrera no encontrada" },
          "409": { description: "Carrera no está en estado 'cerrada'" }
        }
      }
    },
    "/api/pagos/{id}": {
      get: {
        tags: ["Pagos"],
        summary: "Obtener pago por ID",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: { "200": { description: "Pago encontrado" }, "404": { description: "No encontrado" } }
      }
    }
  },
  components: {
    schemas: {
      Pago: {
        type: "object",
        properties: {
          id: { type: "integer" },
          referencia_tipo: { type: "string", example: "carrera" },
          referencia_id: { type: "integer", description: "ID de la Carrera (sin FK física — polimórfico)" },
          metodo: { type: "string", example: "efectivo" },
          monto: { type: "number", description: "Copiado de Carrera.total en el servidor" },
          fecha: { type: "string", format: "date-time" },
          estado: { type: "string", example: "registrado" }
        }
      },
      PagoCreate: {
        type: "object",
        required: ["referencia_id", "metodo"],
        properties: {
          referencia_id: { type: "integer", description: "ID de la Carrera cerrada" },
          metodo: { type: "string", enum: ["efectivo", "tarjeta", "transferencia", "nequi"] }
        }
      }
    }
  }
};
