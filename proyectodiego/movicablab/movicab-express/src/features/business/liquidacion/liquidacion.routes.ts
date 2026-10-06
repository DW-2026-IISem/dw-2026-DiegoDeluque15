import { Application } from "express";
import { LiquidacionController } from "./liquidacion.controller";
import { authenticate, authorize } from "../../auth/access";


export class LiquidacionRoutes {
  public liqController: LiquidacionController = new LiquidacionController();

  public routes(app: Application): void {
    app.route("/api/liquidaciones")
      .get(authenticate, authorize, this.liqController.getAll.bind(this.liqController))
      .post(authenticate, authorize, this.liqController.create.bind(this.liqController));

    app.route("/api/liquidaciones/:id")
      .get(authenticate, authorize, this.liqController.getOne.bind(this.liqController));
    // SIN update (PUT/PATCH) ni delete
  }
}
