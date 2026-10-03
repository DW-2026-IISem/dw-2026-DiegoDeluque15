import { Pago } from "./pago.model";
import { Carrera } from "../carrera/carrera.model";

const METODOS = ["efectivo", "tarjeta", "transferencia", "nequi"];

export async function seedPagos(): Promise<number> {
  const existing = await Pago.count();
  if (existing > 0) {
    console.log(`  pagos: ya hay ${existing} registro(s), se omite seeder`);
    return 0;
  }

  // Solo carreras cerradas — el count real depende de cuántas haya
  const carrerasCerradas = await Carrera.findAll({
    where: { estado: "cerrada" },
    attributes: ["id", "total"],
  });

  if (!carrerasCerradas.length) {
    console.log("  pagos: no hay carreras cerradas, se omite seeder");
    return 0;
  }

  const rows = carrerasCerradas.map((c, i) => ({
    referencia_tipo: "carrera",
    referencia_id:   c.id,
    metodo:          METODOS[i % METODOS.length],
    monto:           Number(c.total),
    fecha:           new Date(),
    estado:          "registrado",
  }));

  await Pago.bulkCreate(rows);
  console.log(`  pagos: insertados ${rows.length} registro(s) (uno por carrera cerrada)`);
  return rows.length;
}
