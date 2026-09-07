// Config de conexión SOLO para sequelize-cli (no para NestJS en runtime,
// eso lo maneja database.config.ts). Lee las mismas variables del .env
// para no duplicar credenciales en dos lugares.
require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_DIALECT,
  },
};
