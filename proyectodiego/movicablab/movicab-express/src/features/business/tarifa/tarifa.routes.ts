import { Application } from "express";
import { TarifaController } from "./tarifa.controller";

export class TarifaRoutes {
  public tarifaController: TarifaController = new TarifaController();

  public routes(app: Application): void {
    app.route("/api/tarifas/vigente")
      .get(this.tarifaController.getVigente.bind(this.tarifaController));

    app.route("/api/tarifas")
      .get(this.tarifaController.getAll.bind(this.tarifaController))
      .post(this.tarifaController.create.bind(this.tarifaController));

    app.route("/api/tarifas/:id")
      .get(this.tarifaController.getOne.bind(this.tarifaController))
      .put(this.tarifaController.updatePut.bind(this.tarifaController))
      .patch(this.tarifaController.updatePatch.bind(this.tarifaController))
      .delete(this.tarifaController.deletePhysical.bind(this.tarifaController));

    app.route("/api/tarifas/:id/deactivate")
      .patch(this.tarifaController.deleteLogical.bind(this.tarifaController));
  }
}
