import { PasajeroRoutes } from "../features/business/pasajero/pasajero.routes";
import { TipoVehiculoRoutes } from "../features/business/tipo-vehiculo/tipo-vehiculo.routes";
import { EmpresaRoutes } from "../features/business/empresa/empresa.routes";
import { ConductorRoutes } from "../features/business/conductor/conductor.routes";
import { VehiculoRoutes } from "../features/business/vehiculo/vehiculo.routes";
import { TurnoRoutes } from "../features/business/turno/turno.routes";

export class Routes {
  public pasajeroRoutes: PasajeroRoutes = new PasajeroRoutes();
  public vehiculoTypeRoutes: TipoVehiculoRoutes = new TipoVehiculoRoutes();
  public empresaRoutes: EmpresaRoutes = new EmpresaRoutes();
  public conductorRoutes: ConductorRoutes = new ConductorRoutes();
  public vehiculoRoutes: VehiculoRoutes = new VehiculoRoutes();
  public turnoRoutes: TurnoRoutes = new TurnoRoutes();
}
