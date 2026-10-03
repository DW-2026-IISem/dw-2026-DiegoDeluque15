# Manual — movicab-express

Guía **única y autosuficiente** por **Issues (ISS-X)** verificables.
Express 5 + TypeScript + Sequelize, arquitectura por **features**.

> **Alcance de este laboratorio:** backend **business completo**
> (Pasajero, TipoVehiculo, Vehiculo, Carrera, CarreraVehiculo) **sin autenticación ni autorización**.
> Todas las rutas quedan **SIN AUTH**. Este archivo contiene **todos** los pasos
> (`cat >>` / **PARCHE**); no hace falta ningún otro `.md` para construir el backend.
>
> Cada **ISS** es un incremento comprobable. Los **sub-ítems** (`X.1`, `X.2`, …) son pasos técnicos.
> Versiones = `package.json` del repo.

### Cómo commitear y documentar este backend (bitácora)

Este backend se construye **incremento a incremento**, no en un solo commit. Para cada **ISS** (o incluso cada sub-ítem `X.Y` si el ISS es grande):

1. **Termina el sub-ítem** y corre su verificación (`npx tsc --noEmit`, `curl`, etc.).
2. **Toma la captura de evidencia** (terminal con el comando y su salida, o el body/response de Postman/`curl`, o Swagger UI).
3. **Anexa esa captura a la bitácora** (`docs/proceso.md` de este backend — mismo patrón que ya usas en el backend NestJS de MoviCab): una entrada por sub-ítem/ISS con fecha, qué se hizo, y la imagen.
4. **Haz el commit de ese incremento**, con mensaje tipo `feat(ISS-03-A): fundación feature pasajero` o `docs(ISS-03-A): evidencia bitácora`. Nunca subas de un solo commit varios ISS juntos.
5. **Push** al branch correspondiente de este backend en `DiegoDeluque15/dw-2026-DiegoDeluque15`.

Repite este ciclo (código → verificación → captura → bitácora → commit → push) por cada sub-ítem, en el orden del manual.

### Convención de escritura en este manual

| Caso | Cómo se indica |
|------|----------------|
| **Archivo nuevo** | Siempre con `: > ruta` + `cat >> ruta << 'EOF'` … `EOF` (no basta con “crear el archivo”) |
| **Archivo ya existe** | Señalado como **PARCHE**. Indica **qué añadir/cambiar** y el ancla: **debajo de …** / **encima de …** / **dentro de …** / **reemplazar …** |
| **npm / carpetas** | Comandos `npm install`, `mkdir -p`, etc. |
| **Cierre de ISS** | Desde **ISS-01**, el último paso del ISS es `npm run dev` (el servidor debe arrancar). ISS-00 aún no tiene app. |

---

## Cómo usar este manual

| Concepto | Significado |
|----------|-------------|
| **ISS-X** | Unidad de trabajo con entrega demostrable |
| **Sub-ítem X.Y** | Paso dentro del ISS (npm, carpetas, archivo, parche…) |
| **DoR** | Listo para empezar el ISS |
| **DoD** | Listo para cerrar el ISS (todos los sub-ítems + verificación global) |
| **Bloqueado por** | ISS previos que deben estar Done |

### Definition of Ready (DoR)

- [ ] Leíste el objetivo y los **criterios de aceptación del ISS** (incluye todos los sub-ítems)
- [ ] Los ISS bloqueadores están cerrados
- [ ] Tienes herramientas / `.env` que el ISS pide
- [ ] Sabes cómo verificar el resultado final del ISS

### Definition of Done (DoD)

- [ ] **Todos** los criterios de aceptación del ISS (lista consolidada) cumplidos
- [ ] Código/carpetas en las rutas indicadas
- [ ] `npx tsc --noEmit` OK si hubo TypeScript
- [ ] Verificación global del ISS ejecutada
- [ ] Desde **ISS-01**: `npm run dev` arranca el servidor sin error (cierre del ISS)
- [ ] Evidencia alineada con lo construido

### Mapa

```text
1.  ISS-00     Requisitos previos
2.  ISS-01     Esqueleto del proyecto           (2.1 … 2.5)
3.  ISS-02     Infraestructura de BD            (3.1 … 3.3)
4.  ISS-03-A   Feature Pasajero — fundación
5.  ISS-03-B   Feature Pasajero — GetAll / GetOne
6.  ISS-03-C   Feature Pasajero — Crear
7.  ISS-03-D   Feature Pasajero — Update PUT/PATCH
8.  ISS-03-E   Feature Pasajero — Delete físico / lógico
9.  ISS-04     Seeders Faker (feature + runner) (9.1 … 9.2)
10. ISS-05     Swagger OpenAPI (feature + registry) → `/api/docs`
11. ISS-06     Feature TipoVehiculo              (11.1 … 11.6)
12. ISS-07     Feature Empresa                   (A…D)
13. ISS-08     Feature Conductor + relación Empresa (A…D + R)
14. ISS-09     Feature Vehiculo + relación Empresa/TipoVehiculo (A…D + R)
15. ISS-10     Feature Turno + relación Conductor/Vehiculo (A…D + R)
16. ISS-11     Feature Tarifa                    (A…D + endpoint /vigente)
17. ISS-12     Feature Carrera + relaciones (Pasajero/Turno/Tarifa) + endpoint /estado
18. ISS-13     Feature Pago (inmutable, sin FK física a Carrera)
19. ISS-14     Feature Calificacion + relación Carrera (0..1)
20. ISS-15     Feature Liquidacion (transaccional, agrupa Carreras por Conductor)
21. ISS-16     Fase III — Auth base: seguridad y 6 modelos RBAC         (= ISS-09 oficial)
22. ISS-17     Fase III — Feature Users                                (= ISS-10 oficial)
23. ISS-18     Fase III — Features Roles y Resources                   (= ISS-11 oficial)
24. ISS-19     Fase III — Features RoleUsers y ResourceRoles           (= ISS-12 oficial)
25. ISS-20     Fase III — Middlewares de acceso (3 modalidades)         (= ISS-13 oficial)
26. ISS-21     Fase III — Feature RefreshTokens (sesiones)              (= ISS-14 oficial)
27. ISS-22     Fase III — Feature Session (login/refresh/logout/perfil) (= ISS-15 oficial)
28.            Cierre Fase III — Auth con RBAC (backend completo)      (= Cierre-Auth oficial)
29.            Estructura final del repo + verificación global (Fase I+II, sin Auth)
30.            Referencia de paquetes (Fase I+II, sin Auth)
```

```text
ISS-00 → … → ISS-06 → ISS-07 → ISS-08 (+R) → ISS-09 (+R) → ISS-10 (+R) →
ISS-11 → ISS-12 (+R) → ISS-13 → ISS-14 (+R) → ISS-15 → DONE (dominio completo SIN AUTH)
```

| ISS | Entrega verificable (cierre) |
|-----|------------------------------|
| **00** | Node/npm/BD disponibles |
| **01** | App TypeScript arrancable |
| **02** | Sequelize + `.env` + carpeta `seeders/` |
| **03-A…E** | Pasajero CRUD + http (**SIN AUTH**) |
| **04** | Seeder Pasajero + SeedersRunner |
| **05** | Swagger UI `/api/docs` |
| **06** | TipoVehiculo CRUD + seeder + swagger `/api/tipos-vehiculo` |
| **07** | Empresa CRUD `/api/empresas` |
| **08** | Conductor CRUD + **relación** Empresa `/api/conductores` |
| **09** | Vehiculo CRUD + **relación** Empresa (obligatoria) + TipoVehiculo (opcional) `/api/vehiculos` |
| **10** | Turno CRUD + **relación** Conductor + Vehiculo (un turno activo por c/u) `/api/turnos` |
| **11** | Tarifa CRUD + validación de no-solape de vigencias `/api/tarifas` + `/api/tarifas/vigente` |
| **12** | Carrera CRUD + máquina de estados `/api/carreras` + `PATCH /api/carreras/:id/estado` |
| **13** | Pago (create + get, inmutable) `/api/pagos` |
| **14** | Calificacion CRUD + regla 0..1 por Carrera cerrada `/api/calificaciones` |
| **15** | Liquidacion (create transaccional, agrupa por conductor/rango) `/api/liquidaciones` |

### Entidades / tablas cubiertas por ISS (business — dominio completo)

| Tabla BD | Clase | Feature | ISS | API |
|----------|-------|---------|-----|-----|
| `pasajeros` | Pasajero | `pasajero/` | ISS-03-A…E (+04 seeder, +05 swagger) | `/api/pasajeros` |
| `tipos_vehiculo` | TipoVehiculo | `tipo-vehiculo/` | ISS-06 | `/api/tipos-vehiculo` |
| `empresas` | Empresa | `empresa/` | ISS-07 | `/api/empresas` |
| `conductores` | Conductor | `conductor/` | ISS-08 (+R) | `/api/conductores` |
| `vehiculos` | Vehiculo | `vehiculo/` | ISS-09 (+R) | `/api/vehiculos` |
| `turnos` | Turno | `turno/` | ISS-10 (+R) | `/api/turnos` |
| `tarifas` | Tarifa | `tarifa/` | ISS-11 | `/api/tarifas` |
| `carreras` | Carrera | `carrera/` | ISS-12 (+R) | `/api/carreras` |
| `pagos` | Pago | `pago/` | ISS-13 | `/api/pagos` |
| `calificaciones` | Calificacion | `calificacion/` | ISS-14 (+R) | `/api/calificaciones` |
| `liquidaciones` | Liquidacion | `liquidacion/` | ISS-15 | `/api/liquidaciones` |

> **Nota de alcance:** `TipoVehiculo` no existe en el SDD real de la pista con IA (ahí `Vehiculo` va
> directo con `empresa_id`, sin tipo). Se conserva porque ya estaba construido (ISS-06); `Vehiculo`
> (ISS-09) lleva `empresa_id` obligatoria (del SDD real) **y además** `tipo_vehiculo_id` opcional
> (para reaprovechar ISS-06). Toda entidad de ISS-07 en adelante usa `status` (`active`\|`inactive`),
> igual que Pasajero y TipoVehiculo — no `is_active` — para no mezclar dos convenciones en el mismo backend.

Todas las tablas: `id` + `status` (`active`\|`inactive`) + `timestamps`, salvo `pagos` y `liquidaciones`
(inmutables, sin soft delete). FKs y columnas en **snake_case**.



# 1. ISS-00 — Requisitos previos

**Objetivo:** entorno listo para el laboratorio.  
**Bloqueado por:** ninguno.

### Criterios de aceptación (ISS-00)

- [ ] `node -v` muestra v20+ (lab: v24.x)
- [ ] `npm -v` responde
- [ ] Motor de BD accesible (MySQL recomendado para el primer `sync`)

### Pasos

```bash
node -v
npm -v
```

### Verificación del ISS

```bash
node -v && npm -v
```

---

# 2. ISS-01 — Esqueleto del proyecto

**Objetivo:** proyecto npm + TypeScript + Express con estructura `features/` y servidor HTTP base.  
**Bloqueado por:** ISS-00.

### Criterios de aceptación (ISS-01) — consolidados

- [ ] **2.1** Existe `package.json` con `"type": "commonjs"` y scripts `build` / `dev`
- [ ] **2.2** Árbol `src/` con `config`, `database/seeders`, `routes`, `features/business/pasajero` (auth **fuera de alcance** de este lab)
- [ ] **2.3** Dependencias Express/TS instaladas (`npm ls --depth=0`)
- [ ] **2.4** Existe `tsconfig.json` (`rootDir: ./src`, `outDir: ./dist`, `strict: true`)
- [ ] **2.5** Existen `src/server.ts` y `src/config/index.ts` (esqueleto App)
- [ ] `npx tsc --noEmit` sin errores al cerrar el ISS

---

## 2.1 Inicializar npm y scripts

**Criterios de este sub-ítem**

- [ ] `package.json` creado
- [ ] Scripts `build` y `dev` definidos

```bash
mkdir movicab-express
cd movicab-express
npm init -y
mkdir -p docs
```

**PARCHE** — `package.json` **ya existe** (lo creó `npm init -y`).

- **Dentro de** `"scripts"`: deja solo (o añade) `build` y `dev` como abajo.
- **Debajo de** `"license"` (o al mismo nivel que `"scripts"`): asegúrate de `"type": "commonjs"`.

Estado esperado de esas claves:

```json
{
  "scripts": {
    "build": "tsc",
    "dev": "nodemon --watch src --ext ts --exec ts-node -- src/server.ts"
  },
  "type": "commonjs"
}
```

```bash
node -e "const p=require('./package.json'); console.log(p.scripts)"
```

---

## 2.2 Estructura de carpetas (features)

**Criterios de este sub-ítem**

- [ ] Carpetas de infra y features creadas según el árbol

```bash
mkdir -p \
  src/config \
  src/database/seeders \
  src/routes \
  src/features/business/pasajero
```

```text
src/
├── config/
├── database/
│   └── seeders/          # solo carpeta (ISS-02 §3.3); runner en ISS-04
├── routes/
├── features/
│   └── business/
│       └── pasajero/       # más features en ISS-06…08
└── server.ts             # §2.5
```

| Carpeta | Uso |
|---------|-----|
| `features/business/<entidad>/` | model + controller + routes (+ seeder, swagger, http, associations) |
| `database/seeders/` | counts + SeedersRunner (`npm run db:seed`) |
| `routes/index.ts` | Agregador de features |
| `config/` · `database/` | Arranque e infraestructura |

**Seeders (patrón del lab)**

| Pieza | Dónde |
|-------|-------|
| Por entidad | `src/features/business/<entidad>/<entidad>.seeder.ts` |
| Runner + counts | `src/database/seeders/{index,counts}.ts` → `npm run db:seed` |
| Datos falsos | `@faker-js/faker` |

```bash
find src -type d | sort
```

---

## 2.3 Dependencias base (Express + TypeScript)

**Criterios de este sub-ítem**

- [ ] `express`, `cors`, `dotenv`, `morgan` instalados
- [ ] `typescript`, `ts-node`, `nodemon`, `@types/*` instalados

```bash
npm install express@^5.2.1 cors@^2.8.6 dotenv@^17.4.2 morgan@^1.12.1

npm install -D typescript@~5.9.2 ts-node@^10.9.2 nodemon@^3.1.14 \
  @types/node@^22.20.3 @types/express@^5.0.6 \
  @types/cors@^2.8.19 @types/morgan@^1.9.10
```

> TypeScript en **5.9.x** por compatibilidad con `ts-node`.

```bash
npm ls --depth=0
```

---

## 2.4 TypeScript (`tsconfig.json`)

**Criterios de este sub-ítem**

