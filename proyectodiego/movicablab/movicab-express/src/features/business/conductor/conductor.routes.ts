import { Application } from "express";
import { ConductorController } from "./conductor.controller";

export class ConductorRoutes {
  public conductorController: ConductorController = new ConductorController();

  public routes(app: Application): void {
    // ================== RUTAS SIN AUTENTICACION / SIN MIDDLEWARE JWT ==================

    // getAll
    app
      .route("/api/conductores")
      .get(this.conductorController.getAll.bind(this.conductorController));

    // getOne
    app
      .route("/api/conductores/:id")
      .get(this.conductorController.getOne.bind(this.conductorController));

    // create
    app
      .route("/api/conductores")
      .post(this.conductorController.create.bind(this.conductorController));

    // update (PUT / PATCH)
    app
      .route("/api/conductores/:id")
      .put(this.conductorController.updatePut.bind(this.conductorController))
      .patch(this.conductorController.updatePatch.bind(this.conductorController));

    // delete fisico
    app
      .route("/api/conductores/:id")
      .delete(this.conductorController.deletePhysical.bind(this.conductorController));

    // delete logico
    app
      .route("/api/conductores/:id/deactivate")
      .patch(this.conductorController.deleteLogical.bind(this.conductorController));
  }
}
