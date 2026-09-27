import { Application } from "express";
import { TipoVehiculoController } from "./tipo-vehiculo.controller";

export class TipoVehiculoRoutes {
  public vehiculoTypeController: TipoVehiculoController = new TipoVehiculoController();

  public routes(app: Application): void {
    // ================== RUTAS SIN AUTENTICACION / SIN MIDDLEWARE JWT ==================

    // getAll
    app
      .route("/api/tipos-vehiculo")
      .get(this.vehiculoTypeController.getAll.bind(this.vehiculoTypeController));

    // getOne
    app
      .route("/api/tipos-vehiculo/:id")
      .get(this.vehiculoTypeController.getOne.bind(this.vehiculoTypeController));

    // create
    app
      .route("/api/tipos-vehiculo")
      .post(this.vehiculoTypeController.create.bind(this.vehiculoTypeController));

    // update (PUT / PATCH)
    app
      .route("/api/tipos-vehiculo/:id")
      .put(this.vehiculoTypeController.updatePut.bind(this.vehiculoTypeController))
      .patch(this.vehiculoTypeController.updatePatch.bind(this.vehiculoTypeController));
  }
}