import { sequelize } from "../../database/db";
import { Transaction } from "sequelize";

/**
 * Ejecuta `fn` dentro de una transacción Sequelize.
 * Si `fn` lanza, hace rollback automático; si termina con éxito, hace commit.
 */
export async function withTransaction<T>(
  fn: (transaction: Transaction) => Promise<T>
): Promise<T> {
  return sequelize.transaction(fn);
}
