import { Driver } from "./driver.model";
import { Company } from "../company/company.model";

/**
 * Associations for Driver feature.
 * Loaded from `config/index.ts` AFTER both models are defined.
 */
export function setupDriverAssociations(): void {
  Driver.belongsTo(Company, {
    foreignKey: "company_id",
    as: "company",
  });

  Company.hasMany(Driver, {
    foreignKey: "company_id",
    as: "drivers",
  });
}
