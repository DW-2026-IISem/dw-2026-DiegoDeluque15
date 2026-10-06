const fs = require("fs");
let swagger = fs.readFileSync("src/swagger/index.ts", "utf8");

let target = `"API MoviCab (Express + Sequelize) con **Auth con RBAC**.

**Las tres modalidades de acceso**:
- **OPEN**: /api/sesion/login, /refresh, /logout.
- **JWT**: /api/sesion/perfil, /api/permisos, /api/sesiones/*.
- **JWT + RBAC**: CRUD de negocio.

Credenciales de laboratorio:  dmin / Admin123! y seller / Seller123!."`;

let replacement = `\`API MoviCab (Express + Sequelize) con **Auth con RBAC**.

**Las tres modalidades de acceso**:
- **OPEN**: /api/sesion/login, /refresh, /logout.
- **JWT**: /api/sesion/perfil, /api/permisos, /api/sesiones/*.
- **JWT + RBAC**: CRUD de negocio.

Credenciales de laboratorio:  admin / Admin123! y seller / Seller123!\``;

swagger = swagger.replace(target, replacement);
fs.writeFileSync("src/swagger/index.ts", swagger);
console.log("Fixed quotes");
