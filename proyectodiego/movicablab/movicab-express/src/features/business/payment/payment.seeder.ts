import { Payment } from "./payment.model";
import { Trip } from "../trip/trip.model";

const METHODS = ["efectivo", "tarjeta", "transferencia", "nequi"];

export async function seedPayments(): Promise<number> {
  const existing = await Payment.count();
  if (existing > 0) {
    console.log(`  payments: ya hay ${existing} registro(s), se omite seeder`);
    return 0;
  }

  // Solo trips cerradas
  const closedTrips = await Trip.findAll({
    where: { status: "cerrada" },
    attributes: ["id", "total"],
  });

  if (!closedTrips.length) {
    console.log("  payments: no hay trips cerradas, se omite seeder");
    return 0;
  }

  const rows = closedTrips.map((c, i) => ({
    reference_type: "carrera",
    reference_id:   c.id,
    payment_method: METHODS[i % METHODS.length],
    amount:         Number(c.total),
    paid_at:        new Date(),
    status:         "registrado",
  }));

  await Payment.bulkCreate(rows);
  console.log(`  payments: insertados ${rows.length} registro(s) (uno por trip cerrada)`);
  return rows.length;
}
