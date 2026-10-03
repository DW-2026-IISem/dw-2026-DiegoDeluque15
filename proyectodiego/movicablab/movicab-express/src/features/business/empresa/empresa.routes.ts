import { Application } from "express";
import { EmpresaController } from "./empresa.controller";

export class EmpresaRoutes {
  public empresaController: EmpresaController = new EmpresaController();

  public routes(app: Application): void {
    // ================== RUTAS SIN AUTENTICACION / SIN MIDDLEWARE JWT ==================

    // getAll
    app
      .route("/api/empresas")
      .get(this.empresaController.getAll.bind(this.empresaController));

    // getOne
    app
      .route("/api/empresas/:id")
      .get(this.empresaController.getOne.bind(this.empresaController));

    // create
    app
      .route("/api/empresas")
      .post(this.empresaController.create.bind(this.empresaController));

    // update (PUT / PATCH)
    app
      .route("/api/empresas/:id")
      .put(this.empresaController.updatePut.bind(this.empresaController))
      .patch(this.empresaController.updatePatch.bind(this.empresaController));

    // delete fisico
    app
      .route("/api/empresas/:id")
      .delete(this.empresaController.deletePhysical.bind(this.empresaController));

    // delete logico
    app
      .route("/api/empresas/:id/deactivate")
      .patch(this.empresaController.deleteLogical.bind(this.empresaController));
  }
}
