import { Application } from "express";
import { PasajeroController } from "./pasajero.controller";
import { authenticate, authorize } from "../../auth/access";


export class PasajeroRoutes {
  public pasajeroController: PasajeroController = new PasajeroController();

  public routes(app: Application): void {
    // ================== RUTAS SIN AUTENTICACION / SIN MIDDLEWARE JWT ==================

    // getAll
    app
      .route("/api/pasajeros")
      .get(authenticate, authorize, this.pasajeroController.getAll.bind(this.pasajeroController));

    // getOne
    app
      .route("/api/pasajeros/:id")
      .get(authenticate, authorize, this.pasajeroController.getOne.bind(this.pasajeroController));

    // create
    app
      .route("/api/pasajeros")
      .post(authenticate, authorize, this.pasajeroController.create.bind(this.pasajeroController));

    // update (PUT / PATCH)
    app
      .route("/api/pasajeros/:id")
      .put(authenticate, authorize, this.pasajeroController.updatePut.bind(this.pasajeroController))
      .patch(authenticate, authorize, this.pasajeroController.updatePatch.bind(this.pasajeroController));

    // delete fisico
    app
      .route("/api/pasajeros/:id")
      .delete(authenticate, authorize, this.pasajeroController.deletePhysical.bind(this.pasajeroController));

    // delete logico
    app
      .route("/api/pasajeros/:id/deactivate")
      .patch(authenticate, authorize, this.pasajeroController.deleteLogical.bind(this.pasajeroController));
  }
}