- [ ] `tsconfig.json` con `rootDir: ./src`, `outDir: ./dist`, `strict: true`

```bash
: > tsconfig.json
cat >> tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "rootDir": "./src",
    "outDir": "./dist",
    "module": "commonjs",
    "target": "ES2020",
    "lib": ["ES2020"],
    "types": ["node"],
    "esModuleInterop": true,
    "resolveJsonModule": true,
    "sourceMap": true,
    "strict": true,
    "skipLibCheck": true,
    "moduleDetection": "force",
    "isolatedModules": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
EOF
```

```bash
test -f tsconfig.json && npx tsc --showConfig | head -20
```

---

## 2.5 Servidor y App (esqueleto HTTP)

**Criterios de este sub-ítem**

- [ ] Existen `src/server.ts` y `src/config/index.ts`
- [ ] `App` define `settings`, `middlewares`, `routes`, `dbConnection`, `listen` (placeholders OK)

### 2.5.1 `src/server.ts`

```bash
: > src/server.ts
cat >> src/server.ts << 'EOF'
import { App } from './config/index';

async function main() {
    const app = new App();
    await app.listen();
}

main();
EOF
```

### 2.5.2 `src/config/index.ts` (esqueleto)

> En ISS-01 el App es **esqueleto**. Los imports de modelos, associations, Routes,
> Swagger y el `sync` completo se añaden con **PARCHE** en ISS-02…08.
> El archivo **final** consolidado aparece al cierre de ISS-08.

```bash
: > src/config/index.ts
cat >> src/config/index.ts << 'EOF'
import dotenv from "dotenv";
import express, { Application } from "express";
import morgan from "morgan";
var cors = require("cors");

dotenv.config();

export class App {
  public app: Application;

  constructor(private port?: number | string) {
    this.app = express();
    this.settings();
    this.middlewares();
    this.routes();
    this.dbConnection();
  }

  private settings(): void {
    this.app.set('port', this.port || process.env.PORT || 4000);
  }

  private middlewares(): void {
    this.app.use(morgan('dev'));
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));
  }

  private routes(): void {
    // ISS-03 §4.3
  }

  private async dbConnection(): Promise<void> {
    // ISS-02 / ISS-03
  }

  async listen() {
    await this.app.listen(this.app.get('port'));
    console.log(`🚀 Servidor ejecutándose en puerto ${this.app.get('port')}`);
  }
}
EOF
```

### Verificación del ISS-01

```bash
npx tsc --noEmit
find src -type f | sort
```

### Cierre del ISS

```bash
npm run dev
```

> El servidor debe arrancar sin error. Detenerlo con Ctrl+C antes de continuar.

---

# 3. ISS-02 — Infraestructura de base de datos

**Objetivo:** drivers + `.env` + módulo Sequelize + carpeta `seeders/`.  
**Bloqueado por:** ISS-01.

### Criterios de aceptación (ISS-02) — consolidados

- [ ] **3.1** Paquetes Sequelize/drivers instalados; existe `.env` con `DB_ENGINE` y bloques de motores
- [ ] **3.2** Existe `src/database/db.ts` exportando `sequelize`, `getDatabaseInfo`, `testConnection`
- [ ] **3.3** Existe carpeta `src/database/seeders/` **sin** lógica implementada aún
- [ ] `npx tsc --noEmit` OK

---

## 3.1 Drivers Sequelize y `.env`

**Criterios de este sub-ítem**

- [ ] `sequelize`, `mysql2`, `pg`, `pg-hstore`, `tedious`, `oracledb` instalados
- [ ] `.env` con `PORT`, `DB_ENGINE`, MySQL/Postgres/MSSQL/Oracle

```bash
npm install sequelize@^6.37.8 mysql2@^3.24.4 pg@^8.23.0 pg-hstore@^2.3.4 \
  tedious@^20.0.0 oracledb@^7.0.1
npm install -D @types/sequelize@^6.12.0
```

```bash
: > .env
cat >> .env << 'EOF'
PORT=4000

# Variable para seleccionar el motor de base de datos
DB_ENGINE=mysql

# Configuración para MySQL
MYSQL_HOST=localhost
MYSQL_USER=admin
MYSQL_PASSWORD=MiNiCo57**
MYSQL_NAME=tecnogua
MYSQL_PORT=3306

# Configuración para PostgreSQL
POSTGRES_HOST=localhost
POSTGRES_USER=postgres
POSTGRES_PASSWORD=password
POSTGRES_NAME=almacen_2025_iisem_node
POSTGRES_PORT=5432

# Configuración para SQL Server
MSSQL_HOST=localhost
MSSQL_USER=sa
MSSQL_PASSWORD=password
MSSQL_NAME=almacen_2025_iisem_node
MSSQL_PORT=1433

# Configuración para Oracle
ORACLE_HOST=localhost
ORACLE_USER=ALMACENDB_ADMIN
ORACLE_PASSWORD=password
ORACLE_NAME=xe
ORACLE_PORT=1521

EOF
```

```bash
test -f .env && grep DB_ENGINE .env
npm ls sequelize mysql2 --depth=0
```

---

## 3.2 Configuración Sequelize (`database/db.ts`)

**Criterios de este sub-ítem**

- [ ] Archivo `src/database/db.ts` creado
- [ ] Exporta `sequelize`, `getDatabaseInfo`, `testConnection`

```bash
: > src/database/db.ts
cat >> src/database/db.ts << 'EOF'
import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

interface DatabaseConfig {
  dialect: string;
  host: string;
  username: string;
  password: string;
  database: string;
  port: number;
}

const dbConfigurations: Record<string, DatabaseConfig> = {
  mysql: {
    dialect: "mysql",
    host: process.env.MYSQL_HOST || "localhost",
    username: process.env.MYSQL_USER || "root",
    password: process.env.MYSQL_PASSWORD || "",
    database: process.env.MYSQL_NAME || "test",
    port: parseInt(process.env.MYSQL_PORT || "3306")
  },
  postgres: {
    dialect: "postgres",
    host: process.env.POSTGRES_HOST || "localhost",
    username: process.env.POSTGRES_USER || "postgres",
    password: process.env.POSTGRES_PASSWORD || "",
    database: process.env.POSTGRES_NAME || "test",
    port: parseInt(process.env.POSTGRES_PORT || "5432")
  }
};

const selectedEngine = process.env.DB_ENGINE || "mysql";
const selectedConfig = dbConfigurations[selectedEngine];

if (!selectedConfig) {
  throw new Error(`Motor de base de datos no soportado: ${selectedEngine}`);
}

console.log(`🔌 Conectando a base de datos: ${selectedEngine.toUpperCase()}`);

export const sequelize = new Sequelize(
  selectedConfig.database,
  selectedConfig.username,
  selectedConfig.password,
  {
    host: selectedConfig.host,
    port: selectedConfig.port,
    dialect: selectedConfig.dialect as any,
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

export const getDatabaseInfo = () => {
  return {
    engine: selectedEngine,
    config: selectedConfig,
    connectionString: `${selectedConfig.dialect}://${selectedConfig.username}@${selectedConfig.host}:${selectedConfig.port}/${selectedConfig.database}`
  };
};

export const testConnection = async (): Promise<boolean> => {
  try {
    await sequelize.authenticate();
    console.log(`✅ Conexión exitosa a ${selectedEngine.toUpperCase()}`);
    return true;
  } catch (error) {
    console.error(`❌ Error de conexión a ${selectedEngine.toUpperCase()}:`, error);
    return false;
  }
};
EOF
```

```bash
test -f src/database/db.ts && npx tsc --noEmit
```

---

## 3.3 Carpeta seeders (reservada)

**Criterios de este sub-ítem**

- [ ] `src/database/seeders/` existe (la lógica llega en ISS-04)
- [ ] `src/database/seeders/` existe **sin** `*.seeder.ts` ni runner

```bash
mkdir -p src/database/seeders
# opcional: touch src/database/seeders/.gitkeep
```

```bash
test -d src/database/seeders && echo OK
```

### Verificación del ISS-02

```bash
npx tsc --noEmit
test -f src/database/db.ts && test -f .env && test -d src/database/seeders
```

### Cierre del ISS

```bash
npm run dev
```

> El servidor debe arrancar sin error. Detenerlo con Ctrl+C antes de continuar.

---

# 4. ISS-03-A — Feature Pasajero — fundación (modelo, esqueleto, HTTP, cableado)

**Nombre recomendado:** *Feature Pasajero — fundación*  
**Objetivo:** dejar el feature listo para CRUD: modelo con columnas obligatorias, esqueleto controller/routes, carpeta `http/`, agregador y sync.  
**Bloqueado por:** ISS-02.

### Criterios de aceptación (ISS-03-A)

- [ ] **4.1** Modelo `pasajero.model.ts` con `status` + `timestamps: true` + bcrypt
- [ ] **4.2** Controller/routes esqueleto (sin CRUD aún en este sub-ítem pedagógico; el repo ya puede tener CRUD de ISS-03-B…E)
- [ ] **4.3** Carpeta `features/business/pasajero/http/` creada
- [ ] **4.4** `routes/index.ts` + `config` importan modelo, conectan BD y hacen `sync`
- [ ] Con BD: `npm run dev` → conexión OK + sync OK + tabla `pasajeros`

---

## 4.1 Modelo Pasajero

**Criterios**

- [ ] `src/features/business/pasajero/pasajero.model.ts`
- [ ] Enum `active`/`inactive`, default `inactive`; `timestamps: true`

```bash
npm install bcryptjs@^3.0.3
npm install -D @types/bcryptjs@^3.0.0
```

```bash
: > src/features/business/pasajero/pasajero.model.ts
cat >> src/features/business/pasajero/pasajero.model.ts << 'EOF'
import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../../database/db";
import bcrypt from "bcryptjs";

export interface PasajeroI {
  id?: number;
  name: string;
  address: string;
  phone: string;
  email: string;
  password: string;
  status: "active" | "inactive";
  createdAt?: Date;
  updatedAt?: Date;
}

export class Pasajero extends Model {
  public id!: number;
  public name!: string;
  public address!: string;
  public phone!: string;
  public email!: string;
  public password!: string;
  public status!: "active" | "inactive";
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Pasajero.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        notEmpty: { msg: "Phone cannot be empty" },
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
      validate: {
        isEmail: { msg: "Email must be a valid email address" },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("active", "inactive"),
      defaultValue: "inactive",
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Pasajero",
    tableName: "pasajeros",
    timestamps: true,
    hooks: {
      beforeCreate: async (pasajero: Pasajero) => {
        if (pasajero.password) {
          const salt = await bcrypt.genSalt(10);
          pasajero.password = await bcrypt.hash(pasajero.password, salt);
        }
      },
      beforeUpdate: async (pasajero: Pasajero) => {
        if (pasajero.changed("password") && pasajero.password) {
          const salt = await bcrypt.genSalt(10);
          pasajero.password = await bcrypt.hash(pasajero.password, salt);
        }
      },
      beforeBulkCreate: async (pasajeros: Pasajero[]) => {
        for (const pasajero of pasajeros) {
          if (pasajero.password) {
            const salt = await bcrypt.genSalt(10);
            pasajero.password = await bcrypt.hash(pasajero.password, salt);
          }
        }
      },
    },
  }
);
EOF
```

---

## 4.2 Esqueleto controller / routes + carpeta HTTP

**Criterios**

- [ ] Archivos `pasajero.controller.ts` y `pasajero.routes.ts` existen (esqueleto)
- [ ] Carpeta `src/features/business/pasajero/http/` existe

```bash
mkdir -p src/features/business/pasajero/http
```

> El CRUD se completa en ISS-03-B…E. Aquí se reserva la carpeta `http/` para archivos `.http` (REST Pasajero) con leyenda **SIN AUTH**.

```bash
: > src/features/business/pasajero/pasajero.controller.ts
cat >> src/features/business/pasajero/pasajero.controller.ts << 'EOF'
import { Request, Response } from "express";
import { Pasajero, PasajeroI } from "./pasajero.model";

function paramId(req: Request): number {
  const raw = req.params.id;
  const value = Array.isArray(raw) ? raw[0] : raw;
  return Number(value);
}

export class PasajeroController {
  // ================== READ ==================
  // (rellenar en ISS-03-B) getAll, luego getOne

  // ================== CREATE ==================
  // (rellenar en ISS-03-C)

  // ================== UPDATE ==================
  // (rellenar en ISS-03-D)

  // ================== DELETE ==================
  // (rellenar en ISS-03-E)
}
EOF
```

```bash
: > src/features/business/pasajero/pasajero.routes.ts
cat >> src/features/business/pasajero/pasajero.routes.ts << 'EOF'
import { Application } from "express";
import { PasajeroController } from "./pasajero.controller";

export class PasajeroRoutes {
  public pasajeroController: PasajeroController = new PasajeroController();

  public routes(app: Application): void {
    // ================== RUTAS SIN AUTENTICACIÓN / SIN MIDDLEWARE JWT ==================
    // (rellenar en ISS-03-B…E)
  }
}
EOF
```

---

## 4.3 Agregador Routes + cableado en Config

**Criterios**

- [ ] `src/routes/index.ts` con `pasajeroRoutes`
- [ ] `config` importa modelo + `dbConnection` + `routes`

```bash
: > src/routes/index.ts
cat >> src/routes/index.ts << 'EOF'
import { PasajeroRoutes } from "../features/business/pasajero/pasajero.routes";

export class Routes {
  public pasajeroRoutes: PasajeroRoutes = new PasajeroRoutes();
}
EOF
```

**PARCHE** — `src/config/index.ts` **ya existe** (ISS-01).

1. **Debajo de** `var cors = require("cors");` **añadir**:

```ts
import { sequelize, getDatabaseInfo, testConnection } from "../database/db";
import "../features/business/pasajero/pasajero.model";
import { Routes } from "../routes/index";
```

2. **Dentro de** `export class App`, **debajo de** `public app: Application;` **añadir**:

```ts
  public routePrv: Routes = new Routes();
```

3. **Dentro de** `routes()`, **reemplazar** el comentario `// ISS-03 §4.3` por:

```ts
    this.routePrv.pasajeroRoutes.routes(this.app);
```

4. **Dentro de** `dbConnection()`, **reemplazar** el comentario `// ISS-02 / ISS-03` por:

```ts
    try {
      // Mostrar información de la base de datos seleccionada
      const dbInfo = getDatabaseInfo();
      console.log(`🔗 Intentando conectar a: ${dbInfo.engine.toUpperCase()}`);

      // Probar la conexión
      const isConnected = await testConnection();

      if (!isConnected) {
        throw new Error(`No se pudo conectar a la base de datos ${dbInfo.engine.toUpperCase()}`);
      }

      // alter: true actualiza columnas faltantes (ej. createdAt/updatedAt tras timestamps: true).
      // force: false no recrea tablas; no borra datos. En producción preferir migraciones.
      await sequelize.sync({ force: false, alter: true });
      console.log(`📦 Base de datos sincronizada exitosamente`);
    } catch (error) {
      console.error("❌ Error al conectar con la base de datos:", error);
      process.exit(1); // Terminar la aplicación si no se puede conectar
    }
```

