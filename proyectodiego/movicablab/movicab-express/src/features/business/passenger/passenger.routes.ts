import { Application } from "express";
import { PassengerController } from "./passenger.controller";
import { authenticate, authorize } from "../../auth/access";


export class PassengerRoutes {
  public passengerController: PassengerController = new PassengerController();

  public routes(app: Application): void {
    app
      .route("/api/pasajeros")
      .get(authenticate, authorize, this.passengerController.getAll.bind(this.passengerController))
      .post(authenticate, authorize, this.passengerController.create.bind(this.passengerController));

    app
      .route("/api/pasajeros/:id")
      .get(authenticate, authorize, this.passengerController.getOne.bind(this.passengerController))
      .put(authenticate, authorize, this.passengerController.updatePut.bind(this.passengerController))
      .patch(authenticate, authorize, this.passengerController.updatePatch.bind(this.passengerController))
      .delete(authenticate, authorize, this.passengerController.deletePhysical.bind(this.passengerController));

    app
      .route("/api/pasajeros/:id/deactivate")
      .patch(authenticate, authorize, this.passengerController.deleteLogical.bind(this.passengerController));
  }
}
