import { Application } from "express";
import { TurnoController } from "./turno.controller";
import { authenticate, authorize } from "../../auth/access";


export class TurnoRoutes {
  public turnoController: TurnoController = new TurnoController();

  public routes(app: Application): void {
    app.route("/api/turnos")
      .get(authenticate, authorize, this.turnoController.getAll.bind(this.turnoController))
      .post(authenticate, authorize, this.turnoController.create.bind(this.turnoController));

    app.route("/api/turnos/:id")
      .get(authenticate, authorize, this.turnoController.getOne.bind(this.turnoController))
      .put(authenticate, authorize, this.turnoController.updatePut.bind(this.turnoController))
      .patch(authenticate, authorize, this.turnoController.updatePatch.bind(this.turnoController))
      .delete(authenticate, authorize, this.turnoController.deletePhysical.bind(this.turnoController));

    app.route("/api/turnos/:id/deactivate")
      .patch(authenticate, authorize, this.turnoController.deleteLogical.bind(this.turnoController));
  }
}
