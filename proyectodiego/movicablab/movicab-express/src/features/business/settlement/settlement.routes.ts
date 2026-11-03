import { Application } from "express";
import { SettlementController } from "./settlement.controller";
import { authenticate, authorize } from "../../auth/access";

export class SettlementRoutes {
  public settlementController: SettlementController = new SettlementController();

  public routes(app: Application): void {
    app.route("/api/liquidaciones")
      .get(authenticate, authorize, this.settlementController.getAll.bind(this.settlementController))
      .post(authenticate, authorize, this.settlementController.create.bind(this.settlementController));

    app.route("/api/liquidaciones/:id")
      .get(authenticate, authorize, this.settlementController.getOne.bind(this.settlementController));
  }
}
