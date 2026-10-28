import { SessionRoutes } from "../features/auth/session/session.routes";
import { RefreshTokensRoutes } from "../features/auth/refresh-tokens/refresh-tokens.routes";
import { RoleUsersRoutes } from "../features/auth/role-users/role-users.routes";
import { ResourceRolesRoutes } from "../features/auth/resource-roles/resource-roles.routes";
import { RolesRoutes } from "../features/auth/roles/roles.routes";
import { ResourcesRoutes } from "../features/auth/resources/resources.routes";
import { UsersRoutes } from "../features/auth/users/users.routes";

import { PassengerRoutes } from "../features/business/passenger/passenger.routes";
import { VehicleTypeRoutes } from "../features/business/vehicle-type/vehicle-type.routes";
import { CompanyRoutes } from "../features/business/company/company.routes";
import { DriverRoutes } from "../features/business/driver/driver.routes";
import { VehicleRoutes } from "../features/business/vehicle/vehicle.routes";
import { ShiftRoutes } from "../features/business/shift/shift.routes";
import { FareRoutes } from "../features/business/fare/fare.routes";
import { TripRoutes } from "../features/business/trip/trip.routes";
import { PaymentRoutes } from "../features/business/payment/payment.routes";
import { RatingRoutes } from "../features/business/rating/rating.routes";
import { SettlementRoutes } from "../features/business/settlement/settlement.routes";

export class Routes {
  public sessionRoutes: SessionRoutes = new SessionRoutes();
  public refreshTokensRoutes: RefreshTokensRoutes = new RefreshTokensRoutes();
  public passengerRoutes: PassengerRoutes = new PassengerRoutes();
  public vehicleTypeRoutes: VehicleTypeRoutes = new VehicleTypeRoutes();
  public companyRoutes: CompanyRoutes = new CompanyRoutes();
  public driverRoutes: DriverRoutes = new DriverRoutes();
  public vehicleRoutes: VehicleRoutes = new VehicleRoutes();
  public roleUsersRoutes: RoleUsersRoutes = new RoleUsersRoutes();
  public resourceRolesRoutes: ResourceRolesRoutes = new ResourceRolesRoutes();
  public rolesRoutes: RolesRoutes = new RolesRoutes();
  public resourcesRoutes: ResourcesRoutes = new ResourcesRoutes();
  public usersRoutes: UsersRoutes = new UsersRoutes();
  public shiftRoutes: ShiftRoutes = new ShiftRoutes();
  public fareRoutes: FareRoutes = new FareRoutes();
  public tripRoutes: TripRoutes = new TripRoutes();
  public paymentRoutes: PaymentRoutes = new PaymentRoutes();
  public ratingRoutes: RatingRoutes = new RatingRoutes();
  public settlementRoutes: SettlementRoutes = new SettlementRoutes();
}
