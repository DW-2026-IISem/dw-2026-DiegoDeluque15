import { Application } from "express";
import { CompanyController } from "./company.controller";
import { authenticate, authorize } from "../../auth/access";


export class CompanyRoutes {
  public companyController: CompanyController = new CompanyController();

  public routes(app: Application): void {
    app
      .route("/api/empresas")
      .get(authenticate, authorize, this.companyController.getAll.bind(this.companyController));

    app
      .route("/api/empresas/:id")
      .get(authenticate, authorize, this.companyController.getOne.bind(this.companyController));

    app
      .route("/api/empresas")
      .post(authenticate, authorize, this.companyController.create.bind(this.companyController));

    app
      .route("/api/empresas/:id")
      .put(authenticate, authorize, this.companyController.updatePut.bind(this.companyController))
      .patch(authenticate, authorize, this.companyController.updatePatch.bind(this.companyController));

    app
      .route("/api/empresas/:id")
      .delete(authenticate, authorize, this.companyController.deletePhysical.bind(this.companyController));

    app
      .route("/api/empresas/:id/deactivate")
      .patch(authenticate, authorize, this.companyController.deleteLogical.bind(this.companyController));
  }
}
