export const calificacionSwagger = {
  tags: [{ name: "Calificaciones", description: "CRUD de calificaciones (1 a 1 con Carrera)" }],
  paths: {
    "/api/calificaciones": {
      get: {
        tags: ["Calificaciones"],
        summary: "Listar calificaciones activas",
        responses: { "200": { description: "Lista" } }
      },
      post: {
        tags: ["Calificaciones"],
        summary: "Crear calificacion",
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/CalificacionCreate" } } } },
        responses: {
          "201": { description: "Creada" },
          "400": { description: "Puntaje fuera de rango" },
          "404": { description: "Carrera no existe" },
          "409": { description: "Carrera no cerrada o ya calificada" }
        }
      }
    },
    "/api/calificaciones/{id}": {
      get: { tags: ["Calificaciones"], summary: "Obtener", parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }] },
      put: { tags: ["Calificaciones"], summary: "Actualizar (PUT)", parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }], requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/CalificacionUpdate" } } } } },
      patch: { tags: ["Calificaciones"], summary: "Actualizar (PATCH)", parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }], requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/CalificacionPatch" } } } } },
      delete: { tags: ["Calificaciones"], summary: "Borrado Fisico", parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }] }
    },
    "/api/calificaciones/{id}/deactivate": {
      patch: { tags: ["Calificaciones"], summary: "Borrado Logico", parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }] }
    }
  },
  components: {
    schemas: {
      Calificacion: {
        type: "object",
        properties: { id: { type: "integer" }, carrera_id: { type: "integer" }, puntaje: { type: "integer" }, comentario: { type: "string" }, status: { type: "string" } }
      },
      CalificacionCreate: {
        type: "object",
        required: ["carrera_id", "puntaje"],
        properties: { carrera_id: { type: "integer" }, puntaje: { type: "integer" }, comentario: { type: "string" }, status: { type: "string" } }
      },
      CalificacionUpdate: {
        type: "object",
        required: ["puntaje"],
        properties: { puntaje: { type: "integer" }, comentario: { type: "string" }, status: { type: "string" } }
      },
      CalificacionPatch: {
        type: "object",
        properties: { puntaje: { type: "integer" }, comentario: { type: "string" }, status: { type: "string" } }
      }
    }
  }
};
