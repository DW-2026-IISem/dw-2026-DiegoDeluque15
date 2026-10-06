import { Turno } from "./turno.model";
import { Conductor } from "../conductor/conductor.model";
import { Vehiculo } from "../vehiculo/vehiculo.model";

export async function seedTurnos(count: number): Promise<number> {
  if (count <= 0) {
    console.log("  turnos: count=0, se omite");
    return 0;
  }

  const existing = await Turno.count();
  if (existing > 0) {
    console.log(`  turnos: ya hay ${existing} registro(s), se omite seeder`);
    return 0;
  }

  const conductores = await Conductor.findAll({ where: { status: "active" }, attributes: ["id"] });
  const vehiculos = await Vehiculo.findAll({ where: { status: "active" }, attributes: ["id"] });

  if (conductores.length === 0 || vehiculos.length === 0) {
    console.log("  turnos: faltan conductores o vehiculos active, se omite seeder");
    return 0;
  }

  const maxTurnos = Math.min(count, conductores.length, vehiculos.length);
  const rows = [];
  
  for (let i = 0; i < maxTurnos; i++) {
    rows.push({
      nombre: `Turno ${i + 1}`,
      descripcion: `Turno generado automaticamente ${i + 1}`,
      conductor_id: conductores[i].id,
      vehiculo_id: vehiculos[i].id,
      status: "active" as const,
    });
  }

  await Turno.bulkCreate(rows);
  console.log(`  turnos: insertados ${maxTurnos} registro(s) falsos`);
  return maxTurnos;
}
