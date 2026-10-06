import { Application } from "express";
import { EmpresaController } from "./empresa.controller";
import { authenticate, authorize } from "../../auth/access";


export class EmpresaRoutes {
  public empresaController: EmpresaController = new EmpresaController();

  public routes(app: Application): void {
    // ================== RUTAS SIN AUTENTICACION / SIN MIDDLEWARE JWT ==================

    // getAll
    app
      .route("/api/empresas")
      .get(authenticate, authorize, this.empresaController.getAll.bind(this.empresaController));

    // getOne
    app
      .route("/api/empresas/:id")
      .get(authenticate, authorize, this.empresaController.getOne.bind(this.empresaController));

    // create
    app
      .route("/api/empresas")
      .post(authenticate, authorize, this.empresaController.create.bind(this.empresaController));

    // update (PUT / PATCH)
    app
      .route("/api/empresas/:id")
      .put(authenticate, authorize, this.empresaController.updatePut.bind(this.empresaController))
      .patch(authenticate, authorize, this.empresaController.updatePatch.bind(this.empresaController));

    // delete fisico
    app
      .route("/api/empresas/:id")
      .delete(authenticate, authorize, this.empresaController.deletePhysical.bind(this.empresaController));

    // delete logico
    app
      .route("/api/empresas/:id/deactivate")
      .patch(authenticate, authorize, this.empresaController.deleteLogical.bind(this.empresaController));
  }
}
