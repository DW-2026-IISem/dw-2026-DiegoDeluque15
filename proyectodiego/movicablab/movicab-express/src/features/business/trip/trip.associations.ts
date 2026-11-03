import { Trip } from "./trip.model";
import { Passenger } from "../passenger/passenger.model";
import { Shift } from "../shift/shift.model";
import { Fare } from "../fare/fare.model";

export function setupTripAssociations(): void {
  Trip.belongsTo(Passenger, { foreignKey: "passenger_id", as: "passenger" });
  Passenger.hasMany(Trip, { foreignKey: "passenger_id", as: "trips" });

  Trip.belongsTo(Shift, { foreignKey: "shift_id", as: "shift" });
  Shift.hasMany(Trip, { foreignKey: "shift_id", as: "trips" });

  Trip.belongsTo(Fare, { foreignKey: "fare_id", as: "fare" });
  Fare.hasMany(Trip, { foreignKey: "fare_id", as: "trips" });
}
