import { Application } from "express";
import { VehiculoController } from "./vehiculo.controller";
import { authenticate, authorize } from "../../auth/access";


export class VehiculoRoutes {
  public vehiculoController: VehiculoController = new VehiculoController();

  public routes(app: Application): void {
    app.route("/api/vehiculos")
      .get(authenticate, authorize, this.vehiculoController.getAll.bind(this.vehiculoController))
      .post(authenticate, authorize, this.vehiculoController.create.bind(this.vehiculoController));

    app.route("/api/vehiculos/:id")
      .get(authenticate, authorize, this.vehiculoController.getOne.bind(this.vehiculoController))
      .put(authenticate, authorize, this.vehiculoController.updatePut.bind(this.vehiculoController))
      .patch(authenticate, authorize, this.vehiculoController.updatePatch.bind(this.vehiculoController))
      .delete(authenticate, authorize, this.vehiculoController.deletePhysical.bind(this.vehiculoController));

    app.route("/api/vehiculos/:id/deactivate")
      .patch(authenticate, authorize, this.vehiculoController.deleteLogical.bind(this.vehiculoController));
  }
}
