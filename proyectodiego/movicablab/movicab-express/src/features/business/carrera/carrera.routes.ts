import { Application } from "express";
import { CarreraController } from "./carrera.controller";

export class CarreraRoutes {
  public carreraController: CarreraController = new CarreraController();

  public routes(app: Application): void {
    app.route("/api/carreras")
      .get(this.carreraController.getAll.bind(this.carreraController))
      .post(this.carreraController.create.bind(this.carreraController));

    // /estado ANTES de /:id para que Express no lo confunda
    app.route("/api/carreras/:id/estado")
      .patch(this.carreraController.cambiarEstado.bind(this.carreraController));

    app.route("/api/carreras/:id")
      .get(this.carreraController.getOne.bind(this.carreraController))
      .patch(this.carreraController.updatePatch.bind(this.carreraController))
      .delete(this.carreraController.deletePhysical.bind(this.carreraController));
  }
}
