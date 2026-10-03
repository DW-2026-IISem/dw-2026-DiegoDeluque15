import { Application } from "express";
import { LiquidacionController } from "./liquidacion.controller";

export class LiquidacionRoutes {
  public liqController: LiquidacionController = new LiquidacionController();

  public routes(app: Application): void {
    app.route("/api/liquidaciones")
      .get(this.liqController.getAll.bind(this.liqController))
      .post(this.liqController.create.bind(this.liqController));

    app.route("/api/liquidaciones/:id")
      .get(this.liqController.getOne.bind(this.liqController));
    // SIN update (PUT/PATCH) ni delete
  }
}
