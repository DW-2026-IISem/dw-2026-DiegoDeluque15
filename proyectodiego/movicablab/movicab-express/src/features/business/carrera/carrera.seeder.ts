import { Carrera } from "./carrera.model";
import { Pasajero } from "../pasajero/pasajero.model";
import { Turno } from "../turno/turno.model";
import { Tarifa } from "../tarifa/tarifa.model";

export async function seedCarreras(count: number): Promise<number> {
  if (count <= 0) return 0;

  const existing = await Carrera.count();
  if (existing > 0) {
    console.log(`  carreras: ya hay ${existing} registro(s), se omite seeder`);
    return 0;
  }

  const pasajeros = await Pasajero.findAll({ attributes: ["id"] });
  const turnos    = await Turno.findAll({ where: { status: "active" }, attributes: ["id"] });
  const tarifas   = await Tarifa.findAll({ where: { status: "active" }, attributes: ["id", "valor_base"] });

  if (!pasajeros.length || !turnos.length || !tarifas.length) {
    console.log("  carreras: faltan dependencias, se omite seeder");
    return 0;
  }

  const max = Math.min(count, pasajeros.length, turnos.length);
  const rows: any[] = [];

  // Distribucion de estados: al menos 2-3 cerradas, resto variado
  const estadosDistribucion = [
    "cerrada", "cerrada", "cerrada",
    "en_curso", "aceptada", "solicitada",
    "cancelada", "cerrada", "aceptada", "solicitada",
  ];

  for (let i = 0; i < max; i++) {
    const estado = estadosDistribucion[i % estadosDistribucion.length] as any;
    const tarifa = tarifas[i % tarifas.length];
    const valor  = Number(tarifa.valor_base);

    const fechaInicio = new Date(Date.now() - (i + 1) * 3600 * 1000); // hace N horas
    const fechaFin    = estado === "cerrada" ? new Date(fechaInicio.getTime() + 1800 * 1000) : null;
    const total       = estado === "cerrada" ? valor : null;

    rows.push({
      pasajero_id:    pasajeros[i % pasajeros.length].id,
      turno_id:       turnos[i % turnos.length].id,
      tarifa_id:      tarifa.id,
      fecha_inicio:   fechaInicio,
      fecha_fin:      fechaFin,
      total:          total,
      estado:         estado,
      observaciones:  `Carrera semilla #${i + 1}`,
      liquidacion_id: null,
    });
  }

  await Carrera.bulkCreate(rows);
  console.log(`  carreras: insertados ${max} registro(s) en distintos estados`);
  return max;
}
