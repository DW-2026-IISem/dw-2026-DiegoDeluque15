import { PasajeroRoutes } from "../features/business/pasajero/pasajero.routes";
import { TipoVehiculoRoutes } from "../features/business/tipo-vehiculo/tipo-vehiculo.routes";
import { EmpresaRoutes } from "../features/business/empresa/empresa.routes";
import { ConductorRoutes } from "../features/business/conductor/conductor.routes";
import { VehiculoRoutes } from "../features/business/vehiculo/vehiculo.routes";
import { RoleUsersRoutes } from "../features/auth/role-users/role-users.routes";
import { ResourceRolesRoutes } from "../features/auth/resource-roles/resource-roles.routes";
import { RolesRoutes } from "../features/auth/roles/roles.routes";
import { ResourcesRoutes } from "../features/auth/resources/resources.routes";
import { UsersRoutes } from "../features/auth/users/users.routes";
import { TurnoRoutes } from "../features/business/turno/turno.routes";
import { TarifaRoutes } from "../features/business/tarifa/tarifa.routes";
import { CarreraRoutes } from "../features/business/carrera/carrera.routes";
import { PagoRoutes } from "../features/business/pago/pago.routes";
import { CalificacionRoutes } from "../features/business/calificacion/calificacion.routes";
import { LiquidacionRoutes } from "../features/business/liquidacion/liquidacion.routes";

export class Routes {
  public pasajeroRoutes: PasajeroRoutes = new PasajeroRoutes();
  public vehiculoTypeRoutes: TipoVehiculoRoutes = new TipoVehiculoRoutes();
  public empresaRoutes: EmpresaRoutes = new EmpresaRoutes();
  public conductorRoutes: ConductorRoutes = new ConductorRoutes();
  public vehiculoRoutes: VehiculoRoutes = new VehiculoRoutes();
  public roleUsersRoutes: RoleUsersRoutes = new RoleUsersRoutes();
  public resourceRolesRoutes: ResourceRolesRoutes = new ResourceRolesRoutes();
  public rolesRoutes: RolesRoutes = new RolesRoutes();
  public resourcesRoutes: ResourcesRoutes = new ResourcesRoutes();
  public usersRoutes: UsersRoutes = new UsersRoutes();
  public turnoRoutes: TurnoRoutes = new TurnoRoutes();
  public tarifaRoutes: TarifaRoutes = new TarifaRoutes();
  public carreraRoutes: CarreraRoutes = new CarreraRoutes();
  public pagoRoutes: PagoRoutes = new PagoRoutes();
  public calificacionRoutes: CalificacionRoutes = new CalificacionRoutes();
  public liquidacionRoutes: LiquidacionRoutes = new LiquidacionRoutes();
}
