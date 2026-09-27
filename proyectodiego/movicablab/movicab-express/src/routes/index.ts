import { PasajeroRoutes } from "../features/business/pasajero/pasajero.routes";
import { TipoVehiculoRoutes } from "../features/business/tipo-vehiculo/tipo-vehiculo.routes";

export class Routes {
  public pasajeroRoutes: PasajeroRoutes = new PasajeroRoutes();
  public vehiculoTypeRoutes: TipoVehiculoRoutes = new TipoVehiculoRoutes();
}