> **Importante (lab):** si la tabla `pasajeros` se creó antes con `timestamps: false`,
> `sync({ force: false })` **no** añade `createdAt`/`updatedAt`. Por eso se usa `alter: true`.

### Verificación ISS-03-A

```bash
test -d src/features/business/pasajero/http && echo HTTP_FOLDER_OK
```

### Cierre del ISS

```bash
npm run dev
```

> Sync OK y tabla `pasajeros` (con `createdAt` / `updatedAt`). Detenerlo con Ctrl+C antes de continuar.

---

# 5. ISS-03-B — Feature Pasajero — GetAll y GetOne

**Objetivo:** listar activos y obtener uno por id. Es el primer paso del feature: getAll, getOne, luego create, update y delete.  
**Bloqueado por:** ISS-03-A.

### Criterios de aceptación (ISS-03-B)

- [ ] Controller: `getAll` (solo `status: 'active'`) y, debajo, `getOne`
- [ ] Rutas `GET /api/pasajeros` y `GET /api/pasajeros/:id` — **sin auth**
- [ ] `http/pasajeros.get.http` con leyenda **SIN AUTH**
- [ ] Respuestas sin campo `password`

### Controller — **PARCHE** `pasajero.controller.ts` (ya existe)

**Debajo de** el comentario `// ================== READ ==================` (y **encima de** `// ================== CREATE ==================`), **añadir** primero `getAll` y después `getOne`:

```ts
  public async getAll(req: Request, res: Response) {
    try {
      const pasajeros = await Pasajero.findAll({
        where: { status: "active" },
        attributes: { exclude: ["password"] },
      });
      res.status(200).json({ pasajeros });
    } catch (error) {
      res.status(500).json({ error: "Error fetching pasajeros", detail: String(error) });
    }
  }

  public async getOne(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const pasajero = await Pasajero.findByPk(id, {
        attributes: { exclude: ["password"] },
      });
      if (!pasajero) {
        res.status(404).json({ error: "Pasajero not found" });
        return;
      }
      res.status(200).json({ pasajero });
    } catch (error) {
      res.status(500).json({ error: "Error fetching pasajero", detail: String(error) });
    }
  }
```

### Rutas — **PARCHE** `pasajero.routes.ts` (ya existe)

**Debajo de** el comentario `// ================== RUTAS SIN AUTENTICACIÓN / SIN MIDDLEWARE JWT ==================`, **añadir** primero `getAll` y después `getOne`:

```ts
    // getAll
    app
      .route("/api/pasajeros")
      .get(this.pasajeroController.getAll.bind(this.pasajeroController));

    // getOne
    app
      .route("/api/pasajeros/:id")
      .get(this.pasajeroController.getOne.bind(this.pasajeroController));
```

### HTTP — archivo nuevo

```bash
: > src/features/business/pasajero/http/pasajeros.get.http
cat >> src/features/business/pasajero/http/pasajeros.get.http << 'EOF'
### Feature Pasajero — GET ALL / GET ONE
### Leyenda: SIN AUTH (sin middleware JWT / sin autenticación)
@baseUrl = http://localhost:4000
@id = 1

# @name getAllPasajeros
GET {{baseUrl}}/api/pasajeros

###

# @name getOnePasajero
GET {{baseUrl}}/api/pasajeros/{{id}}
EOF
```

### Verificación

```bash
curl -s http://localhost:4000/api/pasajeros
curl -s http://localhost:4000/api/pasajeros/1
```

### Cierre del ISS

```bash
npm run dev
```

> El servidor debe arrancar sin error. Detenerlo con Ctrl+C antes de continuar.

---

# 6. ISS-03-C — Feature Pasajero — Crear pasajero

**Objetivo:** alta de pasajero vía API, después de getAll y getOne.  
**Bloqueado por:** ISS-03-B.

### Criterios de aceptación (ISS-03-C)

- [ ] Controller: método `create` **debajo de** `getOne` y **encima de** update
- [ ] Ruta `POST /api/pasajeros` **debajo de** `getOne` — **sin auth**
- [ ] Archivo `http/pasajeros.create.http` con leyenda **SIN AUTH**
- [ ] `POST` responde `201` con pasajero

### Controller — **PARCHE** `pasajero.controller.ts` (ya existe)

**Debajo de** el comentario `// ================== CREATE ==================` (y **encima de** `// ================== UPDATE ==================`), **añadir** el método `create`:

```ts
  public async create(req: Request, res: Response) {
    try {
      const body = req.body as PasajeroI;
      const pasajero = await Pasajero.create({
        name: body.name,
        address: body.address,
        phone: body.phone,
        email: body.email,
        password: body.password,
        status: body.status ?? "active",
      });
      const { password, ...safe } = pasajero.toJSON() as PasajeroI & { password?: string };
      res.status(201).json({ pasajero: safe });
    } catch (error) {
      res.status(500).json({ error: "Error creating pasajero", detail: String(error) });
    }
  }
```

### Rutas — **PARCHE** `pasajero.routes.ts` (ya existe)

**Debajo de** el bloque `// getOne`, **añadir**:

```ts
    // create
    app
      .route("/api/pasajeros")
      .post(this.pasajeroController.create.bind(this.pasajeroController));
```

### HTTP — archivo nuevo

```bash
: > src/features/business/pasajero/http/pasajeros.create.http
cat >> src/features/business/pasajero/http/pasajeros.create.http << 'EOF'
### Feature Pasajero — CREATE
### Leyenda: SIN AUTH (sin middleware JWT / sin autenticación)
@baseUrl = http://localhost:4000

# @name createPasajero
POST {{baseUrl}}/api/pasajeros
Content-Type: application/json

{
  "name": "Ana Pérez",
  "address": "Calle 10 #20-30",
  "phone": "3001234567",
  "email": "ana.perez@example.com",
  "password": "Password123!",
  "status": "active"
}
EOF
```

### Verificación

```bash
curl -s -X POST http://localhost:4000/api/pasajeros \
  -H 'Content-Type: application/json' \
  -d '{"name":"Ana","phone":"3001","email":"ana@test.com","password":"Password123!","status":"active"}'
```

### Cierre del ISS

```bash
npm run dev
```

> El servidor debe arrancar sin error. Detenerlo con Ctrl+C antes de continuar.

---

# 7. ISS-03-D — Feature Pasajero — Update (PUT) y Update (PATCH)

**Objetivo:** actualización completa y parcial.  
**Bloqueado por:** ISS-03-C.

### Criterios de aceptación (ISS-03-D)

- [ ] Controller: `updatePut` y `updatePatch`
- [ ] Rutas `PUT` y `PATCH` `/api/pasajeros/:id` — **sin auth**
- [ ] `http/pasajeros.update.http` con leyenda **SIN AUTH**

### Controller — **PARCHE** `pasajero.controller.ts` (ya existe)

**Debajo de** el comentario `// ================== UPDATE ==================` (y **encima de** `// ================== DELETE ==================`), **añadir**:

```ts
  public async updatePut(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const body = req.body as PasajeroI;
      const pasajero = await Pasajero.findByPk(id);
      if (!pasajero) {
        res.status(404).json({ error: "Pasajero not found" });
        return;
      }

      await pasajero.update({
        name: body.name,
        address: body.address,
        phone: body.phone,
        email: body.email,
        password: body.password ?? pasajero.password,
        status: body.status ?? pasajero.status,
      });

      const { password, ...safe } = pasajero.toJSON() as PasajeroI & { password?: string };
      res.status(200).json({ pasajero: safe });
    } catch (error) {
      res.status(500).json({ error: "Error updating pasajero (PUT)", detail: String(error) });
    }
  }

  public async updatePatch(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const body = req.body as Partial<PasajeroI>;
      const pasajero = await Pasajero.findByPk(id);
      if (!pasajero) {
        res.status(404).json({ error: "Pasajero not found" });
        return;
      }

      await pasajero.update(body);
      const { password, ...safe } = pasajero.toJSON() as PasajeroI & { password?: string };
      res.status(200).json({ pasajero: safe });
    } catch (error) {
      res.status(500).json({ error: "Error updating pasajero (PATCH)", detail: String(error) });
    }
  }
```

### Rutas — **PARCHE** `pasajero.routes.ts` (ya existe)

**Debajo de** el bloque `// create`, **añadir** PUT y PATCH:

```ts
    // update (PUT / PATCH)
    app
      .route("/api/pasajeros/:id")
      .put(this.pasajeroController.updatePut.bind(this.pasajeroController))
      .patch(this.pasajeroController.updatePatch.bind(this.pasajeroController));
```

### HTTP — archivo nuevo

```bash
: > src/features/business/pasajero/http/pasajeros.update.http
cat >> src/features/business/pasajero/http/pasajeros.update.http << 'EOF'
### Feature Pasajero — UPDATE (PUT) / UPDATE (PATCH)
### Leyenda: SIN AUTH (sin middleware JWT / sin autenticación)
@baseUrl = http://localhost:4000
@id = 1

# @name updatePasajeroPut
PUT {{baseUrl}}/api/pasajeros/{{id}}
Content-Type: application/json

{
  "name": "Ana Pérez Actualizada",
  "address": "Carrera 15 #40-10",
  "phone": "3009876543",
  "email": "ana.perez@example.com",
  "password": "Password123!",
  "status": "active"
}

###

# @name updatePasajeroPatch
PATCH {{baseUrl}}/api/pasajeros/{{id}}
Content-Type: application/json

{
  "phone": "3011112233",
  "address": "Nueva dirección parcial"
}
EOF
```

### Verificación

```bash
curl -s -X PUT http://localhost:4000/api/pasajeros/1 -H 'Content-Type: application/json' \
  -d '{"name":"Ana","address":"x","phone":"300","email":"ana@test.com","status":"active"}'
curl -s -X PATCH http://localhost:4000/api/pasajeros/1 -H 'Content-Type: application/json' \
  -d '{"phone":"301"}'
```

### Cierre del ISS

```bash
npm run dev
```

> El servidor debe arrancar sin error. Detenerlo con Ctrl+C antes de continuar.

---

# 8. ISS-03-E — Feature Pasajero — Eliminar (físico y lógico)

**Objetivo:** borrado físico (`DELETE`) y lógico (`status = 'inactive'`).  
**Bloqueado por:** ISS-03-D.

### Criterios de aceptación (ISS-03-E)

- [ ] Controller: `deletePhysical` y `deleteLogical`
- [ ] `DELETE /api/pasajeros/:id` — físico — **sin auth**
- [ ] `PATCH /api/pasajeros/:id/deactivate` — lógico → `inactive` — **sin auth**
- [ ] `http/pasajeros.delete.http` con leyenda **SIN AUTH**

### Controller — **PARCHE** `pasajero.controller.ts` (ya existe)

**Debajo de** el comentario `// ================== DELETE ==================`, **añadir** primero el borrado físico y después el lógico:

```ts
  /** Eliminación física */
  public async deletePhysical(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const pasajero = await Pasajero.findByPk(id);
      if (!pasajero) {
        res.status(404).json({ error: "Pasajero not found" });
        return;
      }
      await pasajero.destroy();
      res.status(200).json({ message: "Pasajero permanently deleted", id });
    } catch (error) {
      res.status(500).json({ error: "Error deleting pasajero", detail: String(error) });
    }
  }

  /** Eliminación lógica → status = inactive */
  public async deleteLogical(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const pasajero = await Pasajero.findByPk(id);
      if (!pasajero) {
        res.status(404).json({ error: "Pasajero not found" });
        return;
      }
      await pasajero.update({ status: "inactive" });
      const { password, ...safe } = pasajero.toJSON() as PasajeroI & { password?: string };
      res.status(200).json({ message: "Pasajero deactivated (logical delete)", pasajero: safe });
    } catch (error) {
      res.status(500).json({ error: "Error deactivating pasajero", detail: String(error) });
    }
  }
```

### Rutas — **PARCHE** `pasajero.routes.ts` (ya existe)

1. **Debajo de** el bloque `// update (PUT / PATCH)`, **añadir** el borrado físico:

```ts
    // delete físico
    app
      .route("/api/pasajeros/:id")
      .delete(this.pasajeroController.deletePhysical.bind(this.pasajeroController));
```

2. **Debajo de** ese bloque, **añadir** la baja lógica:

```ts
    // delete lógico
    app
      .route("/api/pasajeros/:id/deactivate")
      .patch(this.pasajeroController.deleteLogical.bind(this.pasajeroController));
```

### HTTP — archivo nuevo

```bash
: > src/features/business/pasajero/http/pasajeros.delete.http
cat >> src/features/business/pasajero/http/pasajeros.delete.http << 'EOF'
### Feature Pasajero — DELETE físico / DELETE lógico (status = inactive)
### Leyenda: SIN AUTH (sin middleware JWT / sin autenticación)
@baseUrl = http://localhost:4000
@id = 1

# @name deletePasajeroPhysical
DELETE {{baseUrl}}/api/pasajeros/{{id}}

###

# @name deletePasajeroLogical
PATCH {{baseUrl}}/api/pasajeros/{{id}}/deactivate
EOF
```

### Verificación

```bash
curl -s -X PATCH http://localhost:4000/api/pasajeros/1/deactivate
curl -s -X DELETE http://localhost:4000/api/pasajeros/1
```

> Tras baja lógica, `GET /api/pasajeros` ya no debe listar ese registro (filtra `active`).

### Estado final Pasajero (CRUD completo) — archivos consolidados

Tras ISS-03-B…E, estos archivos deben quedar así (equivalente a aplicar todos los PARCHE):

