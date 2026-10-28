import dotenv from "dotenv";
import express, { Application } from "express";
import morgan from "morgan";
var cors = require("cors");
import { sequelize, getDatabaseInfo, testConnection } from "../database/db";

// Business Models
import "../features/business/passenger/passenger.model";
import "../features/business/vehicle-type/vehicle-type.model";
import "../features/business/company/company.model";
import "../features/business/driver/driver.model";
import "../features/business/vehicle/vehicle.model";
import "../features/business/shift/shift.model";
import "../features/business/fare/fare.model";
import "../features/business/trip/trip.model";
import "../features/business/payment/payment.model";
import "../features/business/rating/rating.model";
import "../features/business/settlement/settlement.model";

// Business Associations
import { setupDriverAssociations } from "../features/business/driver/driver.associations";
import { setupVehicleAssociations } from "../features/business/vehicle/vehicle.associations";
import { setupShiftAssociations } from "../features/business/shift/shift.associations";
import { setupTripAssociations } from "../features/business/trip/trip.associations";
import { setupRatingAssociations } from "../features/business/rating/rating.associations";
import { setupSettlementAssociations } from "../features/business/settlement/settlement.associations";

// Fase II — Auth con RBAC
import "../features/auth/users/user.model";
import "../features/auth/roles/role.model";
import "../features/auth/resources/resource.model";
import "../features/auth/role-users/role-user.model";
import "../features/auth/resource-roles/resource-role.model";
import "../features/auth/refresh-tokens/refresh-token.model";
import "../features/auth/rbac.associations";

import { Routes } from "../routes/index";
import { setupSwagger } from "../swagger/index";

dotenv.config();

export class App {
  public app: Application;
  public routePrv: Routes = new Routes();

  constructor(private port?: number | string) {
    this.app = express();
    this.settings();
    this.middlewares();
    this.associations();
    this.routes();
    this.docs();
    this.errorHandling();
    this.dbConnection();
  }

  private settings(): void {
    this.app.set('port', this.port || process.env.PORT || 4000);
  }

  private middlewares(): void {
    this.app.use(morgan('dev'));
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));
  }

  private routes(): void {
    this.routePrv.passengerRoutes.routes(this.app);
    this.routePrv.vehicleTypeRoutes.routes(this.app);
    this.routePrv.companyRoutes.routes(this.app);
    this.routePrv.driverRoutes.routes(this.app);
    this.routePrv.vehicleRoutes.routes(this.app);
    this.routePrv.shiftRoutes.routes(this.app);
    this.routePrv.fareRoutes.routes(this.app);
    this.routePrv.tripRoutes.routes(this.app);
    this.routePrv.paymentRoutes.routes(this.app);
    this.routePrv.ratingRoutes.routes(this.app);
    this.routePrv.settlementRoutes.routes(this.app);

    // Auth & RBAC
    this.routePrv.roleUsersRoutes.routes(this.app);
    this.routePrv.resourceRolesRoutes.routes(this.app);
    this.routePrv.rolesRoutes.routes(this.app);
    this.routePrv.resourcesRoutes.routes(this.app);
    this.routePrv.usersRoutes.routes(this.app);
    this.routePrv.sessionRoutes.routes(this.app);
    this.routePrv.refreshTokensRoutes.routes(this.app);
  }

  private associations(): void {
    setupDriverAssociations();
    setupVehicleAssociations();
    setupShiftAssociations();
    setupTripAssociations();
    setupRatingAssociations();
    setupSettlementAssociations();
  }

  private errorHandling(): void {
    const bodyErrorHandler: any = (err: any, _req: any, res: any, next: any) => {
      if (err instanceof SyntaxError && "body" in err) {
        res.status(400).json({ error: "Malformed JSON body" });
        return;
      }
      next(err);
    };
    this.app.use(bodyErrorHandler);
  }

  private docs(): void {
    setupSwagger(this.app);
  }

  private async dbConnection(): Promise<void> {
    try {
      const dbInfo = getDatabaseInfo();
      console.log(`🔌 Intentando conectar a: ${dbInfo.engine.toUpperCase()}`);

      const isConnected = await testConnection();
      if (!isConnected) {
        throw new Error(`No se pudo conectar a la base de datos ${dbInfo.engine.toUpperCase()}`);
      }

      await sequelize.sync({ force: false, alter: false });
      console.log(`✅ Base de datos sincronizada exitosamente`);
    } catch (error) {
      console.error("❌ Error al conectar con la base de datos:", error);
      process.exit(1);
    }
  }

  async listen() {
    await this.app.listen(this.app.get('port'));
    console.log(`🚀 Servidor ejecutándose en puerto ${this.app.get('port')}`);
  }
}
