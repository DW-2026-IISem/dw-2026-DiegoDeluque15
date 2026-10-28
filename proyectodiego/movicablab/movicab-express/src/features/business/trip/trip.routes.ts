import { Application } from "express";
import { TripController } from "./trip.controller";
import { authenticate, authorize } from "../../auth/access";

export class TripRoutes {
  public tripController: TripController = new TripController();

  public routes(app: Application): void {
    app.route("/api/carreras")
      .get(authenticate, authorize, this.tripController.getAll.bind(this.tripController))
      .post(authenticate, authorize, this.tripController.create.bind(this.tripController));

    // /estado ANTES de /:id para que Express no lo confunda
    app.route("/api/carreras/:id/estado")
      .patch(authenticate, authorize, this.tripController.changeStatus.bind(this.tripController));

    app.route("/api/carreras/:id")
      .get(authenticate, authorize, this.tripController.getOne.bind(this.tripController))
      .patch(authenticate, authorize, this.tripController.updatePatch.bind(this.tripController))
      .delete(authenticate, authorize, this.tripController.deletePhysical.bind(this.tripController));
  }
}
