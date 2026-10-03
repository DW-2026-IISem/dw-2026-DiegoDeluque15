import { Tarifa } from "./tarifa.model";

export async function seedTarifas(count: number): Promise<number> {
  if (count <= 0) return 0;
  
  const existing = await Tarifa.count();
  if (existing > 0) {
    console.log(`  tarifas: ya hay ${existing} registro(s), se omite seeder`);
    return 0;
  }

  const rows = [];
  // Aseguramos que la primera tarifa sea la vigente actualmente
  let currentDate = new Date();
  currentDate.setHours(0,0,0,0);
  
  // Empezar 15 dias en el pasado para que la primera tarifa cubra el "hoy"
  let startDate = new Date(currentDate.getTime() - (15 * 24 * 60 * 60 * 1000));
  
  for (let i = 0; i < count; i++) {
    let endDate = new Date(startDate.getTime() + (30 * 24 * 60 * 60 * 1000)); // duracion de 30 dias
    rows.push({
      nombre: `Tarifa ${i + 1}`,
      regla_calculo: `Regla base + ${i * 5}km`,
      valor_base: 50.0 + (i * 10),
      vigencia_desde: startDate,
      vigencia_hasta: endDate,
      status: "active" as const,
    });
    // La siguiente empieza cuando termina esta + 1 milisegundo, sin solapes (o 1 segundo)
    startDate = new Date(endDate.getTime() + 1000);
  }

  await Tarifa.bulkCreate(rows);
  console.log(`  tarifas: insertados ${count} registro(s) falsos sin solapamiento`);
  return count;
}
