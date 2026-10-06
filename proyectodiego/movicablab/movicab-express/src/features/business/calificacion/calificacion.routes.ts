import { Application } from "express";
import { CalificacionController } from "./calificacion.controller";
import { authenticate, authorize } from "../../auth/access";


export class CalificacionRoutes {
  public calController: CalificacionController = new CalificacionController();

  public routes(app: Application): void {
    app.route("/api/calificaciones")
      .get(authenticate, authorize, this.calController.getAll.bind(this.calController))
      .post(authenticate, authorize, this.calController.create.bind(this.calController));

    app.route("/api/calificaciones/:id")
      .get(authenticate, authorize, this.calController.getOne.bind(this.calController))
      .put(authenticate, authorize, this.calController.updatePut.bind(this.calController))
      .patch(authenticate, authorize, this.calController.updatePatch.bind(this.calController))
      .delete(authenticate, authorize, this.calController.deletePhysical.bind(this.calController));

    app.route("/api/calificaciones/:id/deactivate")
      .patch(authenticate, authorize, this.calController.deleteLogical.bind(this.calController));
  }
}
