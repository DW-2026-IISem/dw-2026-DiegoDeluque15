import dotenv from "dotenv";
import express, { Application } from "express";
import morgan from "morgan";
var cors = require("cors");
import { sequelize, getDatabaseInfo, testConnection } from "../database/db";
import "../features/business/pasajero/pasajero.model";
import "../features/business/tipo-vehiculo/tipo-vehiculo.model";
import "../features/business/empresa/empresa.model";
import "../features/business/conductor/conductor.model";
import "../features/business/vehiculo/vehiculo.model";
import "../features/business/turno/turno.model";
import { Routes } from "../routes/index";
import { setupSwagger } from "../swagger/index";
import { setupConductorAssociations } from "../features/business/conductor/conductor.associations";
import { setupVehiculoAssociations } from "../features/business/vehiculo/vehiculo.associations";
import { setupTurnoAssociations } from "../features/business/turno/turno.associations";

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
    this.routePrv.pasajeroRoutes.routes(this.app);
    this.routePrv.vehiculoTypeRoutes.routes(this.app);
    this.routePrv.empresaRoutes.routes(this.app);
    this.routePrv.conductorRoutes.routes(this.app);
    this.routePrv.vehiculoRoutes.routes(this.app);
    this.routePrv.turnoRoutes.routes(this.app);
  }

  private associations(): void {
    setupConductorAssociations();
    setupVehiculoAssociations();
    setupTurnoAssociations();
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

      await sequelize.sync({ force: false, alter: true });
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