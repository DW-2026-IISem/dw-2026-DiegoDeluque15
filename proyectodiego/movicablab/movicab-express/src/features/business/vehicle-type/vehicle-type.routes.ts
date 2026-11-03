import { Application } from "express";
import { VehicleTypeController } from "./vehicle-type.controller";
import { authenticate, authorize } from "../../auth/access";


export class VehicleTypeRoutes {
  public vehicleTypeController: VehicleTypeController = new VehicleTypeController();

  public routes(app: Application): void {
    app
      .route("/api/tipos-vehiculo")
      .get(authenticate, authorize, this.vehicleTypeController.getAll.bind(this.vehicleTypeController))
      .post(authenticate, authorize, this.vehicleTypeController.create.bind(this.vehicleTypeController));

    app
      .route("/api/tipos-vehiculo/:id")
      .get(authenticate, authorize, this.vehicleTypeController.getOne.bind(this.vehicleTypeController))
      .put(authenticate, authorize, this.vehicleTypeController.updatePut.bind(this.vehicleTypeController))
      .patch(authenticate, authorize, this.vehicleTypeController.updatePatch.bind(this.vehicleTypeController))
      .delete(authenticate, authorize, this.vehicleTypeController.deletePhysical.bind(this.vehicleTypeController));

    app
      .route("/api/tipos-vehiculo/:id/deactivate")
      .patch(authenticate, authorize, this.vehicleTypeController.deleteLogical.bind(this.vehicleTypeController));
  }
}
