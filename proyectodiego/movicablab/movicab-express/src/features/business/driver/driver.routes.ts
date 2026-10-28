import { Application } from "express";
import { DriverController } from "./driver.controller";
import { authenticate, authorize } from "../../auth/access";


export class DriverRoutes {
  public driverController: DriverController = new DriverController();

  public routes(app: Application): void {
    app
      .route("/api/conductores")
      .get(authenticate, authorize, this.driverController.getAll.bind(this.driverController))
      .post(authenticate, authorize, this.driverController.create.bind(this.driverController));

    app
      .route("/api/conductores/:id")
      .get(authenticate, authorize, this.driverController.getOne.bind(this.driverController))
      .put(authenticate, authorize, this.driverController.updatePut.bind(this.driverController))
      .patch(authenticate, authorize, this.driverController.updatePatch.bind(this.driverController))
      .delete(authenticate, authorize, this.driverController.deletePhysical.bind(this.driverController));

    app
      .route("/api/conductores/:id/deactivate")
      .patch(authenticate, authorize, this.driverController.deleteLogical.bind(this.driverController));
  }
}
