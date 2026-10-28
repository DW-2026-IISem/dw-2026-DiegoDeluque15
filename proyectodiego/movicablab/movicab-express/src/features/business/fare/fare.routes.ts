import { Application } from "express";
import { FareController } from "./fare.controller";
import { authenticate, authorize } from "../../auth/access";


export class FareRoutes {
  public fareController: FareController = new FareController();

  public routes(app: Application): void {
    app.route("/api/tarifas/vigente")
      .get(authenticate, authorize, this.fareController.getVigente.bind(this.fareController));

    app.route("/api/tarifas")
      .get(authenticate, authorize, this.fareController.getAll.bind(this.fareController))
      .post(authenticate, authorize, this.fareController.create.bind(this.fareController));

    app.route("/api/tarifas/:id")
      .get(authenticate, authorize, this.fareController.getOne.bind(this.fareController))
      .put(authenticate, authorize, this.fareController.updatePut.bind(this.fareController))
      .patch(authenticate, authorize, this.fareController.updatePatch.bind(this.fareController))
      .delete(authenticate, authorize, this.fareController.deletePhysical.bind(this.fareController));

    app.route("/api/tarifas/:id/deactivate")
      .patch(authenticate, authorize, this.fareController.deleteLogical.bind(this.fareController));
  }
}
