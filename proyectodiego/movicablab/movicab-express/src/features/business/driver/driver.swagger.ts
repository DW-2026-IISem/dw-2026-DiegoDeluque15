export const driverSwagger = {
  tags: [
    {
      name: "Drivers",
      description: "CRUD de conductores — **SIN AUTH** (sin middleware JWT)",
    },
  ],
  paths: {
    "/api/conductores": {
      get: {
        tags: ["Drivers"],
        summary: "Listar conductores activos",
        description: "SIN AUTH — retorna conductores con status=active, incluye company anidada",
        security: [],
        responses: {
          "200": {
            description: "Lista de conductores",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    drivers: { type: "array", items: { $ref: "#/components/schemas/Driver" } },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Drivers"],
        summary: "Crear conductor",
        description: "SIN AUTH — si se envia company_id, la empresa debe existir y ser active",
        security: [],
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/DriverCreate" } } } },
        responses: {
          "201": { description: "Driver creado" },
          "400": { description: "company_id referencia company inactive" },
          "404": { description: "company_id no encontrado" },
        },
      },
    },
    "/api/conductores/{id}": {
      get: {
        tags: ["Drivers"],
        summary: "Obtener conductor por id",
        description: "SIN AUTH — incluye company anidada",
        security: [],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: { "200": { description: "Encontrado" }, "404": { description: "No encontrado" } },
      },
      put: {
        tags: ["Drivers"],
        summary: "Actualizar conductor (PUT)",
        security: [],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/DriverUpdate" } } } },
        responses: { "200": { description: "Actualizado" }, "400": { description: "company inactive" }, "404": { description: "No encontrado" } },
      },
      patch: {
        tags: ["Drivers"],
        summary: "Actualizar conductor (PATCH)",
        security: [],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/DriverPatch" } } } },
        responses: { "200": { description: "Actualizado" }, "400": { description: "company inactive" }, "404": { description: "No encontrado" } },
      },
      delete: {
        tags: ["Drivers"],
        summary: "Eliminar conductor (fisico)",
        security: [],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: { "200": { description: "Eliminado" }, "404": { description: "No encontrado" } },
      },
    },
    "/api/conductores/{id}/deactivate": {
      patch: {
        tags: ["Drivers"],
        summary: "Desactivar conductor (logico)",
        security: [],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: { "200": { description: "Desactivado" }, "404": { description: "No encontrado" } },
      },
    },
  },
  components: {
    schemas: {
      Driver: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          name: { type: "string", example: "Carlos Martinez" },
          description: { type: "string", nullable: true },
          company_id: { type: "integer", nullable: true },
          status: { type: "string", enum: ["active", "inactive"] },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
          company: {
            nullable: true,
            allOf: [{ $ref: "#/components/schemas/CompanyResumen" }],
          },
        },
      },
      CompanyResumen: {
        type: "object",
        properties: {
          id: { type: "integer" },
          tax_id: { type: "string" },
          legal_name: { type: "string" },
        },
      },
      DriverCreate: {
        type: "object",
        required: ["name"],
        properties: {
          name: { type: "string", minLength: 2 },
          description: { type: "string" },
          company_id: { type: "integer", nullable: true },
          status: { type: "string", enum: ["active", "inactive"], default: "active" },
        },
      },
      DriverUpdate: {
        type: "object",
        required: ["name"],
        properties: {
          name: { type: "string", minLength: 2 },
          description: { type: "string" },
          company_id: { type: "integer", nullable: true },
          status: { type: "string", enum: ["active", "inactive"] },
        },
      },
      DriverPatch: {
        type: "object",
        properties: {
          name: { type: "string", minLength: 2 },
          description: { type: "string" },
          company_id: { type: "integer", nullable: true },
          status: { type: "string", enum: ["active", "inactive"] },
        },
      },
    },
  },
};
