import { Application } from "express";
import { CarreraController } from "./carrera.controller";
import { authenticate, authorize } from "../../auth/access";


export class CarreraRoutes {
  public carreraController: CarreraController = new CarreraController();

  public routes(app: Application): void {
    app.route("/api/carreras")
      .get(authenticate, authorize, this.carreraController.getAll.bind(this.carreraController))
      .post(authenticate, authorize, this.carreraController.create.bind(this.carreraController));

    // /estado ANTES de /:id para que Express no lo confunda
    app.route("/api/carreras/:id/estado")
      .patch(authenticate, authorize, this.carreraController.cambiarEstado.bind(this.carreraController));

    app.route("/api/carreras/:id")
      .get(authenticate, authorize, this.carreraController.getOne.bind(this.carreraController))
      .patch(authenticate, authorize, this.carreraController.updatePatch.bind(this.carreraController))
      .delete(authenticate, authorize, this.carreraController.deletePhysical.bind(this.carreraController));
  }
}
