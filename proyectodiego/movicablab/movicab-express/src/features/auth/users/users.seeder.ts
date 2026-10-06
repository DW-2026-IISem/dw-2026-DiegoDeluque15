import { User } from "./user.model";
import { faker } from "@faker-js/faker";

/**
 * Seeder de usuarios (`users`).
 *
 * Crea **dos usuarios canónicos** que sostienen toda la demostración de RBAC:
 *
 * | username | password    | rol    | permisos |
 * |----------|-------------|--------|----------|
 * | `admin`  | `Admin123!` | ADMIN  | 58 recursos |
 * | `seller` | `Seller123!`| SELLER | 7 recursos |
 *
 * Si `count > 2`, se añaden usuarios aleatorios (sin rol asignado): sirven para
 * comprobar que **estar autenticado no basta**: recibirán 403 en todo.
 *
 * Las contraseñas se guardan como **hash**: las hashea el hook `beforeCreate` del
 * modelo. Idempotente por `username`.
 */
export const SEED_USERS = [
  { username: "admin", email: "admin@storelab.local", password: "Admin123!" },
  { username: "seller", email: "seller@storelab.local", password: "Seller123!" },
] as const;

export async function seedUsers(count: number): Promise<number> {
  if (count <= 0) {
    console.log("⏭️  users: count=0, se omite");
    return 0;
  }

  let created = 0;

  for (const item of SEED_USERS) {
    const [user, wasCreated] = await User.findOrCreate({
      where: { username: item.username },
      defaults: {
        username: item.username,
        email: item.email,
        password: item.password,
        avatar: null,
        status: "active",
      },
    });
    if (wasCreated) {
      created++;
      continue;
    }
    // Reconciliación: igual que los seeders de roles y recursos, el de usuarios
    // **reactiva** los canónicos si quedaron inactivos. Así `npm run db:seed`
    // devuelve siempre el laboratorio a un estado operable.
    if (user.status !== "active") {
      await user.update({ status: "active" });
    }
  }

  const extras = Math.max(0, count - SEED_USERS.length);
  for (let i = 0; i < extras; i++) {
    const username = `user.${i}.${faker.string.alphanumeric(6)}`.toLowerCase();
    await User.create({
      username,
      email: `${username}@example.com`,
      password: "Password123!",
      avatar: null,
      status: "active",
    });
    created++;
  }

  console.log(`✅ users: insertados ${created} usuario(s) (2 canónicos + ${extras} aleatorios)`);
  return created;
}
