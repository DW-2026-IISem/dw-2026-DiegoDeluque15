import { Application } from "express";
import { PasajeroController } from "./pasajero.controller";

export class PasajeroRoutes {
  public pasajeroController: PasajeroController = new PasajeroController();

  public routes(app: Application): void {
    // ================== RUTAS SIN AUTENTICACION / SIN MIDDLEWARE JWT ==================
    // (rellenar en ISS-03-B a E)

    // getAll
    app
      .route("/api/pasajeros")
      .get(this.pasajeroController.getAll.bind(this.pasajeroController));

    // getOne
    app
      .route("/api/pasajeros/:id")
      .get(this.pasajeroController.getOne.bind(this.pasajeroController));

    // create
    app
      .route("/api/pasajeros")
      .post(this.pasajeroController.create.bind(this.pasajeroController));

    // update (PUT / PATCH)
    app
      .route("/api/pasajeros/:id")
      .put(this.pasajeroController.updatePut.bind(this.pasajeroController))
      .patch(this.pasajeroController.updatePatch.bind(this.pasajeroController));
  }
}