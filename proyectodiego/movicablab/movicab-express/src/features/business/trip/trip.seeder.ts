import { Trip } from "./trip.model";
import { Passenger } from "../passenger/passenger.model";
import { Shift } from "../shift/shift.model";
import { Fare } from "../fare/fare.model";

export async function seedTrips(count: number): Promise<number> {
  if (count <= 0) return 0;

  const existing = await Trip.count();
  if (existing > 0) {
    console.log(`  trips: ya hay ${existing} registro(s), se omite seeder`);
    return 0;
  }

  const passengers = await Passenger.findAll({ attributes: ["id"] });
  const shifts     = await Shift.findAll({ where: { status: "active" }, attributes: ["id"] });
  const fares      = await Fare.findAll({ where: { status: "active" }, attributes: ["id", "base_value"] });

  if (!passengers.length || !shifts.length || !fares.length) {
    console.log("  trips: faltan dependencias, se omite seeder");
    return 0;
  }

  const max = Math.min(count, passengers.length, shifts.length);
  const rows: any[] = [];

  const statusDistribution = [
    "cerrada", "cerrada", "cerrada",
    "en_curso", "aceptada", "solicitada",
    "cancelada", "cerrada", "aceptada", "solicitada",
  ];

  for (let i = 0; i < max; i++) {
    const status = statusDistribution[i % statusDistribution.length] as any;
    const fare = fares[i % fares.length];
    const valor = Number(fare.base_value);

    const startedAt = new Date(Date.now() - (i + 1) * 3600 * 1000); // hace N horas
    const endedAt   = status === "cerrada" ? new Date(startedAt.getTime() + 1800 * 1000) : null;
    const total     = status === "cerrada" ? valor : null;

    rows.push({
      passenger_id:  passengers[i % passengers.length].id,
      shift_id:      shifts[i % shifts.length].id,
      fare_id:       fare.id,
      started_at:    startedAt,
      ended_at:      endedAt,
      total:         total,
      status:        status,
      notes:         `Trip seed #${i + 1}`,
      settlement_id: null,
    });
  }

  await Trip.bulkCreate(rows);
  console.log(`  trips: insertados ${max} registro(s) en distintos status`);
  return max;
}
