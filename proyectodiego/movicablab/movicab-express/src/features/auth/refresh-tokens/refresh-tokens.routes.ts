import { Application } from "express";
import { RefreshTokensController } from "./refresh-tokens.controller";
import { authenticate } from "../access";

/**
 * Rutas del feature RefreshTokens — **modalidad 2 (JWT, sin RBAC)**.
 *
 * Todas operan sobre las **sesiones del usuario autenticado**. Ver y revocar las
 * propias sesiones es un derecho derivado de estar autenticado, no de un permiso
 * concreto; por eso no llevan `authorize` ni figuran en el catálogo de recursos.
 *
 * Nota de enrutado: `/api/sesiones/deactivate-all` es una **ruta literal** del
 * mismo verbo (`PATCH`) que la ruta parametrizada de una sola sesión
 * (`/api/sesiones/:id/deactivate`). No colisionan porque tienen distinto número
 * de segmentos, pero la literal se registra primero por claridad y para que
 * cualquier ruta literal futura siga la misma regla (Express resuelve por orden
 * de registro).
 */
export class RefreshTokensRoutes {
  public refreshTokensController: RefreshTokensController = new RefreshTokensController();

  public routes(app: Application): void {
    // getAll (sesiones propias)
    app
      .route("/api/sesiones")
      .get(
        authenticate,
        this.refreshTokensController.getAll.bind(this.refreshTokensController)
      );

    // revocar todas las sesiones propias (ruta literal: va ANTES de /:id)
    app
      .route("/api/sesiones/deactivate-all")
      .patch(
        authenticate,
        this.refreshTokensController.revokeAll.bind(this.refreshTokensController)
      );

    // getOne
    app
      .route("/api/sesiones/:id")
      .get(
        authenticate,
        this.refreshTokensController.getOne.bind(this.refreshTokensController)
      );

    // revocar una sesión propia
    app
      .route("/api/sesiones/:id/deactivate")
      .patch(
        authenticate,
        this.refreshTokensController.revokeOne.bind(this.refreshTokensController)
      );

    // purga de sesiones propias revocadas/expiradas
    app
      .route("/api/sesiones")
      .delete(authenticate, this.refreshTokensController.purge.bind(this.refreshTokensController));
  }
}
