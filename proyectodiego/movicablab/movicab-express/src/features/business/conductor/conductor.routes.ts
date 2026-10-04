import { Application } from "express";
import { ConductorController } from "./conductor.controller";
import { authenticate, authorize } from "../../auth/access";


export class ConductorRoutes {
  public conductorController: ConductorController = new ConductorController();

  public routes(app: Application): void {
    // ================== RUTAS SIN AUTENTICACION / SIN MIDDLEWARE JWT ==================

    // getAll
    app
      .route("/api/conductores")
      .get(authenticate, authorize, this.conductorController.getAll.bind(this.conductorController));

    // getOne
    app
      .route("/api/conductores/:id")
      .get(authenticate, authorize, this.conductorController.getOne.bind(this.conductorController));

    // create
    app
      .route("/api/conductores")
      .post(authenticate, authorize, this.conductorController.create.bind(this.conductorController));

    // update (PUT / PATCH)
    app
      .route("/api/conductores/:id")
      .put(authenticate, authorize, this.conductorController.updatePut.bind(this.conductorController))
      .patch(authenticate, authorize, this.conductorController.updatePatch.bind(this.conductorController));

    // delete fisico
    app
      .route("/api/conductores/:id")
      .delete(authenticate, authorize, this.conductorController.deletePhysical.bind(this.conductorController));

    // delete logico
    app
      .route("/api/conductores/:id/deactivate")
      .patch(authenticate, authorize, this.conductorController.deleteLogical.bind(this.conductorController));
  }
}
