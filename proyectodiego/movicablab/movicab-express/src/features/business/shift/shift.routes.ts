import { Application } from "express";
import { ShiftController } from "./shift.controller";
import { authenticate, authorize } from "../../auth/access";


export class ShiftRoutes {
  public shiftController: ShiftController = new ShiftController();

  public routes(app: Application): void {
    app
      .route("/api/turnos")
      .get(authenticate, authorize, this.shiftController.getAll.bind(this.shiftController))
      .post(authenticate, authorize, this.shiftController.create.bind(this.shiftController));

    app
      .route("/api/turnos/:id")
      .get(authenticate, authorize, this.shiftController.getOne.bind(this.shiftController))
      .put(authenticate, authorize, this.shiftController.updatePut.bind(this.shiftController))
      .patch(authenticate, authorize, this.shiftController.updatePatch.bind(this.shiftController))
      .delete(authenticate, authorize, this.shiftController.deletePhysical.bind(this.shiftController));

    app
      .route("/api/turnos/:id/deactivate")
      .patch(authenticate, authorize, this.shiftController.deleteLogical.bind(this.shiftController));
  }
}
