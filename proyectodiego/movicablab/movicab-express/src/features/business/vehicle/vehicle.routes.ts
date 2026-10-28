import { Application } from "express";
import { VehicleController } from "./vehicle.controller";
import { authenticate, authorize } from "../../auth/access";


export class VehicleRoutes {
  public vehicleController: VehicleController = new VehicleController();

  public routes(app: Application): void {
    app
      .route("/api/vehiculos")
      .get(authenticate, authorize, this.vehicleController.getAll.bind(this.vehicleController))
      .post(authenticate, authorize, this.vehicleController.create.bind(this.vehicleController));

    app
      .route("/api/vehiculos/:id")
      .get(authenticate, authorize, this.vehicleController.getOne.bind(this.vehicleController))
      .put(authenticate, authorize, this.vehicleController.updatePut.bind(this.vehicleController))
      .patch(authenticate, authorize, this.vehicleController.updatePatch.bind(this.vehicleController))
      .delete(authenticate, authorize, this.vehicleController.deletePhysical.bind(this.vehicleController));

    app
      .route("/api/vehiculos/:id/deactivate")
      .patch(authenticate, authorize, this.vehicleController.deleteLogical.bind(this.vehicleController));
  }
}
