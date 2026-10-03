import { Application } from "express";
import { CalificacionController } from "./calificacion.controller";

export class CalificacionRoutes {
  public calController: CalificacionController = new CalificacionController();

  public routes(app: Application): void {
    app.route("/api/calificaciones")
      .get(this.calController.getAll.bind(this.calController))
      .post(this.calController.create.bind(this.calController));

    app.route("/api/calificaciones/:id")
      .get(this.calController.getOne.bind(this.calController))
      .put(this.calController.updatePut.bind(this.calController))
      .patch(this.calController.updatePatch.bind(this.calController))
      .delete(this.calController.deletePhysical.bind(this.calController));

    app.route("/api/calificaciones/:id/deactivate")
      .patch(this.calController.deleteLogical.bind(this.calController));
  }
}
