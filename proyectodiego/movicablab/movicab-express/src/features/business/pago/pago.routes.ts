import { Application } from "express";
import { PagoController } from "./pago.controller";
import { authenticate, authorize } from "../../auth/access";


export class PagoRoutes {
  public pagoController: PagoController = new PagoController();

  public routes(app: Application): void {
    app.route("/api/pagos")
      .get(authenticate, authorize, this.pagoController.getAll.bind(this.pagoController))
      .post(authenticate, authorize, this.pagoController.create.bind(this.pagoController));

    app.route("/api/pagos/:id")
      .get(authenticate, authorize, this.pagoController.getOne.bind(this.pagoController));
    // SIN PUT / PATCH / DELETE — Pago es inmutable por diseño
  }
}
