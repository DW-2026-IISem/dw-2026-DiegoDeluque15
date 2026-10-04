import { Application } from "express";
import { TarifaController } from "./tarifa.controller";
import { authenticate, authorize } from "../../auth/access";


export class TarifaRoutes {
  public tarifaController: TarifaController = new TarifaController();

  public routes(app: Application): void {
    app.route("/api/tarifas/vigente")
      .get(authenticate, authorize, this.tarifaController.getVigente.bind(this.tarifaController));

    app.route("/api/tarifas")
      .get(authenticate, authorize, this.tarifaController.getAll.bind(this.tarifaController))
      .post(authenticate, authorize, this.tarifaController.create.bind(this.tarifaController));

    app.route("/api/tarifas/:id")
      .get(authenticate, authorize, this.tarifaController.getOne.bind(this.tarifaController))
      .put(authenticate, authorize, this.tarifaController.updatePut.bind(this.tarifaController))
      .patch(authenticate, authorize, this.tarifaController.updatePatch.bind(this.tarifaController))
      .delete(authenticate, authorize, this.tarifaController.deletePhysical.bind(this.tarifaController));

    app.route("/api/tarifas/:id/deactivate")
      .patch(authenticate, authorize, this.tarifaController.deleteLogical.bind(this.tarifaController));
  }
}
