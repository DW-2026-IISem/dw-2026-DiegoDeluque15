import { Application } from "express";
import { PagoController } from "./pago.controller";

export class PagoRoutes {
  public pagoController: PagoController = new PagoController();

  public routes(app: Application): void {
    app.route("/api/pagos")
      .get(this.pagoController.getAll.bind(this.pagoController))
      .post(this.pagoController.create.bind(this.pagoController));

    app.route("/api/pagos/:id")
      .get(this.pagoController.getOne.bind(this.pagoController));
    // SIN PUT / PATCH / DELETE — Pago es inmutable por diseño
  }
}