```bash
: > src/features/business/pasajero/pasajero.controller.ts
cat >> src/features/business/pasajero/pasajero.controller.ts << 'EOF'
import { Request, Response } from "express";
import { Pasajero, PasajeroI } from "./pasajero.model";

function paramId(req: Request): number {
  const raw = req.params.id;
  const value = Array.isArray(raw) ? raw[0] : raw;
  return Number(value);
}

export class PasajeroController {
  // ================== READ ==================
  public async getAll(req: Request, res: Response) {
    try {
      const pasajeros = await Pasajero.findAll({
        where: { status: "active" },
        attributes: { exclude: ["password"] },
      });
      res.status(200).json({ pasajeros });
    } catch (error) {
      res.status(500).json({ error: "Error fetching pasajeros", detail: String(error) });
    }
  }

  public async getOne(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const pasajero = await Pasajero.findByPk(id, {
        attributes: { exclude: ["password"] },
      });
      if (!pasajero) {
        res.status(404).json({ error: "Pasajero not found" });
        return;
      }
      res.status(200).json({ pasajero });
    } catch (error) {
      res.status(500).json({ error: "Error fetching pasajero", detail: String(error) });
    }
  }

  // ================== CREATE ==================
  public async create(req: Request, res: Response) {
    try {
      const body = req.body as PasajeroI;
      const pasajero = await Pasajero.create({
        name: body.name,
        address: body.address,
        phone: body.phone,
        email: body.email,
        password: body.password,
        status: body.status ?? "active",
      });
      const { password, ...safe } = pasajero.toJSON() as PasajeroI & { password?: string };
      res.status(201).json({ pasajero: safe });
    } catch (error) {
      res.status(500).json({ error: "Error creating pasajero", detail: String(error) });
    }
  }

  // ================== UPDATE ==================
  public async updatePut(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const body = req.body as PasajeroI;
      const pasajero = await Pasajero.findByPk(id);
      if (!pasajero) {
        res.status(404).json({ error: "Pasajero not found" });
        return;
      }

      await pasajero.update({
        name: body.name,
        address: body.address,
        phone: body.phone,
        email: body.email,
        password: body.password ?? pasajero.password,
        status: body.status ?? pasajero.status,
      });

      const { password, ...safe } = pasajero.toJSON() as PasajeroI & { password?: string };
      res.status(200).json({ pasajero: safe });
    } catch (error) {
      res.status(500).json({ error: "Error updating pasajero (PUT)", detail: String(error) });
    }
  }

  public async updatePatch(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const body = req.body as Partial<PasajeroI>;
      const pasajero = await Pasajero.findByPk(id);
      if (!pasajero) {
        res.status(404).json({ error: "Pasajero not found" });
        return;
      }

      await pasajero.update(body);
      const { password, ...safe } = pasajero.toJSON() as PasajeroI & { password?: string };
      res.status(200).json({ pasajero: safe });
    } catch (error) {
      res.status(500).json({ error: "Error updating pasajero (PATCH)", detail: String(error) });
    }
  }

  // ================== DELETE ==================
  /** Eliminación física */
  public async deletePhysical(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const pasajero = await Pasajero.findByPk(id);
      if (!pasajero) {
        res.status(404).json({ error: "Pasajero not found" });
        return;
      }
      await pasajero.destroy();
      res.status(200).json({ message: "Pasajero permanently deleted", id });
    } catch (error) {
      res.status(500).json({ error: "Error deleting pasajero", detail: String(error) });
    }
  }

  /** Eliminación lógica → status = inactive */
  public async deleteLogical(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const pasajero = await Pasajero.findByPk(id);
      if (!pasajero) {
        res.status(404).json({ error: "Pasajero not found" });
        return;
      }
      await pasajero.update({ status: "inactive" });
      const { password, ...safe } = pasajero.toJSON() as PasajeroI & { password?: string };
      res.status(200).json({ message: "Pasajero deactivated (logical delete)", pasajero: safe });
    } catch (error) {
      res.status(500).json({ error: "Error deactivating pasajero", detail: String(error) });
    }
  }
}
EOF
```

```bash
: > src/features/business/pasajero/pasajero.routes.ts
cat >> src/features/business/pasajero/pasajero.routes.ts << 'EOF'
import { Application } from "express";
import { PasajeroController } from "./pasajero.controller";

export class PasajeroRoutes {
  public pasajeroController: PasajeroController = new PasajeroController();

  public routes(app: Application): void {
    // ================== RUTAS SIN AUTENTICACIÓN / SIN MIDDLEWARE JWT ==================

    // getAll
    app
      .route("/api/pasajeros")
      .get(this.pasajeroController.getAll.bind(this.pasajeroController));

    // getOne
    app
      .route("/api/pasajeros/:id")
      .get(this.pasajeroController.getOne.bind(this.pasajeroController));

    // create
    app
      .route("/api/pasajeros")
      .post(this.pasajeroController.create.bind(this.pasajeroController));

    // update (PUT / PATCH)
    app
      .route("/api/pasajeros/:id")
      .put(this.pasajeroController.updatePut.bind(this.pasajeroController))
      .patch(this.pasajeroController.updatePatch.bind(this.pasajeroController));

    // delete físico
    app
      .route("/api/pasajeros/:id")
      .delete(this.pasajeroController.deletePhysical.bind(this.pasajeroController));

    // delete lógico
    app
      .route("/api/pasajeros/:id/deactivate")
      .patch(this.pasajeroController.deleteLogical.bind(this.pasajeroController));
  }
}
EOF
```

### Cierre del ISS

```bash
npm run dev
```

> El servidor debe arrancar sin error. Detenerlo con Ctrl+C antes de continuar.

---

# 9. ISS-04 — Seeders con Faker (feature + runner externo)

**Objetivo:** datos falsos por feature (Faker) y un orquestador externo que ejecuta todos los seeders enviando la **cantidad por entidad**.  
**Bloqueado por:** ISS-03-A (modelo); recomendado tras ISS-03-E.

### Criterios de aceptación (ISS-04) — consolidados

- [ ] **9.1** Existe `features/business/pasajero/pasajero.seeder.ts` con `@faker-js/faker`, recibe `count`, es idempotente
- [ ] **9.2** Existe `database/seeders/index.ts` (SeedersRunner) que llama seeders de features
- [ ] **9.2** Existe `database/seeders/counts.ts` con cantidad por entidad (default / env / CLI)
- [ ] Script `npm run db:seed` funciona
- [ ] Se puede variar cantidad: `npm run db:seed -- --pasajeros=20` o `SEED_PASAJEROS=5`

**Diseño**

| Pieza | Ubicación | Rol |
|-------|-----------|-----|
| Seeder del feature | `src/features/business/pasajero/pasajero.seeder.ts` | Genera filas falsas de Pasajero |
| Conteos | `src/database/seeders/counts.ts` | `pasajeros: N` (y futuras entidades) |
| Runner | `src/database/seeders/index.ts` | Importa seeders de features y los ejecuta en orden |

---

## 9.1 Seeder dentro del feature Pasajero

**Criterios**

- [ ] `seedPasajeros(count: number)` exportado desde el feature
- [ ] Usa `@faker-js/faker`
- [ ] Si ya hay filas, no duplica

```bash
npm install -D @faker-js/faker@^10.6.0
```

```bash
: > src/features/business/pasajero/pasajero.seeder.ts
cat >> src/features/business/pasajero/pasajero.seeder.ts << 'EOF'
import { faker } from "@faker-js/faker";
import { Pasajero } from "./pasajero.model";

/**
 * Seeder del feature Pasajero (datos falsos con @faker-js/faker).
 * Se invoca desde `src/database/seeders` (SeedersRunner), no desde la App.
 *
 * Idempotente: si ya hay filas, no vuelve a insertar.
 */
export async function seedPasajeros(count: number): Promise<number> {
  if (count <= 0) {
    console.log("⏭️  pasajeros: count=0, se omite");
    return 0;
  }

  const existing = await Pasajero.count();
  if (existing > 0) {
    console.log(`⏭️  pasajeros: ya hay ${existing} registro(s), se omite seeder`);
    return 0;
  }

  const rows = Array.from({ length: count }, (_, i) => ({
    name: faker.person.fullName(),
    address: faker.location.streetAddress(),
    phone: faker.phone.number({ style: "national" }),
    email: `pasajero.${i}.${faker.string.alphanumeric(6)}@example.com`.toLowerCase(),
    password: "Password123!",
    status: "active" as const,
  }));

  await Pasajero.bulkCreate(rows);
  console.log(`✅ pasajeros: insertados ${count} registro(s) falsos`);
  return count;
}
EOF
```

---

## 9.2 SeedersRunner + conteos por entidad (`database/seeders`)

**Criterios**

- [ ] Runner fuera del feature en `src/database/seeders/`
- [ ] Cantidad configurable por feature (`pasajeros`, …)

### 9.2.1 Conteos

```bash
: > src/database/seeders/counts.ts
cat >> src/database/seeders/counts.ts << 'EOF'
/**
 * Cantidad de registros por feature/entidad.
 * Prioridad: CLI (--pasajeros=N) > env (SEED_PASAJEROS) > default de este archivo.
 *
 * Cuando agregues features, suma aquí la clave y léela en el runner.
 */
export type SeedCounts = {
  pasajeros: number;
  // users?: number;
  // roles?: number;
  // vehiculos?: number;
};

export const DEFAULT_SEED_COUNTS: SeedCounts = {
  pasajeros: 10,
};

export function resolveSeedCounts(argv: string[] = process.argv.slice(2)): SeedCounts {
  const counts: SeedCounts = { ...DEFAULT_SEED_COUNTS };

  const envPasajeros = process.env.SEED_PASAJEROS;
  if (envPasajeros !== undefined && envPasajeros !== "") {
    counts.pasajeros = Number(envPasajeros);
  }

  for (const arg of argv) {
    const m = arg.match(/^--([a-zA-Z_]+)=(\d+)$/);
    if (!m) continue;
    const key = m[1] as keyof SeedCounts;
    const value = Number(m[2]);
    if (key in counts) {
      counts[key] = value;
    }
  }

  return counts;
}
EOF
```

### 9.2.2 Runner

```bash
: > src/database/seeders/index.ts
cat >> src/database/seeders/index.ts << 'EOF'
import dotenv from "dotenv";
import { sequelize, testConnection } from "../db";
import "../../features/business/pasajero/pasajero.model";
import { seedPasajeros } from "../../features/business/pasajero/pasajero.seeder";
import { resolveSeedCounts } from "./counts";

dotenv.config();

/**
 * SeedersRunner — ejecuta TODOS los seeders de features.
 *
 * Ubicación: `src/database/seeders/` (orquestación fuera de cada feature).
 * Cada feature exporta su seeder (ej. `features/business/pasajero/pasajero.seeder.ts`).
 *
 * Uso:
 *   npm run db:seed
 *   npm run db:seed -- --pasajeros=20
 *   SEED_PASAJEROS=5 npm run db:seed
 */
export async function runAllSeeders(): Promise<void> {
  const counts = resolveSeedCounts();
  console.log("🌱 Iniciando SeedersRunner...");
  console.log("📊 Conteos:", counts);

  const ok = await testConnection();
  if (!ok) {
    throw new Error("No hay conexión a la base de datos");
  }

  await sequelize.sync({ force: false, alter: true });

  // Orden: business (padres → hijos)
  await seedPasajeros(counts.pasajeros);

  console.log("🌱 SeedersRunner finalizado");
}

if (require.main === module) {
  runAllSeeders()
    .then(async () => {
      await sequelize.close();
      process.exit(0);
    })
    .catch(async (err) => {
      console.error("❌ Error en seeders:", err);
      await sequelize.close();
      process.exit(1);
    });
}
EOF
```

**PARCHE** — `package.json` **ya existe**.

**Dentro de** `"scripts"`, **debajo de** `"dev": "..."`, **añadir** la coma al final de `dev` (si falta) y la clave:

```json
    "db:seed": "ts-node -- src/database/seeders/index.ts"
```

Fragmento esperado:

```json
  "scripts": {
    "build": "tsc",
    "dev": "nodemon --watch src --ext ts --exec ts-node -- src/server.ts",
    "db:seed": "ts-node -- src/database/seeders/index.ts"
  }
```

### Verificación ISS-04

```bash
npm run db:seed
npm run db:seed -- --pasajeros=20
SEED_PASAJEROS=5 npm run db:seed
```

**Al agregar otra entidad (patrón):**

1. Archivo **nuevo** `features/.../<entidad>.seeder.ts` con `: >` + `cat >>`.
2. **PARCHE** `counts.ts`: **dentro de** `SeedCounts` / defaults, **añadir** clave (ej. `vehiculos: 10`).
3. **PARCHE** `database/seeders/index.ts`: **debajo de** `await seedPasajeros(...)`, **añadir** la llamada al nuevo seeder.

### Cierre del ISS

```bash
npm run dev
```

> El servidor debe arrancar sin error. Detenerlo con Ctrl+C antes de continuar.

---

# 10. ISS-05 — Swagger / OpenAPI (feature + registry externo)

**Objetivo:** documentar el API del feature Pasajero en OpenAPI 3 y montar Swagger UI desde un **registry externo** (mismo patrón que seeders).  
**Bloqueado por:** ISS-03-E (rutas CRUD definidas).

### Criterios de aceptación (ISS-05) — consolidados

- [ ] **10.1** Existe `features/business/pasajero/pasajero.swagger.ts` con tags, paths y schemas de Pasajero (leyenda **SIN AUTH**)
- [ ] **10.2** Existe `src/swagger/index.ts` que agrega módulos de features y monta UI
- [ ] `App` llama `setupSwagger` (método `docs()`)
- [ ] `GET /api/docs` muestra Swagger UI
- [ ] `GET /api/docs.json` devuelve el documento OpenAPI

**Diseño**

| Pieza | Ubicación | Rol |
|-------|-----------|-----|
| Docs del feature | `src/features/business/pasajero/pasajero.swagger.ts` | Paths + schemas Pasajero |
| Registry | `src/swagger/index.ts` | Fusiona features + `setupSwagger(app)` |
| UI | `/api/docs` | Swagger UI |
| Spec | `/api/docs.json` | OpenAPI JSON |

---

## 10.1 OpenAPI dentro del feature Pasajero

**Criterios**

- [ ] Exporta `pasajeroSwagger` con `tags`, `paths`, `components.schemas`
- [ ] Endpoints documentados como **SIN AUTH**

```bash
# Paquetes (una vez)
npm install swagger-ui-express@^5.0.1
npm install -D @types/swagger-ui-express@^4.1.8
```

Archivo **nuevo**:

