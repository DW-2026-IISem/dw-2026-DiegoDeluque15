import { Calificacion } from "./calificacion.model";
import { Carrera } from "../carrera/carrera.model";
import { faker } from "@faker-js/faker";

export async function seedCalificaciones(): Promise<number> {
  const existing = await Calificacion.count();
  if (existing > 0) {
    console.log(`  calificaciones: ya hay ${existing} registro(s), se omite seeder`);
    return 0;
  }

  // Carreras cerradas (para ser calificados)
  const cerradas = await Carrera.findAll({ where: { estado: "cerrada" }, attributes: ["id"] });
  if (!cerradas.length) {
    console.log("  calificaciones: no hay carreras cerradas, se omite seeder");
    return 0;
  }

  const rows = cerradas.map(c => ({
    carrera_id: c.id,
    puntaje: faker.number.int({ min: 1, max: 5 }),
    comentario: faker.lorem.sentence(),
    status: "active" as const,
  }));

  await Calificacion.bulkCreate(rows);
  console.log(`  calificaciones: insertados ${rows.length} registro(s)`);
  return rows.length;
}
