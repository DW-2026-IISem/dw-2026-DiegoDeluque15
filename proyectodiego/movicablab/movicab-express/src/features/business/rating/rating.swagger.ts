export const ratingSwagger = {
  tags: [{ name: "Ratings", description: "CRUD de calificaciones / ratings (1 a 1 con Trip)" }],
  paths: {
    "/api/calificaciones": {
      get: {
        tags: ["Ratings"],
        summary: "Listar calificaciones activas",
        responses: { "200": { description: "Lista" } }
      },
      post: {
        tags: ["Ratings"],
        summary: "Crear calificacion",
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/RatingCreate" } } } },
        responses: {
          "201": { description: "Creada" },
          "400": { description: "Score fuera de rango" },
          "404": { description: "Trip no existe" },
          "409": { description: "Trip no cerrada o ya calificada" }
        }
      }
    },
    "/api/calificaciones/{id}": {
      get: { tags: ["Ratings"], summary: "Obtener", parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }] },
      put: { tags: ["Ratings"], summary: "Actualizar (PUT)", parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }], requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/RatingUpdate" } } } } },
      patch: { tags: ["Ratings"], summary: "Actualizar (PATCH)", parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }], requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/RatingPatch" } } } } },
      delete: { tags: ["Ratings"], summary: "Borrado Fisico", parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }] }
    },
    "/api/calificaciones/{id}/deactivate": {
      patch: { tags: ["Ratings"], summary: "Borrado Logico", parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }] }
    }
  },
  components: {
    schemas: {
      Rating: {
        type: "object",
        properties: { id: { type: "integer" }, trip_id: { type: "integer" }, score: { type: "integer" }, comment: { type: "string" }, status: { type: "string" } }
      },
      RatingCreate: {
        type: "object",
        required: ["trip_id", "score"],
        properties: { trip_id: { type: "integer" }, score: { type: "integer" }, comment: { type: "string" }, status: { type: "string" } }
      },
      RatingUpdate: {
        type: "object",
        required: ["score"],
        properties: { score: { type: "integer" }, comment: { type: "string" }, status: { type: "string" } }
      },
      RatingPatch: {
        type: "object",
        properties: { score: { type: "integer" }, comment: { type: "string" }, status: { type: "string" } }
      }
    }
  }
};
