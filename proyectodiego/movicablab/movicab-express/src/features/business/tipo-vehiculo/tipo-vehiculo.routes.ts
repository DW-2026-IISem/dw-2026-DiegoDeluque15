import { Application } from "express";
import { TipoVehiculoController } from "./tipo-vehiculo.controller";
import { authenticate, authorize } from "../../auth/access";


export class TipoVehiculoRoutes {
  public vehiculoTypeController: TipoVehiculoController = new TipoVehiculoController();

  public routes(app: Application): void {
    // ================== RUTAS SIN AUTENTICACION / SIN MIDDLEWARE JWT ==================

    // getAll
    app
      .route("/api/tipos-vehiculo")
      .get(authenticate, authorize, this.vehiculoTypeController.getAll.bind(this.vehiculoTypeController));

    // getOne
    app
      .route("/api/tipos-vehiculo/:id")
      .get(authenticate, authorize, this.vehiculoTypeController.getOne.bind(this.vehiculoTypeController));

    // create
    app
      .route("/api/tipos-vehiculo")
      .post(authenticate, authorize, this.vehiculoTypeController.create.bind(this.vehiculoTypeController));

    // update (PUT / PATCH)
    app
      .route("/api/tipos-vehiculo/:id")
      .put(authenticate, authorize, this.vehiculoTypeController.updatePut.bind(this.vehiculoTypeController))
      .patch(authenticate, authorize, this.vehiculoTypeController.updatePatch.bind(this.vehiculoTypeController));

    // delete fisico
    app
      .route("/api/tipos-vehiculo/:id")
      .delete(authenticate, authorize, this.vehiculoTypeController.deletePhysical.bind(this.vehiculoTypeController));

    // delete logico
    app
      .route("/api/tipos-vehiculo/:id/deactivate")
      .patch(authenticate, authorize, this.vehiculoTypeController.deleteLogical.bind(this.vehiculoTypeController));
  }
}