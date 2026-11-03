import { Application } from "express";
import { RatingController } from "./rating.controller";
import { authenticate, authorize } from "../../auth/access";

export class RatingRoutes {
  public ratingController: RatingController = new RatingController();

  public routes(app: Application): void {
    app.route("/api/calificaciones")
      .get(authenticate, authorize, this.ratingController.getAll.bind(this.ratingController))
      .post(authenticate, authorize, this.ratingController.create.bind(this.ratingController));

    app.route("/api/calificaciones/:id")
      .get(authenticate, authorize, this.ratingController.getOne.bind(this.ratingController))
      .put(authenticate, authorize, this.ratingController.updatePut.bind(this.ratingController))
      .patch(authenticate, authorize, this.ratingController.updatePatch.bind(this.ratingController))
      .delete(authenticate, authorize, this.ratingController.deletePhysical.bind(this.ratingController));

    app.route("/api/calificaciones/:id/deactivate")
      .patch(authenticate, authorize, this.ratingController.deleteLogical.bind(this.ratingController));
  }
}
