import { Application } from "express";
import { PaymentController } from "./payment.controller";
import { authenticate, authorize } from "../../auth/access";

export class PaymentRoutes {
  public paymentController: PaymentController = new PaymentController();

  public routes(app: Application): void {
    app.route("/api/pagos")
      .get(authenticate, authorize, this.paymentController.getAll.bind(this.paymentController))
      .post(authenticate, authorize, this.paymentController.create.bind(this.paymentController));

    app.route("/api/pagos/:id")
      .get(authenticate, authorize, this.paymentController.getOne.bind(this.paymentController));
  }
}
