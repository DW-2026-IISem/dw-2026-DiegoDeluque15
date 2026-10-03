import { Application } from "express";
import { VehiculoController } from "./vehiculo.controller";

export class VehiculoRoutes {
  public vehiculoController: VehiculoController = new VehiculoController();

  public routes(app: Application): void {
    app.route("/api/vehiculos")
      .get(this.vehiculoController.getAll.bind(this.vehiculoController))
      .post(this.vehiculoController.create.bind(this.vehiculoController));

    app.route("/api/vehiculos/:id")
      .get(this.vehiculoController.getOne.bind(this.vehiculoController))
      .put(this.vehiculoController.updatePut.bind(this.vehiculoController))
      .patch(this.vehiculoController.updatePatch.bind(this.vehiculoController))
      .delete(this.vehiculoController.deletePhysical.bind(this.vehiculoController));

    app.route("/api/vehiculos/:id/deactivate")
      .patch(this.vehiculoController.deleteLogical.bind(this.vehiculoController));
  }
}
