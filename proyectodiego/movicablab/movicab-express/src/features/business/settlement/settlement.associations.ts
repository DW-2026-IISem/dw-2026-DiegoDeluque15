import { Settlement } from "./settlement.model";
import { Driver } from "../driver/driver.model";
import { Trip } from "../trip/trip.model";

export function setupSettlementAssociations(): void {
  Settlement.belongsTo(Driver, { foreignKey: "driver_id", as: "driver" });
  Driver.hasMany(Settlement, { foreignKey: "driver_id", as: "settlements" });

  Trip.belongsTo(Settlement, { foreignKey: "settlement_id", as: "settlement" });
  Settlement.hasMany(Trip, { foreignKey: "settlement_id", as: "trips" });
}
