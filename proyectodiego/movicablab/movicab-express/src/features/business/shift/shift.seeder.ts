import { Shift } from "./shift.model";
import { Driver } from "../driver/driver.model";
import { Vehicle } from "../vehicle/vehicle.model";

export async function seedShifts(count: number): Promise<number> {
  if (count <= 0) {
    console.log("  shifts: count=0, skipped");
    return 0;
  }

  const existing = await Shift.count();
  if (existing > 0) {
    console.log(`  shifts: ${existing} record(s) already exist, skipping seeder`);
    return 0;
  }

  const drivers = await Driver.findAll({ where: { status: "active" }, attributes: ["id"] });
  const vehicles = await Vehicle.findAll({ where: { status: "active" }, attributes: ["id"] });

  if (drivers.length === 0 || vehicles.length === 0) {
    console.log("  shifts: no active drivers or vehicles, skipping seeder");
    return 0;
  }

  const maxShifts = Math.min(count, drivers.length, vehicles.length);
  const rows = [];

  for (let i = 0; i < maxShifts; i++) {
    rows.push({
      name: `Shift ${i + 1}`,
      description: `Auto-generated shift ${i + 1}`,
      driver_id: drivers[i].id,
      vehicle_id: vehicles[i].id,
      status: "active" as const,
    });
  }

  await Shift.bulkCreate(rows);
  console.log(`  shifts: inserted ${maxShifts} fake record(s)`);
  return maxShifts;
}
