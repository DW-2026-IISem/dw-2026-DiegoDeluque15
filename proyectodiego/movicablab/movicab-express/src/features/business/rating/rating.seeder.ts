import { Rating } from "./rating.model";
import { Trip } from "../trip/trip.model";
import { faker } from "@faker-js/faker";

export async function seedRatings(): Promise<number> {
  const existing = await Rating.count();
  if (existing > 0) {
    console.log(`  ratings: ya hay ${existing} registro(s), se omite seeder`);
    return 0;
  }

  // Trips cerradas
  const closedTrips = await Trip.findAll({ where: { status: "cerrada" }, attributes: ["id"] });
  if (!closedTrips.length) {
    console.log("  ratings: no hay trips cerradas, se omite seeder");
    return 0;
  }

  const rows = closedTrips.map(c => ({
    trip_id: c.id,
    score:   faker.number.int({ min: 1, max: 5 }),
    comment: faker.lorem.sentence(),
    status:  "active" as const,
  }));

  await Rating.bulkCreate(rows);
  console.log(`  ratings: insertados ${rows.length} registro(s)`);
  return rows.length;
}
