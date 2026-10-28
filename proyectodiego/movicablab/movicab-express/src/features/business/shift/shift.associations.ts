import { Shift } from "./shift.model";
import { Driver } from "../driver/driver.model";
import { Vehicle } from "../vehicle/vehicle.model";

export function setupShiftAssociations(): void {
  Shift.belongsTo(Driver, {
    foreignKey: "driver_id",
    as: "driver",
  });

  Driver.hasMany(Shift, {
    foreignKey: "driver_id",
    as: "shifts",
  });

  Shift.belongsTo(Vehicle, {
    foreignKey: "vehicle_id",
    as: "vehicle",
  });

  Vehicle.hasMany(Shift, {
    foreignKey: "vehicle_id",
    as: "shifts",
  });
}
