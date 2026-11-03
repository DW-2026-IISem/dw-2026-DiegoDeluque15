export const passengerSwagger = {
  tags: [{ name: "Passengers", description: "CRUD de pasajeros" }],
  paths: {
    "/api/pasajeros": {
      get: {
        tags: ["Passengers"],
        summary: "Listar pasajeros activos",
        responses: {
          "200": {
            description: "Lista de pasajeros",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    passengers: { type: "array", items: { $ref: "#/components/schemas/Passenger" } },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Passengers"],
        summary: "Crear pasajero",
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/PassengerCreate" } } } },
        responses: { "201": { description: "Creado" } },
      },
    },
    "/api/pasajeros/{id}": {
      get: {
        tags: ["Passengers"],
        summary: "Obtener pasajero por id",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: { "200": { description: "Encontrado" }, "404": { description: "No encontrado" } },
      },
      put: {
        tags: ["Passengers"],
        summary: "Actualizar pasajero (PUT)",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/PassengerUpdate" } } } },
        responses: { "200": { description: "Actualizado" }, "404": { description: "No encontrado" } },
      },
      patch: {
        tags: ["Passengers"],
        summary: "Actualizar pasajero (PATCH)",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/PassengerPatch" } } } },
        responses: { "200": { description: "Actualizado" }, "404": { description: "No encontrado" } },
      },
      delete: {
        tags: ["Passengers"],
        summary: "Eliminar pasajero (fisico)",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: { "200": { description: "Eliminado" }, "404": { description: "No encontrado" } },
      },
    },
    "/api/pasajeros/{id}/deactivate": {
      patch: {
        tags: ["Passengers"],
        summary: "Desactivar pasajero (logico)",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: { "200": { description: "Desactivado" }, "404": { description: "No encontrado" } },
      },
    },
  },
  components: {
    schemas: {
      Passenger: {
        type: "object",
        properties: {
          id: { type: "integer" },
          name: { type: "string" },
          address: { type: "string" },
          phone: { type: "string" },
          email: { type: "string" },
          status: { type: "string", enum: ["active", "inactive"] },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      PassengerCreate: {
        type: "object",
        required: ["name", "email", "password"],
        properties: {
          name: { type: "string" },
          address: { type: "string" },
          phone: { type: "string" },
          email: { type: "string" },
          password: { type: "string" },
          status: { type: "string", enum: ["active", "inactive"], default: "inactive" },
        },
      },
      PassengerUpdate: {
        type: "object",
        required: ["name", "email"],
        properties: {
          name: { type: "string" },
          address: { type: "string" },
          phone: { type: "string" },
          email: { type: "string" },
          password: { type: "string" },
          status: { type: "string", enum: ["active", "inactive"] },
        },
      },
      PassengerPatch: {
        type: "object",
        properties: {
          name: { type: "string" },
          address: { type: "string" },
          phone: { type: "string" },
          email: { type: "string" },
          password: { type: "string" },
          status: { type: "string", enum: ["active", "inactive"] },
        },
      },
    },
  },
};