```bash
: > src/features/business/pasajero/pasajero.swagger.ts
cat >> src/features/business/pasajero/pasajero.swagger.ts << 'EOF'
/**
 * Documentación OpenAPI del feature Pasajero.
 * Se agrega desde `src/swagger` (registry externo), no se monta aquí.
 *
 * Leyenda: endpoints documentados como SIN AUTH (sin middleware JWT).
 */

export const pasajeroSwagger = {
  tags: [
    {
      name: "Pasajeros",
      description: "CRUD de pasajeros — **SIN AUTH** (sin middleware JWT)",
    },
  ],
  paths: {
    "/api/pasajeros": {
      get: {
        tags: ["Pasajeros"],
        summary: "Listar pasajeros activos",
        description: "SIN AUTH — retorna pasajeros con status=active (sin password)",
        security: [],
        responses: {
          "200": {
            description: "Lista de pasajeros",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    pasajeros: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Pasajero" },
                    },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Pasajeros"],
        summary: "Crear pasajero",
        description: "SIN AUTH",
        security: [],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/PasajeroCreate" },
            },
          },
        },
        responses: {
          "201": {
            description: "Pasajero creado",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    pasajero: { $ref: "#/components/schemas/Pasajero" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/pasajeros/{id}": {
      get: {
        tags: ["Pasajeros"],
        summary: "Obtener pasajero por id",
        description: "SIN AUTH",
        security: [],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: {
          "200": {
            description: "Pasajero encontrado",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    pasajero: { $ref: "#/components/schemas/Pasajero" },
                  },
                },
              },
            },
          },
          "404": { description: "No encontrado" },
        },
      },
      put: {
        tags: ["Pasajeros"],
        summary: "Actualizar pasajero (PUT — reemplazo)",
        description: "SIN AUTH",
        security: [],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/PasajeroUpdate" },
            },
          },
        },
        responses: {
          "200": { description: "Actualizado" },
          "404": { description: "No encontrado" },
        },
      },
      patch: {
        tags: ["Pasajeros"],
        summary: "Actualizar pasajero (PATCH — parcial)",
        description: "SIN AUTH",
        security: [],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/PasajeroPatch" },
            },
          },
        },
        responses: {
          "200": { description: "Actualizado" },
          "404": { description: "No encontrado" },
        },
      },
      delete: {
        tags: ["Pasajeros"],
        summary: "Eliminar pasajero (físico)",
        description: "SIN AUTH — borra la fila",
        security: [],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: {
          "200": { description: "Eliminado" },
          "404": { description: "No encontrado" },
        },
      },
    },
    "/api/pasajeros/{id}/deactivate": {
      patch: {
        tags: ["Pasajeros"],
        summary: "Eliminar pasajero (lógico)",
        description: "SIN AUTH — status = inactive",
        security: [],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: {
          "200": { description: "Desactivado" },
          "404": { description: "No encontrado" },
        },
      },
    },
  },
  components: {
    schemas: {
      Pasajero: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          name: { type: "string", example: "Ana Pérez" },
          address: { type: "string", example: "Calle 10 #20-30" },
          phone: { type: "string", example: "3001234567" },
          email: { type: "string", format: "email", example: "ana@example.com" },
          status: { type: "string", enum: ["active", "inactive"], example: "active" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      PasajeroCreate: {
        type: "object",
        required: ["name", "phone", "email", "password"],
        properties: {
          name: { type: "string" },
          address: { type: "string" },
          phone: { type: "string" },
          email: { type: "string", format: "email" },
          password: { type: "string", format: "password" },
          status: { type: "string", enum: ["active", "inactive"], default: "active" },
        },
      },
      PasajeroUpdate: {
        type: "object",
        required: ["name", "phone", "email"],
        properties: {
          name: { type: "string" },
          address: { type: "string" },
          phone: { type: "string" },
          email: { type: "string", format: "email" },
          password: { type: "string", format: "password" },
          status: { type: "string", enum: ["active", "inactive"] },
        },
      },
      PasajeroPatch: {
        type: "object",
        properties: {
          name: { type: "string" },
          address: { type: "string" },
          phone: { type: "string" },
          email: { type: "string", format: "email" },
          password: { type: "string", format: "password" },
          status: { type: "string", enum: ["active", "inactive"] },
        },
      },
    },
  },
};
EOF
```

---

## 10.2 Registry externo + montaje en Config

**Criterios**

- [ ] `buildOpenApiDocument()` fusiona módulos de features
- [ ] `setupSwagger(app)` monta `/api/docs` y `/api/docs.json`
- [ ] `config` invoca `setupSwagger` (método `docs()`)

```bash
mkdir -p src/swagger
```

Archivo **nuevo**:

```bash
: > src/swagger/index.ts
cat >> src/swagger/index.ts << 'EOF'
import { Application } from "express";
import swaggerUi from "swagger-ui-express";
import { pasajeroSwagger } from "../features/business/pasajero/pasajero.swagger";

export type FeatureSwaggerModule = {
  tags: unknown[];
  paths: Record<string, unknown>;
  components?: { schemas?: Record<string, unknown> };
};

/**
 * Registry externo: importa la documentación OpenAPI de cada feature
 * (mismo patrón que SeedersRunner).
 */
const featureSwaggerModules: FeatureSwaggerModule[] = [
  pasajeroSwagger,
  // vehiculoSwagger,
  // userSwagger,
];

export function buildOpenApiDocument() {
  const tags: unknown[] = [];
  const paths: Record<string, unknown> = {};
  const schemas: Record<string, unknown> = {};

  for (const mod of featureSwaggerModules) {
    tags.push(...mod.tags);
    Object.assign(paths, mod.paths);
    if (mod.components?.schemas) {
      Object.assign(schemas, mod.components.schemas);
    }
  }

  return {
    openapi: "3.0.3",
    info: {
      title: "MoviCab API",
      version: "1.0.0",
      description:
        "API MoviCab (Express + Sequelize). Los endpoints de Pasajero están documentados como **SIN AUTH** Todas las rutas business son **SIN AUTH** en este lab.",
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 4000}`,
        description: "Local",
      },
    ],
    tags,
    paths,
    components: { schemas },
  };
}

/** Monta Swagger UI y el JSON OpenAPI */
export function setupSwagger(app: Application): void {
  const document = buildOpenApiDocument();
  app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(document));
  app.get("/api/docs.json", (_req, res) => {
    res.json(document);
  });
  console.log("📘 Swagger UI: /api/docs  |  OpenAPI JSON: /api/docs.json");
}
EOF
```

**PARCHE** — `src/config/index.ts` **ya existe**.

1. **Debajo de** `import { Routes } from "../routes/index";` (o **debajo de** los imports de BD/modelo), **añadir**:

```ts
import { setupSwagger } from "../swagger/index";
```

2. **Dentro del** `constructor`, **debajo de** `this.routes();` y **encima de** `this.dbConnection();`, **añadir**:

```ts
    this.docs();
```

3. **Dentro de** la clase `App`, **debajo de** el método `routes()` y **encima de** `dbConnection()`, **añadir**:

```ts
  private docs(): void {
    setupSwagger(this.app);
  }
```

### Verificación ISS-05

```bash
curl -s http://localhost:4000/api/docs.json | head
```

> Con el servidor del cierre: abrir `http://localhost:4000/api/docs`.

**Al agregar otra entidad (patrón):**

1. Archivo **nuevo** `features/.../<entidad>.swagger.ts` con `: >` + `cat >>`.
2. **PARCHE** `src/swagger/index.ts`: **debajo de** `import { pasajeroSwagger } ...`, **añadir** el import; **dentro de** `featureSwaggerModules`, **debajo de** `pasajeroSwagger,`, **añadir** el módulo nuevo.

### Cierre del ISS

```bash
npm run dev
```

> El servidor debe arrancar sin error. Abrir `http://localhost:4000/api/docs`. Detenerlo con Ctrl+C antes de continuar.

---

# 11. ISS-06 — Feature TipoVehiculo (tipos de vehiculo)

**Objetivo:** CRUD + seeder + swagger de TipoVehiculo (sin FK).  
**Bloqueado por:** ISS-05.  
**API:** `/api/tipos-vehiculo` — **SIN AUTH**.  
**Patrón:** mismo que Pasajero (ISS-03-A…E + 04 + 05).

### Criterios de aceptación (ISS-06)

- [ ] **11.1** Modelo `tipo-vehiculo.model.ts` (`status` + `timestamps: true`)
- [ ] **11.2** Controller + routes en este orden: getAll, getOne, create, update PUT/PATCH, delete físico y lógico
- [ ] **11.3** Carpeta `http/` en el mismo orden: get, create, update, delete
- [ ] **11.4** Cableado en `routes/index.ts` + `config` (import model + route)
- [ ] **11.5** Seeder + registro en SeedersRunner / counts
- [ ] **11.6** Swagger + registro en `src/swagger`

```bash
mkdir -p src/features/business/tipo-vehiculo/http
```

---

## 11.1 Modelo TipoVehiculo

```bash
: > src/features/business/tipo-vehiculo/tipo-vehiculo.model.ts
cat >> src/features/business/tipo-vehiculo/tipo-vehiculo.model.ts << 'EOF'
import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../../database/db";

export interface TipoVehiculoI {
  id?: number;
  name: string;
  description?: string | null;
  status: "active" | "inactive";
  createdAt?: Date;
  updatedAt?: Date;
}

export class TipoVehiculo extends Model {
  public id!: number;
  public name!: string;
  public description!: string | null;
  public status!: "active" | "inactive";
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

TipoVehiculo.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("active", "inactive"),
      defaultValue: "inactive",
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "TipoVehiculo",
    tableName: "tipos_vehiculo",
    timestamps: true,
  }
);
EOF
```
---

## 11.2 Controller + routes (CRUD completo)

```bash
: > src/features/business/tipo-vehiculo/tipo-vehiculo.controller.ts
cat >> src/features/business/tipo-vehiculo/tipo-vehiculo.controller.ts << 'EOF'
import { Request, Response } from "express";
import { TipoVehiculo, TipoVehiculoI } from "./tipo-vehiculo.model";

function paramId(req: Request): number {
  const raw = req.params.id;
  const value = Array.isArray(raw) ? raw[0] : raw;
  return Number(value);
}

export class TipoVehiculoController {
  // ================== READ ==================
  public async getAll(req: Request, res: Response) {
    try {
      const tipos_vehiculo = await TipoVehiculo.findAll({
        where: { status: "active" },
      });
      res.status(200).json({ tipos_vehiculo });
    } catch (error) {
      res.status(500).json({ error: "Error fetching vehiculo types", detail: String(error) });
    }
  }

  public async getOne(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const tipo_vehiculo = await TipoVehiculo.findByPk(id);
      if (!tipo_vehiculo) {
        res.status(404).json({ error: "Vehiculo type not found" });
        return;
      }
      res.status(200).json({ tipo_vehiculo });
    } catch (error) {
      res.status(500).json({ error: "Error fetching vehiculo type", detail: String(error) });
    }
  }

  // ================== CREATE ==================
  public async create(req: Request, res: Response) {
    try {
      const body = req.body as TipoVehiculoI;
      const tipo_vehiculo = await TipoVehiculo.create({
        name: body.name,
        description: body.description ?? null,
        status: body.status ?? "active",
      });
      res.status(201).json({ tipo_vehiculo });
    } catch (error) {
      res.status(500).json({ error: "Error creating vehiculo type", detail: String(error) });
    }
  }

  // ================== UPDATE ==================
  public async updatePut(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const body = req.body as TipoVehiculoI;
      const tipo_vehiculo = await TipoVehiculo.findByPk(id);
      if (!tipo_vehiculo) {
        res.status(404).json({ error: "Vehiculo type not found" });
        return;
      }

      await tipo_vehiculo.update({
        name: body.name,
        description: body.description ?? null,
        status: body.status ?? tipo_vehiculo.status,
      });

      res.status(200).json({ tipo_vehiculo });
    } catch (error) {
      res.status(500).json({ error: "Error updating vehiculo type (PUT)", detail: String(error) });
    }
  }

  public async updatePatch(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const body = req.body as Partial<TipoVehiculoI>;
      const tipo_vehiculo = await TipoVehiculo.findByPk(id);
      if (!tipo_vehiculo) {
        res.status(404).json({ error: "Vehiculo type not found" });
        return;
      }

      await tipo_vehiculo.update(body);
      res.status(200).json({ tipo_vehiculo });
    } catch (error) {
      res.status(500).json({ error: "Error updating vehiculo type (PATCH)", detail: String(error) });
    }
  }

  // ================== DELETE ==================
  /** Eliminación física */
  public async deletePhysical(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const tipo_vehiculo = await TipoVehiculo.findByPk(id);
      if (!tipo_vehiculo) {
        res.status(404).json({ error: "Vehiculo type not found" });
        return;
      }
      await tipo_vehiculo.destroy();
      res.status(200).json({ message: "Vehiculo type permanently deleted", id });
    } catch (error) {
      res.status(500).json({ error: "Error deleting vehiculo type", detail: String(error) });
    }
  }

  /** Eliminación lógica → status = inactive */
  public async deleteLogical(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const tipo_vehiculo = await TipoVehiculo.findByPk(id);
      if (!tipo_vehiculo) {
        res.status(404).json({ error: "Vehiculo type not found" });
        return;
      }
      await tipo_vehiculo.update({ status: "inactive" });
      res.status(200).json({
        message: "Vehiculo type deactivated (logical delete)",
        tipo_vehiculo,
      });
    } catch (error) {
      res.status(500).json({ error: "Error deactivating vehiculo type", detail: String(error) });
    }
  }
}
EOF
```
```bash
: > src/features/business/tipo-vehiculo/tipo-vehiculo.routes.ts
cat >> src/features/business/tipo-vehiculo/tipo-vehiculo.routes.ts << 'EOF'
import { Application } from "express";
import { TipoVehiculoController } from "./tipo-vehiculo.controller";

export class TipoVehiculoRoutes {
  public vehiculoTypeController: TipoVehiculoController = new TipoVehiculoController();

  public routes(app: Application): void {
    // ================== RUTAS SIN AUTENTICACIÓN / SIN MIDDLEWARE JWT ==================

    // getAll
    app
      .route("/api/tipos-vehiculo")
      .get(this.vehiculoTypeController.getAll.bind(this.vehiculoTypeController));

    // getOne
    app
      .route("/api/tipos-vehiculo/:id")
      .get(this.vehiculoTypeController.getOne.bind(this.vehiculoTypeController));

    // create
    app
      .route("/api/tipos-vehiculo")
      .post(this.vehiculoTypeController.create.bind(this.vehiculoTypeController));

    // update (PUT / PATCH)
    app
      .route("/api/tipos-vehiculo/:id")
      .put(this.vehiculoTypeController.updatePut.bind(this.vehiculoTypeController))
      .patch(this.vehiculoTypeController.updatePatch.bind(this.vehiculoTypeController));

    // delete físico
    app
      .route("/api/tipos-vehiculo/:id")
      .delete(this.vehiculoTypeController.deletePhysical.bind(this.vehiculoTypeController));

    // delete lógico
    app
      .route("/api/tipos-vehiculo/:id/deactivate")
      .patch(this.vehiculoTypeController.deleteLogical.bind(this.vehiculoTypeController));
  }
}
EOF
```
---

## 11.3 HTTP (REST Pasajero)

