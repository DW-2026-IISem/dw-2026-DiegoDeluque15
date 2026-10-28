import { Fare } from "./fare.model";

export async function seedFares(count: number): Promise<number> {
  if (count <= 0) return 0;

  const existing = await Fare.count();
  if (existing > 0) {
    console.log(`  fares: ${existing} record(s) already exist, skipping seeder`);
    return 0;
  }

  const rows = [];
  let currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  // Start 15 days in the past so first fare covers today
  let startDate = new Date(currentDate.getTime() - 15 * 24 * 60 * 60 * 1000);

  for (let i = 0; i < count; i++) {
    let endDate = new Date(startDate.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days
    rows.push({
      name: `Fare ${i + 1}`,
      calculation_rule: `Base rule + ${i * 5}km`,
      base_value: 50.0 + i * 10,
      valid_from: startDate,
      valid_until: endDate,
      status: "active" as const,
    });
    startDate = new Date(endDate.getTime() + 1000);
  }

  await Fare.bulkCreate(rows);
  console.log(`  fares: inserted ${count} record(s) without overlap`);
  return count;
}
