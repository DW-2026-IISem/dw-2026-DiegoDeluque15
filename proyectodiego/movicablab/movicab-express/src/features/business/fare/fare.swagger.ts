export const fareSwagger = {
  tags: [{ name: "Fares", description: "CRUD de tarifas (con control de solape de vigencia)" }],
  paths: {
    "/api/tarifas/vigente": {
      get: {
        tags: ["Fares"],
        summary: "Obtener tarifa vigente (activa en este momento)",
        responses: {
          "200": { description: "Tarifa vigente encontrada" },
          "404": { description: "No hay tarifa activa que cubra la fecha actual" },
        },
      },
    },
    "/api/tarifas": {
      get: {
        tags: ["Fares"],
        summary: "Listar todas las tarifas activas",
        responses: { "200": { description: "Lista de tarifas" } },
      },
      post: {
        tags: ["Fares"],
        summary: "Crear tarifa",
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/FareCreate" } } } },
        responses: {
          "201": { description: "Tarifa creada" },
          "400": { description: "base_value <= 0 o valid_from >= valid_until" },
          "409": { description: "Solape de vigencia con otra tarifa activa" },
        },
      },
    },
    "/api/tarifas/{id}": {
      get: {
        tags: ["Fares"],
        summary: "Obtener tarifa por id",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: { "200": { description: "Encontrada" }, "404": { description: "No encontrada" } },
      },
      put: {
        tags: ["Fares"],
        summary: "Actualizar tarifa (PUT)",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/FareUpdate" } } } },
        responses: { "200": { description: "Actualizada" }, "400": { description: "Validacion" }, "409": { description: "Solape" } },
      },
      patch: {
        tags: ["Fares"],
        summary: "Actualizar tarifa (PATCH)",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/FarePatch" } } } },
        responses: { "200": { description: "Actualizada" }, "400": { description: "Validacion" }, "409": { description: "Solape" } },
      },
      delete: {
        tags: ["Fares"],
        summary: "Eliminar tarifa (fisico)",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: { "200": { description: "Eliminada" }, "404": { description: "No encontrada" } },
      },
    },
    "/api/tarifas/{id}/deactivate": {
      patch: {
        tags: ["Fares"],
        summary: "Desactivar tarifa (logico)",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: { "200": { description: "Desactivada" }, "404": { description: "No encontrada" } },
      },
    },
  },
  components: {
    schemas: {
      Fare: {
        type: "object",
        properties: {
          id: { type: "integer" },
          name: { type: "string" },
          calculation_rule: { type: "string" },
          base_value: { type: "number" },
          valid_from: { type: "string", format: "date-time" },
          valid_until: { type: "string", format: "date-time" },
          status: { type: "string" },
        },
      },
      FareCreate: {
        type: "object",
        required: ["name", "calculation_rule", "base_value", "valid_from", "valid_until"],
        properties: {
          name: { type: "string" },
          calculation_rule: { type: "string" },
          base_value: { type: "number" },
          valid_from: { type: "string", format: "date-time" },
          valid_until: { type: "string", format: "date-time" },
          status: { type: "string" },
        },
      },
      FareUpdate: {
        type: "object",
        required: ["name", "calculation_rule", "base_value", "valid_from", "valid_until"],
        properties: {
          name: { type: "string" },
          calculation_rule: { type: "string" },
          base_value: { type: "number" },
          valid_from: { type: "string", format: "date-time" },
          valid_until: { type: "string", format: "date-time" },
          status: { type: "string" },
        },
      },
      FarePatch: {
        type: "object",
        properties: {
          name: { type: "string" },
          calculation_rule: { type: "string" },
          base_value: { type: "number" },
          valid_from: { type: "string", format: "date-time" },
          valid_until: { type: "string", format: "date-time" },
          status: { type: "string" },
        },
      },
    },
  },
};