```bash
: > src/features/business/tipo-vehiculo/http/tipos-vehiculo.get.http
cat >> src/features/business/tipo-vehiculo/http/tipos-vehiculo.get.http << 'EOF'
### Feature TipoVehiculo — GET ALL / GET ONE
### Leyenda: SIN AUTH (sin middleware JWT / sin autenticación)
@baseUrl = http://localhost:4000
@id = 1

# @name getAllTipoVehiculos
GET {{baseUrl}}/api/tipos-vehiculo

###

# @name getOneTipoVehiculo
GET {{baseUrl}}/api/tipos-vehiculo/{{id}}
EOF
```

```bash
: > src/features/business/tipo-vehiculo/http/tipos-vehiculo.create.http
cat >> src/features/business/tipo-vehiculo/http/tipos-vehiculo.create.http << 'EOF'
### Feature TipoVehiculo — CREATE
### Leyenda: SIN AUTH (sin middleware JWT / sin autenticación)
@baseUrl = http://localhost:4000

# @name createTipoVehiculo
POST {{baseUrl}}/api/tipos-vehiculo
Content-Type: application/json

{
  "name": "Electrónica",
  "description": "Dispositivos y accesorios",
  "status": "active"
}
EOF
```
```bash
: > src/features/business/tipo-vehiculo/http/tipos-vehiculo.update.http
cat >> src/features/business/tipo-vehiculo/http/tipos-vehiculo.update.http << 'EOF'
### Feature TipoVehiculo — UPDATE (PUT) / UPDATE (PATCH)
### Leyenda: SIN AUTH (sin middleware JWT / sin autenticación)
@baseUrl = http://localhost:4000
@id = 1

# @name updateTipoVehiculoPut
PUT {{baseUrl}}/api/tipos-vehiculo/{{id}}
Content-Type: application/json

{
  "name": "Electrónica Actualizada",
  "description": "Categoría renovada",
  "status": "active"
}

###

# @name updateTipoVehiculoPatch
PATCH {{baseUrl}}/api/tipos-vehiculo/{{id}}
Content-Type: application/json

{
  "description": "Descripción parcial"
}
EOF
```
```bash
: > src/features/business/tipo-vehiculo/http/tipos-vehiculo.delete.http
cat >> src/features/business/tipo-vehiculo/http/tipos-vehiculo.delete.http << 'EOF'
### Feature TipoVehiculo — DELETE físico / DELETE lógico (status = inactive)
### Leyenda: SIN AUTH (sin middleware JWT / sin autenticación)
@baseUrl = http://localhost:4000
@id = 1

# @name deleteTipoVehiculoPhysical
DELETE {{baseUrl}}/api/tipos-vehiculo/{{id}}

###

# @name deleteTipoVehiculoLogical
PATCH {{baseUrl}}/api/tipos-vehiculo/{{id}}/deactivate
EOF
```
---

## 11.4 Cableado Routes + Config

**PARCHE** — `src/routes/index.ts` **ya existe**.

1. **Debajo de** `import { PasajeroRoutes } ...`, **añadir**:

```ts
import { TipoVehiculoRoutes } from "../features/business/tipo-vehiculo/tipo-vehiculo.routes";
```

2. **Dentro de** `export class Routes`, **debajo de** `pasajeroRoutes`, **añadir**:

```ts
  public vehiculoTypeRoutes: TipoVehiculoRoutes = new TipoVehiculoRoutes();
```

**PARCHE** — `src/config/index.ts` **ya existe**.

1. **Debajo de** `import "../features/business/pasajero/pasajero.model";`, **añadir**:

```ts
import "../features/business/tipo-vehiculo/tipo-vehiculo.model";
```

2. **Dentro de** `routes()`, **debajo de** `this.routePrv.pasajeroRoutes.routes(this.app);`, **añadir**:

```ts
    this.routePrv.vehiculoTypeRoutes.routes(this.app);
```

### Verificación

```bash
curl -s -X POST http://localhost:4000/api/tipos-vehiculo -H 'Content-Type: application/json' \
  -d '{"name":"Bebidas","description":"Refrescos","status":"active"}'
curl -s http://localhost:4000/api/tipos-vehiculo
```

---

## 11.5 Seeder TipoVehiculo

```bash
: > src/features/business/tipo-vehiculo/tipo-vehiculo.seeder.ts
cat >> src/features/business/tipo-vehiculo/tipo-vehiculo.seeder.ts << 'EOF'
import { faker } from "@faker-js/faker";
import { TipoVehiculo } from "./tipo-vehiculo.model";

/**
 * Seeder del feature TipoVehiculo (datos falsos con @faker-js/faker).
 * Se invoca desde `src/database/seeders` (SeedersRunner), no desde la App.
 *
 * Idempotente: si ya hay filas, no vuelve a insertar.
 */
export async function seedTipoVehiculos(count: number): Promise<number> {
  if (count <= 0) {
    console.log("⏭️  tipos_vehiculo: count=0, se omite");
    return 0;
  }

  const existing = await TipoVehiculo.count();
  if (existing > 0) {
    console.log(`⏭️  tipos_vehiculo: ya hay ${existing} registro(s), se omite seeder`);
    return 0;
  }

  const rows = Array.from({ length: count }, () => ({
    name: faker.commerce.department(),
    description: faker.commerce.vehiculoDescription(),
    status: "active" as const,
  }));

  await TipoVehiculo.bulkCreate(rows);
  console.log(`✅ tipos_vehiculo: insertados ${count} registro(s) falsos`);
  return count;
}
EOF
```
**PARCHE** — `src/database/seeders/counts.ts` **ya existe**.

- **Dentro de** `SeedCounts`, **añadir** `tipos_vehiculo: number;`
- **Dentro de** `DEFAULT_SEED_COUNTS`, **añadir** `tipos_vehiculo: 25,`
- **Dentro de** la resolución por env, **añadir** lectura de `SEED_TIPOS_VEHICULO` (ver archivo final abajo en ISS-08 si consolidás).

**PARCHE** — `src/database/seeders/index.ts` **ya existe**.

1. **Debajo de** imports de pasajero, **añadir** import de `seedTipoVehiculos`.
2. **Debajo de** `await seedPasajeros(...)`, **añadir** `await seedTipoVehiculos(counts.tipos_vehiculo);`

---

## 11.6 Swagger TipoVehiculo

```bash
: > src/features/business/tipo-vehiculo/tipo-vehiculo.swagger.ts
cat >> src/features/business/tipo-vehiculo/tipo-vehiculo.swagger.ts << 'EOF'
/**
 * Documentación OpenAPI del feature TipoVehiculo.
 * Se agrega desde `src/swagger` (registry externo), no se monta aquí.
 *
 * Leyenda: endpoints documentados como SIN AUTH (sin middleware JWT).
 */

export const vehiculoTypeSwagger = {
  tags: [
    {
      name: "TiposVehiculo",
      description: "CRUD de tipos de vehiculo — **SIN AUTH** (sin middleware JWT)",
    },
  ],
  paths: {
    "/api/tipos-vehiculo": {
      get: {
        tags: ["TiposVehiculo"],
        summary: "Listar tipos de vehiculo activos",
        description: "SIN AUTH — retorna tipos con status=active",
        security: [],
        responses: {
          "200": {
            description: "Lista de tipos de vehiculo",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    tipos_vehiculo: {
                      type: "array",
                      items: { $ref: "#/components/schemas/TipoVehiculo" },
                    },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["TiposVehiculo"],
        summary: "Crear tipo de vehiculo",
        description: "SIN AUTH",
        security: [],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/TipoVehiculoCreate" },
            },
          },
        },
        responses: {
          "201": {
            description: "Tipo de vehiculo creado",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    tipo_vehiculo: { $ref: "#/components/schemas/TipoVehiculo" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/tipos-vehiculo/{id}": {
      get: {
        tags: ["TiposVehiculo"],
        summary: "Obtener tipo de vehiculo por id",
        description: "SIN AUTH",
        security: [],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: {
          "200": {
            description: "Tipo de vehiculo encontrado",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    tipo_vehiculo: { $ref: "#/components/schemas/TipoVehiculo" },
                  },
                },
              },
            },
          },
          "404": { description: "No encontrado" },
        },
      },
      put: {
        tags: ["TiposVehiculo"],
        summary: "Actualizar tipo de vehiculo (PUT — reemplazo)",
        description: "SIN AUTH",
        security: [],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/TipoVehiculoUpdate" },
            },
          },
        },
        responses: {
          "200": { description: "Actualizado" },
          "404": { description: "No encontrado" },
        },
      },
      patch: {
        tags: ["TiposVehiculo"],
        summary: "Actualizar tipo de vehiculo (PATCH — parcial)",
        description: "SIN AUTH",
        security: [],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/TipoVehiculoPatch" },
            },
          },
        },
        responses: {
          "200": { description: "Actualizado" },
          "404": { description: "No encontrado" },
        },
      },
      delete: {
        tags: ["TiposVehiculo"],
        summary: "Eliminar tipo de vehiculo (físico)",
        description: "SIN AUTH — borra la fila",
        security: [],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: {
          "200": { description: "Eliminado" },
          "404": { description: "No encontrado" },
        },
      },
    },
    "/api/tipos-vehiculo/{id}/deactivate": {
      patch: {
        tags: ["TiposVehiculo"],
        summary: "Eliminar tipo de vehiculo (lógico)",
        description: "SIN AUTH — status = inactive",
        security: [],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: {
          "200": { description: "Desactivado" },
          "404": { description: "No encontrado" },
        },
      },
    },
  },
  components: {
    schemas: {
      TipoVehiculo: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          name: { type: "string", example: "Electrónica" },
          description: { type: "string", example: "Dispositivos y accesorios", nullable: true },
          status: { type: "string", enum: ["active", "inactive"], example: "active" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      TipoVehiculoCreate: {
        type: "object",
        required: ["name"],
        properties: {
          name: { type: "string" },
          description: { type: "string" },
          status: { type: "string", enum: ["active", "inactive"], default: "active" },
        },
      },
      TipoVehiculoUpdate: {
        type: "object",
        required: ["name"],
        properties: {
          name: { type: "string" },
          description: { type: "string" },
          status: { type: "string", enum: ["active", "inactive"] },
        },
      },
      TipoVehiculoPatch: {
        type: "object",
        properties: {
          name: { type: "string" },
          description: { type: "string" },
          status: { type: "string", enum: ["active", "inactive"] },
        },
      },
    },
  },
};
EOF
```
**PARCHE** — `src/swagger/index.ts` **ya existe**.

1. **Debajo de** `import { pasajeroSwagger } ...`, **añadir** import de `vehiculoTypeSwagger`.
2. **Dentro de** `featureSwaggerModules`, **debajo de** `pasajeroSwagger,`, **añadir** `vehiculoTypeSwagger,`.

### Cierre del ISS

```bash
npm run dev
```

> El servidor debe arrancar sin error. Detenerlo con Ctrl+C antes de continuar.

---

# 12. ISS-07 — Feature Empresa

> **Fuente:** SDD real de la pista con IA (`Prompt.md`). Sin dependencias.

**Tabla `empresas`**

| Campo | Tipo | Regla |
|---|---|---|
| id | PK autoincrement | |
| nit | STRING, UNIQUE | obligatorio |
| razon_social | STRING | obligatorio |
| contacto_principal | STRING | opcional |
| status | ENUM('active','inactive') | default `active` |
| createdAt / updatedAt | timestamps | |

**Invariante:** `nit` único (constraint + validación en `create`/`update`, 409 si ya existe).

**Sub-ítems** (mismo patrón que TipoVehiculo — ISS-06):
- **7.A** Modelo `empresa.model.ts` + GetAll (`GET /api/empresas`) + GetOne (`GET /api/empresas/:id`)
- **7.B** Create (`POST /api/empresas`)
- **7.C** Update PUT/PATCH (`PUT`/`PATCH /api/empresas/:id`)
- **7.D** Delete físico (`DELETE /api/empresas/:id`) y lógico (`PATCH /api/empresas/:id/deactivate`)

Carpeta: `src/features/business/empresa/` (+ `http/empresas.*.http`).
Cablear en `src/routes/index.ts` y en `src/config/index.ts` (import de modelo), igual que TipoVehiculo.

**Cierre ISS-07:** `npx tsc --noEmit` OK + `npm run dev` arranca + `GET/POST /api/empresas` responden.

---

# 13. ISS-08 — Feature Conductor + relación Empresa

**Tabla `conductores`** · FK → `empresas` (nullable)

| Campo | Tipo | Regla |
|---|---|---|
| id | PK autoincrement | |
| nombre | STRING | obligatorio, mín. 2 caracteres |
| descripcion | STRING/TEXT | opcional |
| empresa_id | FK → `empresas.id`, NULLABLE | si se envía: la Empresa debe existir y `status: active` (400/404 si no) |
| status | ENUM('active','inactive') | default `active` |
| createdAt / updatedAt | timestamps | |

**Sub-ítems:**
- **8.A** Modelo + GetAll + GetOne
- **8.B** Create (valida `empresa_id` si viene)
- **8.C** Update PUT/PATCH
- **8.D** Delete físico y lógico
- **8.R** `conductor.associations.ts`: `Conductor.belongsTo(Empresa, { foreignKey: "empresa_id", as: "empresa" })`, `Empresa.hasMany(Conductor, { foreignKey: "empresa_id", as: "conductores" })` + PARCHE en `config/index.ts` para cargar las asociaciones

Carpeta: `src/features/business/conductor/`. Rutas: `/api/conductores`.

**Cierre ISS-08:** igual patrón — `tsc --noEmit` OK, server arranca, CRUD responde, FK validada.

---

# 14. ISS-09 — Feature Vehiculo + relación Empresa / TipoVehiculo

**Tabla `vehiculos`** · FK → `empresas` (obligatoria), `tipos_vehiculo` (opcional)

| Campo | Tipo | Regla |
|---|---|---|
| id | PK autoincrement | |
| nombre | STRING | obligatorio |
| descripcion | STRING/TEXT | opcional |
| empresa_id | FK → `empresas.id`, **obligatoria** | la Empresa debe existir y `status: active` (400/404 si no) |
| tipo_vehiculo_id | FK → `tipos_vehiculo.id`, NULLABLE | *(reaprovecha ISS-06)* si se envía, debe existir |
| status | ENUM('active','inactive') | default `active` |
| createdAt / updatedAt | timestamps | |

**Sub-ítems:**
- **9.A** Modelo + GetAll + GetOne
- **9.B** Create (valida `empresa_id` obligatoria; `tipo_vehiculo_id` opcional)
- **9.C** Update PUT/PATCH
- **9.D** Delete físico y lógico
- **9.R** `vehiculo.associations.ts`: `Vehiculo.belongsTo(Empresa, ...)`, `Empresa.hasMany(Vehiculo, ...)`, `Vehiculo.belongsTo(TipoVehiculo, { foreignKey: "tipo_vehiculo_id", as: "tipo" })`, `TipoVehiculo.hasMany(Vehiculo, { foreignKey: "tipo_vehiculo_id", as: "vehiculos" })` + PARCHE en `config/index.ts`

