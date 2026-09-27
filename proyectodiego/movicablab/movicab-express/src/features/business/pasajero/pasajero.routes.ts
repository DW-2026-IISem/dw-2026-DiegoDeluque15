import { Application } from "express";
import { PasajeroController } from "./pasajero.controller";

export class PasajeroRoutes {
  public pasajeroController: PasajeroController = new PasajeroController();

  public routes(app: Application): void {
    // ================== RUTAS SIN AUTENTICACION / SIN MIDDLEWARE JWT ==================
    // (rellenar en ISS-03-B a E)
  }
}