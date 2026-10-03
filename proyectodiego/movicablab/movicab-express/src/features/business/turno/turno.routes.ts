import { Application } from "express";
import { TurnoController } from "./turno.controller";

export class TurnoRoutes {
  public turnoController: TurnoController = new TurnoController();

  public routes(app: Application): void {
    app.route("/api/turnos")
      .get(this.turnoController.getAll.bind(this.turnoController))
      .post(this.turnoController.create.bind(this.turnoController));

    app.route("/api/turnos/:id")
      .get(this.turnoController.getOne.bind(this.turnoController))
      .put(this.turnoController.updatePut.bind(this.turnoController))
      .patch(this.turnoController.updatePatch.bind(this.turnoController))
      .delete(this.turnoController.deletePhysical.bind(this.turnoController));

    app.route("/api/turnos/:id/deactivate")
      .patch(this.turnoController.deleteLogical.bind(this.turnoController));
  }
}