Carpeta: `src/features/business/vehiculo/`. Rutas: `/api/vehiculos`.

**Cierre ISS-09:** mismo patrón de verificación.

---

# 15. ISS-10 — Feature Turno + relación Conductor / Vehiculo

**Tabla `turnos`** · FK → `conductores` y `vehiculos` (ambas obligatorias)

| Campo | Tipo | Regla |
|---|---|---|
| id | PK autoincrement | |
| nombre | STRING | obligatorio |
| descripcion | STRING/TEXT | opcional |
| conductor_id | FK → `conductores.id`, obligatoria | debe existir y `status: active` |
| vehiculo_id | FK → `vehiculos.id`, obligatoria | debe existir y `status: active` |
| status | ENUM('active','inactive') | default `active` |
| createdAt / updatedAt | timestamps | |

**Invariante de negocio:** un `conductor_id` y un `vehiculo_id` solo pueden estar en **un turno `active` a la vez**. Al crear/activar un turno, validar que no exista ya otro turno `status: active` con el mismo `conductor_id` o el mismo `vehiculo_id` (409 si choca).

**Sub-ítems:**
- **10.A** Modelo + GetAll + GetOne
- **10.B** Create (valida FKs activas + regla de unicidad de turno activo)
- **10.C** Update PUT/PATCH (misma validación de unicidad si cambia `status` a `active`)
- **10.D** Delete físico y lógico
- **10.R** `turno.associations.ts`: `Turno.belongsTo(Conductor, ...)`, `Conductor.hasMany(Turno, ...)`, `Turno.belongsTo(Vehiculo, ...)`, `Vehiculo.hasMany(Turno, ...)` + PARCHE en `config/index.ts`

Carpeta: `src/features/business/turno/`. Rutas: `/api/turnos`.

**Cierre ISS-10:** mismo patrón de verificación, incluyendo probar el 409 de turno duplicado.

---

# 16. ISS-11 — Feature Tarifa

**Tabla `tarifas`** · Sin dependencias

| Campo | Tipo | Regla |
|---|---|---|
| id | PK autoincrement | |
| nombre | STRING | obligatorio |
| regla_calculo | STRING/TEXT | descripción de la regla (ej. "base + km") |
| valor_base | DECIMAL | obligatorio, **> 0** |
| vigencia_desde | DATE | obligatorio |
| vigencia_hasta | DATE | obligatorio, **> vigencia_desde** |
| status | ENUM('active','inactive') | default `active` |
| createdAt / updatedAt | timestamps | |

**Invariantes:**
- `valor_base > 0` (400 si no)
- `vigencia_desde < vigencia_hasta` (400 si no)
- **Sin solape de vigencias activas**: no puede existir otra Tarifa `status: active` cuyo rango se cruce con el de la nueva (409 si choca)

**Sub-ítems:**
- **11.A** Modelo + GetAll + GetOne
- **11.B** Create (valida las 3 reglas de arriba)
- **11.C** Update PUT/PATCH (revalida solape si cambian fechas o `status`)
- **11.D** Delete físico y lógico
- **11.E** `GET /api/tarifas/vigente` → tarifa `active` cuya vigencia cubre la fecha actual (404 si ninguna aplica)

Carpeta: `src/features/business/tarifa/`. Rutas: `/api/tarifas` (+ `/vigente`).

**Cierre ISS-11:** mismo patrón, incluyendo probar el 409 de solape y el 404 de `/vigente` sin datos.

---

# 17. ISS-12 — Feature Carrera + relaciones (Pasajero / Turno / Tarifa)

**Tabla `carreras`** · FK → `pasajeros`, `turnos`, `tarifas` (obligatorias); `liquidaciones` (nullable, se llena en ISS-15)

| Campo | Tipo | Regla |
|---|---|---|
| id | PK autoincrement | |
| pasajero_id | FK → `pasajeros.id`, obligatoria | debe existir |
| turno_id | FK → `turnos.id`, obligatoria | debe existir y `status: active` |
| tarifa_id | FK → `tarifas.id`, obligatoria | debe existir y `status: active` |
| fecha_inicio | DATETIME | se fija al crear |
| fecha_fin | DATETIME, NULLABLE | se fija al cerrar (transición a `cerrada`) |
| total | DECIMAL, NULLABLE | **calculado en servidor** desde `Tarifa.valor_base` — nunca recibido del body |
| estado | ENUM('solicitada','aceptada','en_curso','cerrada','cancelada') | default `solicitada` |
| observaciones | STRING/TEXT | opcional |
| liquidacion_id | FK → `liquidaciones.id`, NULLABLE | se asigna solo en ISS-15 |
| createdAt / updatedAt | timestamps | |

**Invariantes:**
- `total` siempre calculado en servidor, nunca aceptado del cliente.
- Transiciones válidas únicamente: `solicitada → aceptada → en_curso → cerrada`, o cualquiera de las tres primeras `→ cancelada`. Cualquier otra transición → 409.

**Sub-ítems:**
- **12.A** Modelo + GetAll + GetOne
- **12.B** Create (crea siempre en `solicitada`; valida las 3 FK)
- **12.C** `PATCH /api/carreras/:id/estado` — único endpoint autorizado para cambiar `estado`, valida la transición (409 si es inválida); al llegar a `cerrada` fija `fecha_fin` y calcula `total`
- **12.D** Delete físico y lógico (uso limitado — una Carrera normalmente se cancela, no se borra; documentar esa distinción en el `.http`)
- **12.R** `carrera.associations.ts`: `Carrera.belongsTo(Pasajero, ...)`, `Pasajero.hasMany(Carrera, ...)`, `Carrera.belongsTo(Turno, ...)`, `Turno.hasMany(Carrera, ...)`, `Carrera.belongsTo(Tarifa, ...)`, `Tarifa.hasMany(Carrera, ...)` + PARCHE en `config/index.ts`

**Nota:** no se expone `update` libre de `estado` vía PUT/PATCH normal — solo vía `12.C`.

Carpeta: `src/features/business/carrera/`. Rutas: `/api/carreras` + `PATCH /api/carreras/:id/estado`.

**Cierre ISS-12:** mismo patrón, incluyendo probar una transición inválida (409) y el cálculo de `total` al cerrar.

---

# 18. ISS-13 — Feature Pago (inmutable)

**Tabla `pagos`** · Referencia polimórfica hacia Carrera (por ahora único tipo soportado, **sin FK física**)

| Campo | Tipo | Regla |
|---|---|---|
| id | PK autoincrement | |
| referencia_tipo | STRING | siempre `'carrera'` por ahora |
| referencia_id | INTEGER | id de la Carrera — **sin FK física** (ver nota abajo) |
| metodo | STRING | obligatorio (ej. efectivo, tarjeta) |
| monto | DECIMAL | **tomado de `Carrera.total` en el servidor**, se ignora si el body lo manda |
| fecha | DATETIME | default now |
| estado | STRING | ej. `'registrado'` |
| createdAt / updatedAt | timestamps | **sin `status`, sin soft delete — Pago es inmutable** |

**Invariantes:**
- Al crear: la Carrera referenciada por `referencia_id` debe existir y tener `estado: cerrada` (400/409 si no).
- `monto` se copia de `Carrera.total` en el servidor.
- **No se crea FK física** `pagos.referencia_id → carreras.id` — la integridad se valida en el controller (a propósito, así lo pide el SDD: una FK directa asumiría que `referencia_tipo` siempre es `'carrera'`).

**Sub-ítems:**
- **13.A** Modelo + GetAll + GetOne
- **13.B** Create (valida Carrera cerrada, copia `monto`)
- (No hay 13.C ni 13.D — **Pago no tiene update ni delete**, ninguna ruta PUT/PATCH/DELETE)

Carpeta: `src/features/business/pago/`. Rutas: `/api/pagos` — solo GET all, GET :id, POST.

**Cierre ISS-13:** `tsc --noEmit` OK, server arranca, POST rechaza si la Carrera no está `cerrada`, POST exitoso copia el monto correcto.

---

# 19. ISS-14 — Feature Calificacion + relación Carrera (0..1)

**Tabla `calificaciones`** · FK → `carreras` (UNIQUE, 0..1)

| Campo | Tipo | Regla |
|---|---|---|
| id | PK autoincrement | |
| carrera_id | FK → `carreras.id`, **UNIQUE** | una Carrera tiene máximo una calificación |
| puntaje | INTEGER | obligatorio, rango 1–5 |
| comentario | STRING/TEXT | opcional |
| status | ENUM('active','inactive') | default `active` |
| createdAt / updatedAt | timestamps | |

**Invariantes:**
- Solo se puede calificar una Carrera con `estado: cerrada` (400/409 si no).
- Máximo una calificación por carrera (constraint UNIQUE en `carrera_id`; 409 si ya existe).
- `puntaje` entre 1 y 5 (400 si no).

**Sub-ítems:**
- **14.A** Modelo + GetAll + GetOne
- **14.B** Create (valida Carrera cerrada + unicidad + rango de `puntaje`)
- **14.C** Update PUT/PATCH
- **14.D** Delete físico y lógico
- **14.R** `calificacion.associations.ts`: `Calificacion.belongsTo(Carrera, { foreignKey: "carrera_id", as: "carrera" })`, `Carrera.hasOne(Calificacion, { foreignKey: "carrera_id", as: "calificacion" })` + PARCHE en `config/index.ts`

Carpeta: `src/features/business/calificacion/`. Rutas: `/api/calificaciones`.

**Cierre ISS-14:** mismo patrón, incluyendo probar el 409 de segunda calificación sobre la misma Carrera.

---

# 20. ISS-15 — Feature Liquidacion (transaccional)

**Tabla `liquidaciones`** · Agrupa Carreras cerradas de un Conductor en un rango de fechas

| Campo | Tipo | Regla |
|---|---|---|
| id | PK autoincrement | |
| conductor_id | FK → `conductores.id` | recibida en el `create`, debe existir |
| fecha_desde | DATE | recibida en el `create`, obligatoria |
| fecha_hasta | DATE | recibida en el `create`, obligatoria, **> fecha_desde** |
| fecha | DATETIME | fecha de generación, default now |
| valor | DECIMAL | **calculado**: suma de `total` de las carreras agrupadas |
| estado | STRING | ej. `'generada'` |
| observaciones | STRING/TEXT | opcional |
| createdAt / updatedAt | timestamps | **sin `status`, sin soft delete — igual que Pago, es un registro contable cerrado** |

**Lógica de creación (transaccional — `sequelize.transaction`):**
1. Recibe `conductor_id`, `fecha_desde`, `fecha_hasta`.
2. Busca las Carreras con `estado: cerrada`, `liquidacion_id: null`, cuyo `turno.conductor_id` sea el recibido, y `fecha_fin` dentro del rango.
3. Si no hay ninguna → 400 (nada que liquidar).
4. Crea la Liquidacion con `valor` = suma de esos `total`.
5. Actualiza cada Carrera encontrada con `liquidacion_id` = el id recién creado.
6. Pasos 2–5 en una única transacción: si algo falla, rollback completo.

**Sub-ítems:**
- **15.A** Modelo + GetAll + GetOne
- **15.B** Create (la lógica transaccional completa de arriba)
- (No hay 15.C ni 15.D — **sin update libre ni delete**, solo GET all, GET :id, POST)
- **15.R** `liquidacion.associations.ts`: `Liquidacion.hasMany(Carrera, { foreignKey: "liquidacion_id", as: "carreras" })`, `Carrera.belongsTo(Liquidacion, { foreignKey: "liquidacion_id", as: "liquidacion" })` + PARCHE en `config/index.ts`

Carpeta: `src/features/business/liquidacion/`. Rutas: `/api/liquidaciones` — solo GET all, GET :id, POST.

**Cierre ISS-15:** `tsc --noEmit` OK, server arranca, POST agrupa correctamente y deja las Carreras con `liquidacion_id` seteado, `valor` coincide con la suma real.

---

---

# Fase III — Auth con RBAC (ISS-16 a ISS-22 + Cierre)

