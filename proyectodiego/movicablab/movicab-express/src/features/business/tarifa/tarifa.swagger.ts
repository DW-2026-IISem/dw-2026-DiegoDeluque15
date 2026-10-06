export const tarifaSwagger = {
  tags: [{ name: "Tarifas", description: "CRUD de tarifas y validaciones de solape" }],
  paths: {
    "/api/tarifas/vigente": {
      get: {
        tags: ["Tarifas"],
        summary: "Obtener tarifa vigente actual",
        responses: {
          "200": { description: "Tarifa vigente encontrada" },
          "404": { description: "No hay tarifa vigente para la fecha actual" }
        }
      }
    },
    "/api/tarifas": {
      get: {
        tags: ["Tarifas"],
        summary: "Listar tarifas activas",
        responses: {
          "200": { description: "Lista de tarifas" }
        }
      },
      post: {
        tags: ["Tarifas"],
        summary: "Crear tarifa",
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/TarifaCreate" } } } },
        responses: {
          "201": { description: "Tarifa creada" },
          "400": { description: "Valor base <= 0 o fechas invalidas" },
          "409": { description: "Solape de vigencias activas detectado" }
        }
      }
    },
    "/api/tarifas/{id}": {
      get: {
        tags: ["Tarifas"],
        summary: "Obtener tarifa",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: { "200": { description: "Encontrada" }, "404": { description: "No encontrada" } }
      },
      put: {
        tags: ["Tarifas"],
        summary: "Actualizar (PUT)",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/TarifaUpdate" } } } },
        responses: { "200": { description: "Actualizada" }, "400": { description: "Datos invalidos" }, "404": { description: "No encontrada" }, "409": { description: "Solape" } }
      },
      patch: {
        tags: ["Tarifas"],
        summary: "Actualizar (PATCH)",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/TarifaPatch" } } } },
        responses: { "200": { description: "Actualizada" }, "400": { description: "Datos invalidos" }, "404": { description: "No encontrada" }, "409": { description: "Solape" } }
      },
      delete: {
        tags: ["Tarifas"],
        summary: "Eliminar fisica",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: { "200": { description: "Eliminada" }, "404": { description: "No encontrada" } }
      }
    },
    "/api/tarifas/{id}/deactivate": {
      patch: {
        tags: ["Tarifas"],
        summary: "Desactivar (Borrado Logico)",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: { "200": { description: "Desactivada" }, "404": { description: "No encontrada" } }
      }
    }
  },
  components: {
    schemas: {
      Tarifa: {
        type: "object",
        properties: {
          id: { type: "integer" },
          nombre: { type: "string" },
          regla_calculo: { type: "string" },
          valor_base: { type: "number" },
          vigencia_desde: { type: "string", format: "date-time" },
          vigencia_hasta: { type: "string", format: "date-time" },
          status: { type: "string" }
        }
      },
      TarifaCreate: {
        type: "object",
        required: ["nombre", "regla_calculo", "valor_base", "vigencia_desde", "vigencia_hasta"],
        properties: {
          nombre: { type: "string" },
          regla_calculo: { type: "string" },
          valor_base: { type: "number" },
          vigencia_desde: { type: "string", format: "date-time" },
          vigencia_hasta: { type: "string", format: "date-time" },
          status: { type: "string" }
        }
      },
      TarifaUpdate: {
        type: "object",
        required: ["nombre", "regla_calculo", "valor_base", "vigencia_desde", "vigencia_hasta"],
        properties: {
          nombre: { type: "string" },
          regla_calculo: { type: "string" },
          valor_base: { type: "number" },
          vigencia_desde: { type: "string", format: "date-time" },
          vigencia_hasta: { type: "string", format: "date-time" },
          status: { type: "string" }
        }
      },
      TarifaPatch: {
        type: "object",
        properties: {
          nombre: { type: "string" },
          regla_calculo: { type: "string" },
          valor_base: { type: "number" },
          vigencia_desde: { type: "string", format: "date-time" },
          vigencia_hasta: { type: "string", format: "date-time" },
          status: { type: "string" }
        }
      }
    }
  }
};
