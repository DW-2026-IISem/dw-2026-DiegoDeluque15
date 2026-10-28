import { Rating } from "./rating.model";
import { Trip } from "../trip/trip.model";

export function setupRatingAssociations(): void {
  Rating.belongsTo(Trip, { foreignKey: "trip_id", as: "trip" });
  Trip.hasOne(Rating, { foreignKey: "trip_id", as: "rating" });
}