> El curso oficial del profesor numera esta fase como **ISS-09 a ISS-15** (ver índice:
> https://tecnogua.com/academic/site/backend2026/). Como en `movicab-express` esos números ya
> quedaron ocupados por las entidades extra de negocio (Empresa…Liquidacion), esta fase continúa
> la numeración donde íbamos: **ISS-16 a ISS-22**, en el mismo orden y con el mismo contenido
> técnico que el profesor publicó para su ISS-09 a ISS-15 — solo cambia el número de bloque.
>
> **El código de esta fase (hashing, JWT, transacciones de rotación) es largo y de seguridad.**
> En vez de retranscribirlo aquí (riesgo de un typo en código crítico), cada ISS trae: qué hace,
> qué tablas/rutas crea, los criterios de aceptación, el link a la página oficial con el código
> exacto (`cat >>`/PARCHE verbatim), y las adaptaciones puntuales para MoviCab.

## ISS-16 — Auth base: seguridad y los 6 modelos RBAC
*(= ISS-09 oficial)* → https://tecnogua.com/academic/site/backend2026/manual/11-ISS-09-auth-base/

Crea la base transversal de seguridad y los 6 modelos de identidad/RBAC (sin controllers/rutas aún):
- `shared/auth/password.ts` (bcrypt: hash, compare, token opaco, sha256)
- `shared/auth/jwt.ts` (firmar/verificar access token HS256, RFC 7519/8725)
- `shared/auth/resource-match.ts` (match de `(method, path)` contra la matriz)
- `shared/auth/auth-user.ts` (tipo de `req.auth` + `requireAuthUser`)
- `shared/http/error-response.ts`, `shared/http/swagger-security.ts`
- 6 modelos: `User`, `Role`, `Resource`, `RoleUser`, `ResourceRole`, `RefreshToken`

**Adaptación MoviCab:** ninguna — este ISS es 100% genérico, no toca entidades de negocio. Sigue la página tal cual.

**Variables nuevas en `.env`:** `JWT_SECRET`, `JWT_ACCESS_TTL`, `JWT_REFRESH_TTL_DAYS` (están en la sección §14.1 de la página).

**Cierre:** `npx tsc --noEmit` OK (todavía sin rutas montadas).

---

## ISS-17 — Feature Users (identidad y contraseña)
*(= ISS-10 oficial)* → https://tecnogua.com/academic/site/backend2026/manual/12-ISS-10-auth-users/

CRUD completo de `users` (`username`, `email` único, `password` hasheado con bcrypt, `avatar`, `status`), modalidad **JWT + RBAC**, rutas `/api/usuarios...`.

**Adaptación MoviCab:** ninguna estructural — es un feature nuevo e independiente, igual que en el curso. Puedes usar `src/features/auth/users/` tal cual.

**Cierre:** CRUD de usuarios responde con 401/403 correctos una vez montado (se verifica junto con ISS-20).

---

## ISS-18 — Features Roles y Resources
*(= ISS-11 oficial)* → https://tecnogua.com/academic/site/backend2026/manual/13-ISS-11-auth-roles-resources/

- `roles` (catálogo: `ADMIN`, `SELLER`, ... — en MoviCab decide qué roles tienen sentido, p.ej. `ADMIN`, `DESPACHO`, `CONDUCTOR`, `FINANZAS`, consistente con `Prompt.md`)
- `resources` (catálogo de `(method, path)` protegibles — un recurso por cada endpoint real)

**Adaptación MoviCab — la única sustancial de toda la Fase III:** el `resource-catalog.ts` del curso lista 58 recursos para **5** entidades de negocio genéricas (`clients`, `product-types`, `products`, `sales`, `product-sales` × ~7 operaciones c/u). En `movicab-express` el catálogo debe cubrir las **11** entidades reales (`pasajero`, `tipo-vehiculo`, `empresa`, `conductor`, `vehiculo`, `turno`, `tarifa`, `carrera`, `pago`, `calificacion`, `liquidacion`), cada una con sus propias rutas (`/api/pasajeros`, `/api/empresas`, etc. — `pago` y `liquidacion` sin update/delete, ver sus ISS). El número total de recursos será distinto a 58; constrúyelo contando las rutas reales que ya existen en `src/routes/index.ts`.

**Roles sugeridos para MoviCab** (ajusta si no cuadra con tu `Prompt.md`): `ADMIN` (todas las operaciones) y un segundo rol de solo-lectura/operación limitada, análogo a `SELLER` del curso (p.ej. `DESPACHO`: lectura de todo + creación/actualización de `Carrera`).

**Cierre:** `npx tsc --noEmit` OK; catálogo de recursos poblado por seeder, verificable con `GET /api/recursos` (una vez montado en ISS-20).

---

## ISS-19 — Features RoleUsers y ResourceRoles (la matriz)
*(= ISS-12 oficial)* → https://tecnogua.com/academic/site/backend2026/manual/14-ISS-12-auth-role-users-resource-roles/

Las dos tablas pivote: `role_users` (usuario↔rol) y `resource_roles` (rol↔recurso = el permiso real). Incluye `reconcileRole` (asignar/retirar/reactivar sin duplicar filas).

**Adaptación MoviCab:** ninguna estructural. El **contenido** del seeder de `resource_roles` (qué rol recibe qué recursos) debe corresponder al catálogo ya adaptado en ISS-18, no al listado literal del curso (que asume `SELLER` con 7 permisos sobre las 5 entidades genéricas).

**Cierre:** `GET /api/permisos` (una vez montado en ISS-22) refleja la matriz real de MoviCab.

---

## ISS-20 — Middlewares de acceso y las 3 modalidades
*(= ISS-13 oficial)* → https://tecnogua.com/academic/site/backend2026/manual/15-ISS-13-auth-access/

Crea `authenticate` (modalidad JWT) y `authorize` (modalidad JWT+RBAC), y hace el **PARCHE** que inserta `authenticate, authorize` en las rutas de negocio ya existentes.

**Adaptación MoviCab — IMPORTANTE:** la página parchea 5 archivos de ejemplo (`clients.routes.ts`, `product-types.routes.ts`, `products.routes.ts`, `sales.routes.ts`, `product-sales.routes.ts`). En `movicab-express` el PARCHE debe aplicarse a los **11** archivos de rutas reales: `pasajero.routes.ts`, `tipo-vehiculo.routes.ts`, `empresa.routes.ts`, `conductor.routes.ts`, `vehiculo.routes.ts`, `turno.routes.ts`, `tarifa.routes.ts`, `carrera.routes.ts`, `pago.routes.ts`, `calificacion.routes.ts`, `liquidacion.routes.ts`. El cambio en cada uno es idéntico al patrón que muestra la página (import de `authenticate, authorize` desde `../../auth/access`, insertados antes del handler en cada verbo) — solo cambia el nombre de la clase/archivo y la ruta base.

**Cierre:** probar con `curl` que una ruta de negocio (p.ej. `GET /api/pasajeros`) responde 401 sin token y 403 con token pero sin concesión — igual que el ISS-13 original, adaptado a tus rutas.

---

## ISS-21 — Feature RefreshTokens (sesiones)
*(= ISS-14 oficial)* → https://tecnogua.com/academic/site/backend2026/manual/16-ISS-14-auth-refresh-tokens/

Persistencia de sesiones como tokens opacos (hasheados), con **rotación** en cada refresh y **revocación de familia** ante reutilización (reuse detection). Rutas `/api/sesiones...`, modalidad **JWT** (sin `authorize`: ver/revocar tus propias sesiones no es un permiso de la matriz).

**Adaptación MoviCab:** ninguna — feature 100% genérico, no depende de entidades de negocio.

**Cierre:** rotar dos veces el mismo refresh token dispara la revocación de toda la familia (verificable por SQL directo a `refresh_tokens`).

---

## ISS-22 — Feature Session (login, refresh, logout, perfil, permisos)
*(= ISS-15 oficial)* → https://tecnogua.com/academic/site/backend2026/manual/17-ISS-15-auth-session/

El punto de entrada: `POST /api/sesion/login` (OPEN), `/refresh` y `/logout` (OPEN con credencial de sesión), `GET /api/sesion/perfil` y `GET /api/permisos` (JWT). Demuestra las tres modalidades conviviendo.

**Adaptación MoviCab:** ninguna estructural. Los usuarios de prueba (`admin`/`Admin123!`, `seller`/`Seller123!` en el curso) pásalos por los que hayas sembrado en tu seeder de `users` del ISS-17 — usa los identificadores/roles reales de MoviCab si los nombraste distinto.

**Cierre:** el recorrido E2E de la página (login OPEN → perfil JWT → `GET /api/pasajeros` JWT+RBAC → 403 con un rol sin esa concesión) pasa igual, apuntando a tus rutas MoviCab en vez de `/api/clientes`.

---

## Cierre Fase III — Auth con RBAC (backend completo)
*(= Cierre-Auth oficial)* → https://tecnogua.com/academic/site/backend2026/manual/18-cierre-auth/

Cableado final: `config/index.ts` importa los 6 modelos RBAC + las asociaciones (`rbac.associations.ts`) y monta **las 7 rutas de auth** (`sessionRoutes`, `refreshTokensRoutes`, `usersRoutes`, `rolesRoutes`, `resourcesRoutes`, `roleUsersRoutes`, `resourceRolesRoutes`) junto a las **11 de negocio** ya existentes; `routes/index.ts` agrega las 7+11 clases; `swagger/index.ts` fusiona los 7 módulos de auth + los 11 de negocio; `database/seeders/index.ts` corre primero seguridad (`roles → resources → users → role_users → resource_roles`) y después las 11 de negocio en orden de dependencias (Empresa → Conductor/Vehiculo → Turno → Tarifa → Pasajero/TipoVehiculo → Carrera → Pago/Calificacion → Liquidacion).

**Adaptación MoviCab:** en el PARCHE de `config/index.ts`, `routes/index.ts`, `swagger/index.ts` y `seeders/index.ts`, sustituye los imports/clases de las 5 entidades genéricas del curso por las **11 reales de MoviCab** (mismo patrón, solo cambian los nombres). El resto (orden seguridad→negocio, estructura de carpetas, mapa de las 3 modalidades) es idéntico.

**DoD final del laboratorio (adaptado a MoviCab):**
- [ ] **18 features** (11 negocio + 7 auth), cada uno `controller → service/repository → model` (o el patrón MVC simplificado que ya vienes usando)
- [ ] **16 tablas**: `pasajeros`, `tipos_vehiculo`, `empresas`, `conductores`, `vehiculos`, `turnos`, `tarifas`, `carreras`, `pagos`, `calificaciones`, `liquidaciones`, `users`, `roles`, `resources`, `role_users`, `resource_roles`, `refresh_tokens` *(17 si cuentas `carrera_vehiculos` del diseño original — confirmar si sigue existiendo)*
- [ ] **3 modalidades** aplicadas por ruta: OPEN, JWT, JWT + RBAC
- [ ] `deny by default`: sin concesión activa → 403
- [ ] Access token corto + refresh token opaco/hasheado/rotativo/revocable
- [ ] Seeders deterministas de seguridad + seeders de negocio ya existentes
- [ ] Swagger `/api/docs` con `bearerAuth` y las 3 modalidades documentadas
- [ ] `npx tsc --noEmit` OK y smoke test E2E de las tres modalidades en verde


# 24. Estructura final de la Fase II — Business (antes de Auth, tras ISS-15)

## DoD del backend (dominio completo, SIN AUTH)

Al cerrar ISS-15 el backend cubre el mismo dominio que la pista con IA:

- [ ] 11 features: `pasajero`, `tipo-vehiculo`, `empresa`, `conductor`, `vehiculo`, `turno`, `tarifa`, `carrera`, `pago`, `calificacion`, `liquidacion`
- [ ] 11 tablas correspondientes (ver tabla de entidades arriba)
- [ ] APIs bajo `/api/...` para cada una, más `PATCH /api/carreras/:id/estado` y `GET /api/tarifas/vigente`
- [ ] SeedersRunner + Swagger `/api/docs` (si se extienden a las nuevas entidades)
- [ ] **Sin** autenticación ni autorización (todas las rutas SIN AUTH)
- [ ] `npx tsc --noEmit` OK

```text
movicab-express/
├── src/
│   ├── config/index.ts
│   ├── database/
│   │   ├── db.ts
│   │   └── seeders/{counts,index}.ts
│   ├── features/
│   │   └── business/
│   │       ├── pasajero/
│   │       ├── tipo-vehiculo/
│   │       ├── empresa/
│   │       ├── conductor/           # + associations + http
│   │       ├── vehiculo/            # + associations + http
│   │       ├── turno/               # + associations + http
│   │       ├── tarifa/              # + http
│   │       ├── carrera/             # + associations + http
│   │       ├── pago/                # sin update/delete
│   │       ├── calificacion/        # + associations + http
│   │       └── liquidacion/         # + associations + http, sin update/delete
│   ├── routes/index.ts
│   ├── swagger/index.ts
│   └── server.ts
└── …
```

| Método | Ruta | Nota |
|--------|------|------|
| * | `/api/pasajeros…` | SIN AUTH (ISS-03) |
| * | `/api/tipos-vehiculo…` | SIN AUTH (ISS-06) |
| * | `/api/empresas…` | SIN AUTH (ISS-07) |
| * | `/api/conductores…` | SIN AUTH (ISS-08) |
| * | `/api/vehiculos…` | SIN AUTH (ISS-09) |
| * | `/api/turnos…` | SIN AUTH (ISS-10) |
| * | `/api/tarifas…` + `/vigente` | SIN AUTH (ISS-11) |
| * | `/api/carreras…` + `PATCH .../estado` | SIN AUTH (ISS-12) |
| GET/POST | `/api/pagos…` | SIN AUTH (ISS-13, inmutable) |
| * | `/api/calificaciones…` | SIN AUTH (ISS-14) |
| GET/POST | `/api/liquidaciones…` | SIN AUTH (ISS-15, transaccional) |
| GET | `/api/docs` | Swagger UI (si se extiende) |
| GET | `/api/docs.json` | OpenAPI JSON (si se extiende) |

### Norma de nombres (carpeta, clase, tabla, FK) — se mantiene igual

| Pieza | Norma | Ejemplo |
|-------|-------|---------|
| Carpeta feature | kebab-case | `tipo-vehiculo/`, `calificacion/` |
| Clase | PascalCase singular | `Empresa`, `Conductor`, `Turno`, `Tarifa`, `Liquidacion` |
| Tabla BD | snake_case plural | `empresas`, `conductores`, `liquidaciones` |
| FK | singular de la tabla referenciada + `_id` | `empresa_id`, `conductor_id`, `turno_id`, `tarifa_id`, `liquidacion_id` |
| Columnas de negocio | snake_case | `razon_social`, `valor_base`, `vigencia_desde`, `fecha_inicio` |

No uses camelCase en tablas (`razonSocial` ❌ → `razon_social` ✅).

Con BD limpia, `sequelize.sync` crea FKs snake_case desde modelos/`*.associations.ts`.

### Cómo repetir el patrón (otra entidad)

```text
ISS-n-A…D  CRUD + http (Modelo+Get, Create, Update, Delete)
ISS-n-R    si hay FK: associations.ts + PARCHE config
```

---

# 25. Referencia rápida de paquetes (Fase I + II, sin Auth)

Sin paquetes nuevos respecto a ISS-01/02/05 — Empresa, Conductor, Vehiculo, Turno, Tarifa,
Carrera, Pago, Calificacion y Liquidacion se construyen con lo ya instalado (`express`,
`sequelize` + drivers, `bcryptjs` si se necesitara, `swagger-ui-express`). Solo se usa
`sequelize.transaction()` (ya incluido en el paquete `sequelize`) para ISS-15.

```bash
npm install express@^5.2.1 cors@^2.8.6 dotenv@^17.4.2 morgan@^1.12.1 \
  sequelize@^6.37.8 mysql2@^3.24.4 pg@^8.23.0 pg-hstore@^2.3.4 \
  tedious@^20.0.0 oracledb@^7.0.1 bcryptjs@^3.0.3 \
  swagger-ui-express@^5.0.1

npm install -D typescript@~5.9.2 ts-node@^10.9.2 nodemon@^3.1.14 \
  @types/node@^22.20.3 @types/express@^5.0.6 \
  @types/cors@^2.8.19 @types/morgan@^1.9.10 \
  @types/sequelize@^6.12.0 @types/bcryptjs@^3.0.0 \
  @types/swagger-ui-express@^4.1.8 \
  @faker-js/faker@^10.6.0
```

---

# 26. Fuentes

- **Este manual** es la única guía de construcción (ISS, spec por sub-ítem A…D/R).
- ISS-01 a ISS-06 (Pasajero, TipoVehiculo) siguieron el ejemplo genérico StoreLab del profesor, adaptado con `cat >>`/**PARCHE** literal.
- ISS-07 a ISS-15 (Empresa, Conductor, Vehiculo, Turno, Tarifa, Carrera, Pago, Calificacion, Liquidacion) siguen el **SDD real de la pista con IA** (contrato de arquitectura MoviCab Backend), no el enunciado genérico — la IA (Antigravity) implementa el código a partir de esta especificación y lo verifica ella misma, en vez de copiar bloques literales.

