import { Vehicle } from "./vehicle.model";
import { Company } from "../company/company.model";
import { VehicleType } from "../vehicle-type/vehicle-type.model";

/**
 * Associations for Vehicle feature.
 * Loaded from `config/index.ts` AFTER all models are defined.
 */
export function setupVehicleAssociations(): void {
  Vehicle.belongsTo(Company, {
    foreignKey: "company_id",
    as: "company",
  });

  Company.hasMany(Vehicle, {
    foreignKey: "company_id",
    as: "vehicles",
  });

  Vehicle.belongsTo(VehicleType, {
    foreignKey: "vehicle_type_id",
    as: "vehicle_type",
  });

  VehicleType.hasMany(Vehicle, {
    foreignKey: "vehicle_type_id",
    as: "vehicles",
  });
}
