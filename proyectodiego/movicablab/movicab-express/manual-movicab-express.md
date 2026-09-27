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
1. ISS-00     Requisitos previos
2. ISS-01     Esqueleto del proyecto           (2.1 … 2.5)
3. ISS-02     Infraestructura de BD            (3.1 … 3.3)
4. ISS-03-A   Feature Pasajero — fundación
5. ISS-03-B   Feature Pasajero — GetAll / GetOne
6. ISS-03-C   Feature Pasajero — Crear
7. ISS-03-D   Feature Pasajero — Update PUT/PATCH
8. ISS-03-E   Feature Pasajero — Delete físico / lógico
9. ISS-04     Seeders Faker (feature + runner) (9.1 … 9.2)
10. ISS-05    Swagger OpenAPI (feature + registry) → `/api/docs`
11. ISS-06    Feature TipoVehiculo              (11.1 … 11.6)
12. ISS-07    Feature Vehiculo + relación       (12.1 … 12.6 / 12.5 R)
13. ISS-08    Feature Carrera + feature CarreraVehiculo + R (13.1 … 13.7)
14.           Estructura final del repo + verificación global
15.           Referencia de paquetes
```

```text
ISS-00 → … → ISS-05 → ISS-06 → ISS-07 (+R) → ISS-08 (+R) → DONE (business SIN AUTH)
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
| **07** | Vehiculo CRUD + **relación** TipoVehiculo↔Vehiculo `/api/vehiculos` |
| **08** | Carrera + **feature CarreraVehiculo** + relaciones; `/api/carreras` + `/api/detalle-carreras` |

### Entidades / tablas cubiertas por ISS (business)

| Tabla BD | Clase | Feature | ISS | API |
|----------|-------|---------|-----|-----|
| `pasajeros` | Pasajero | `pasajero/` | ISS-03-A…E (+04 seeder, +05 swagger) | `/api/pasajeros` |
| `tipos_vehiculo` | TipoVehiculo | `tipo-vehiculo/` | ISS-06 | `/api/tipos-vehiculo` |
| `vehiculos` | Vehiculo | `vehiculo/` | ISS-07 (+R) | `/api/vehiculos` |
| `carreras` | Carrera | `carrera/` | ISS-08 | `/api/carreras` |
| `carrera_vehiculos` | CarreraVehiculo | `carrera-vehiculo/` | ISS-08 | `/api/detalle-carreras` |

Todas las tablas: `id` + `status` (`active`\|`inactive`) + `timestamps`. FKs y columnas en **snake_case**.

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

# 12. ISS-07 — Feature Vehiculo (vehiculos)

**Objetivo:** CRUD de Vehiculo con FK `tipo_vehiculo_id`.  
**Bloqueado por:** ISS-06.  
**API:** `/api/vehiculos` — **SIN AUTH**.

### Criterios de aceptación (ISS-07)

- [ ] **12.1** Modelo Vehiculo con `tipo_vehiculo_id`
- [ ] **12.2** Controller valida tipo **activo** en create/updatePut
- [ ] **12.3** Routes + http/ en orden getAll, getOne, create, update PUT/PATCH, delete físico y lógico
- [ ] **12.4** Cableado routes/config
- [ ] **12.5** **Relaciones** Vehiculo ↔ TipoVehiculo (archivo associations + import)
- [ ] **12.6** Seeder + swagger

```bash
mkdir -p src/features/business/vehiculo/http
```

---

## 12.1 Modelo Vehiculo

```bash
: > src/features/business/vehiculo/vehiculo.model.ts
cat >> src/features/business/vehiculo/vehiculo.model.ts << 'EOF'
import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../../database/db";

export interface VehiculoI {
  id?: number;
  name: string;
  brand: string;
  price: number;
  min_stock: number;
  quantity: number;
  tipo_vehiculo_id: number;
  status: "active" | "inactive";
  createdAt?: Date;
  updatedAt?: Date;
}

export class Vehiculo extends Model {
  public id!: number;
  public name!: string;
  public brand!: string;
  public price!: number;
  public min_stock!: number;
  public quantity!: number;
  public tipo_vehiculo_id!: number;
  public status!: "active" | "inactive";
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Vehiculo.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    brand: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },
    min_stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    tipo_vehiculo_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("active", "inactive"),
      defaultValue: "inactive",
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Vehiculo",
    tableName: "vehiculos",
    timestamps: true,
  }
);
EOF
```
---

## 12.2 Controller + routes

```bash
: > src/features/business/vehiculo/vehiculo.controller.ts
cat >> src/features/business/vehiculo/vehiculo.controller.ts << 'EOF'
import { Request, Response } from "express";
import { Vehiculo, VehiculoI } from "./vehiculo.model";
import { TipoVehiculo } from "../tipo-vehiculo/tipo-vehiculo.model";

function paramId(req: Request): number {
  const raw = req.params.id;
  const value = Array.isArray(raw) ? raw[0] : raw;
  return Number(value);
}

async function assertActiveTipoVehiculo(tipo_vehiculo_id: number): Promise<{ ok: true } | { ok: false; status: number; error: string }> {
  const vehiculoType = await TipoVehiculo.findByPk(tipo_vehiculo_id);
  if (!vehiculoType) {
    return { ok: false, status: 404, error: "Vehiculo type not found" };
  }
  if (vehiculoType.status !== "active") {
    return { ok: false, status: 400, error: "Vehiculo type must be active" };
  }
  return { ok: true };
}

export class VehiculoController {
  // ================== READ ==================
  public async getAll(req: Request, res: Response) {
    try {
      const vehiculos = await Vehiculo.findAll({
        where: { status: "active" },
      });
      res.status(200).json({ vehiculos });
    } catch (error) {
      res.status(500).json({ error: "Error fetching vehiculos", detail: String(error) });
    }
  }

  public async getOne(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const vehiculo = await Vehiculo.findByPk(id);
      if (!vehiculo) {
        res.status(404).json({ error: "Vehiculo not found" });
        return;
      }
      res.status(200).json({ vehiculo });
    } catch (error) {
      res.status(500).json({ error: "Error fetching vehiculo", detail: String(error) });
    }
  }

  // ================== CREATE ==================
  public async create(req: Request, res: Response) {
    try {
      const body = req.body as VehiculoI;
      const check = await assertActiveTipoVehiculo(Number(body.tipo_vehiculo_id));
      if (!check.ok) {
        res.status(check.status).json({ error: check.error });
        return;
      }

      const vehiculo = await Vehiculo.create({
        name: body.name,
        brand: body.brand,
        price: body.price,
        min_stock: body.min_stock,
        quantity: body.quantity,
        tipo_vehiculo_id: body.tipo_vehiculo_id,
        status: body.status ?? "active",
      });
      res.status(201).json({ vehiculo });
    } catch (error) {
      res.status(500).json({ error: "Error creating vehiculo", detail: String(error) });
    }
  }

  // ================== UPDATE ==================
  public async updatePut(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const body = req.body as VehiculoI;
      const vehiculo = await Vehiculo.findByPk(id);
      if (!vehiculo) {
        res.status(404).json({ error: "Vehiculo not found" });
        return;
      }

      const check = await assertActiveTipoVehiculo(Number(body.tipo_vehiculo_id));
      if (!check.ok) {
        res.status(check.status).json({ error: check.error });
        return;
      }

      await vehiculo.update({
        name: body.name,
        brand: body.brand,
        price: body.price,
        min_stock: body.min_stock,
        quantity: body.quantity,
        tipo_vehiculo_id: body.tipo_vehiculo_id,
        status: body.status ?? vehiculo.status,
      });

      res.status(200).json({ vehiculo });
    } catch (error) {
      res.status(500).json({ error: "Error updating vehiculo (PUT)", detail: String(error) });
    }
  }

  public async updatePatch(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const body = req.body as Partial<VehiculoI>;
      const vehiculo = await Vehiculo.findByPk(id);
      if (!vehiculo) {
        res.status(404).json({ error: "Vehiculo not found" });
        return;
      }

      if (body.tipo_vehiculo_id !== undefined) {
        const check = await assertActiveTipoVehiculo(Number(body.tipo_vehiculo_id));
        if (!check.ok) {
          res.status(check.status).json({ error: check.error });
          return;
        }
      }

      await vehiculo.update(body);
      res.status(200).json({ vehiculo });
    } catch (error) {
      res.status(500).json({ error: "Error updating vehiculo (PATCH)", detail: String(error) });
    }
  }

  // ================== DELETE ==================
  /** Eliminación física */
  public async deletePhysical(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const vehiculo = await Vehiculo.findByPk(id);
      if (!vehiculo) {
        res.status(404).json({ error: "Vehiculo not found" });
        return;
      }
      await vehiculo.destroy();
      res.status(200).json({ message: "Vehiculo permanently deleted", id });
    } catch (error) {
      res.status(500).json({ error: "Error deleting vehiculo", detail: String(error) });
    }
  }

  /** Eliminación lógica → status = inactive */
  public async deleteLogical(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const vehiculo = await Vehiculo.findByPk(id);
      if (!vehiculo) {
        res.status(404).json({ error: "Vehiculo not found" });
        return;
      }
      await vehiculo.update({ status: "inactive" });
      res.status(200).json({
        message: "Vehiculo deactivated (logical delete)",
        vehiculo,
      });
    } catch (error) {
      res.status(500).json({ error: "Error deactivating vehiculo", detail: String(error) });
    }
  }
}
EOF
```
```bash
: > src/features/business/vehiculo/vehiculo.routes.ts
cat >> src/features/business/vehiculo/vehiculo.routes.ts << 'EOF'
import { Application } from "express";
import { VehiculoController } from "./vehiculo.controller";

export class VehiculoRoutes {
  public vehiculoController: VehiculoController = new VehiculoController();

  public routes(app: Application): void {
    // ================== RUTAS SIN AUTENTICACIÓN / SIN MIDDLEWARE JWT ==================

    // getAll
    app
      .route("/api/vehiculos")
      .get(this.vehiculoController.getAll.bind(this.vehiculoController));

    // getOne
    app
      .route("/api/vehiculos/:id")
      .get(this.vehiculoController.getOne.bind(this.vehiculoController));

    // create
    app
      .route("/api/vehiculos")
      .post(this.vehiculoController.create.bind(this.vehiculoController));

    // update (PUT / PATCH)
    app
      .route("/api/vehiculos/:id")
      .put(this.vehiculoController.updatePut.bind(this.vehiculoController))
      .patch(this.vehiculoController.updatePatch.bind(this.vehiculoController));

    // delete físico
    app
      .route("/api/vehiculos/:id")
      .delete(this.vehiculoController.deletePhysical.bind(this.vehiculoController));

    // delete lógico
    app
      .route("/api/vehiculos/:id/deactivate")
      .patch(this.vehiculoController.deleteLogical.bind(this.vehiculoController));
  }
}
EOF
```
---

## 12.3 HTTP

```bash
: > src/features/business/vehiculo/http/vehiculos.get.http
cat >> src/features/business/vehiculo/http/vehiculos.get.http << 'EOF'
### Feature Vehiculo — GET ALL / GET ONE
### Leyenda: SIN AUTH (sin middleware JWT / sin autenticación)
@baseUrl = http://localhost:4000
@id = 1

# @name getAllVehiculos
GET {{baseUrl}}/api/vehiculos

###

# @name getOneVehiculo
GET {{baseUrl}}/api/vehiculos/{{id}}
EOF
```

```bash
: > src/features/business/vehiculo/http/vehiculos.create.http
cat >> src/features/business/vehiculo/http/vehiculos.create.http << 'EOF'
### Feature Vehiculo — CREATE
### Leyenda: SIN AUTH (sin middleware JWT / sin autenticación)
@baseUrl = http://localhost:4000

# @name createVehiculo
POST {{baseUrl}}/api/vehiculos
Content-Type: application/json

{
  "name": "Laptop Pro",
  "brand": "TechBrand",
  "price": 1299.99,
  "min_stock": 5,
  "quantity": 50,
  "tipo_vehiculo_id": 1,
  "status": "active"
}
EOF
```
```bash
: > src/features/business/vehiculo/http/vehiculos.update.http
cat >> src/features/business/vehiculo/http/vehiculos.update.http << 'EOF'
### Feature Vehiculo — UPDATE (PUT) / UPDATE (PATCH)
### Leyenda: SIN AUTH (sin middleware JWT / sin autenticación)
@baseUrl = http://localhost:4000
@id = 1

# @name updateVehiculoPut
PUT {{baseUrl}}/api/vehiculos/{{id}}
Content-Type: application/json

{
  "name": "Laptop Pro Max",
  "brand": "TechBrand",
  "price": 1499.99,
  "min_stock": 5,
  "quantity": 40,
  "tipo_vehiculo_id": 1,
  "status": "active"
}

###

# @name updateVehiculoPatch
PATCH {{baseUrl}}/api/vehiculos/{{id}}
Content-Type: application/json

{
  "price": 1399.99,
  "quantity": 45
}
EOF
```
```bash
: > src/features/business/vehiculo/http/vehiculos.delete.http
cat >> src/features/business/vehiculo/http/vehiculos.delete.http << 'EOF'
### Feature Vehiculo — DELETE físico / DELETE lógico (status = inactive)
### Leyenda: SIN AUTH (sin middleware JWT / sin autenticación)
@baseUrl = http://localhost:4000
@id = 1

# @name deleteVehiculoPhysical
DELETE {{baseUrl}}/api/vehiculos/{{id}}

###

# @name deleteVehiculoLogical
PATCH {{baseUrl}}/api/vehiculos/{{id}}/deactivate
EOF
```
---

## 12.4 Cableado

**PARCHE** — `src/routes/index.ts`:

- **Debajo de** import TipoVehiculoRoutes, **añadir** VehiculoRoutes.
- **Dentro de** `Routes`, **añadir** `vehiculoRoutes`.

**PARCHE** — `src/config/index.ts`:

- **Debajo de** import tipo-vehiculo.model, **añadir** `import "../features/business/vehiculo/vehiculo.model";`
- **Dentro de** `routes()`, **añadir** `this.routePrv.vehiculoRoutes.routes(this.app);`

---

## 12.5 Relación TipoVehiculo ↔ Vehiculo (**obligatorio al cerrar la tabla Vehiculo**)

> Norma FK: `tipo_vehiculo_id` (tabla `tipos_vehiculo` → singular `tipo_vehiculo` + `_id`).

> Cuando una tabla nueva **se relaciona** con una ya existente, al final se agrega este paso:
> archivo de asociaciones + **PARCHE** en `config` para cargarlo (side-effect).

```bash
: > src/features/business/vehiculo/vehiculo.associations.ts
cat >> src/features/business/vehiculo/vehiculo.associations.ts << 'EOF'
import { Vehiculo } from "./vehiculo.model";
import { TipoVehiculo } from "../tipo-vehiculo/tipo-vehiculo.model";

Vehiculo.belongsTo(TipoVehiculo, { foreignKey: "tipo_vehiculo_id", as: "tipo_vehiculo" });
TipoVehiculo.hasMany(Vehiculo, { foreignKey: "tipo_vehiculo_id", as: "vehiculos" });
EOF
```
**PARCHE** — `src/config/index.ts` **ya existe**.

**Debajo de** los imports de modelos Vehiculo / TipoVehiculo (y **encima de** `import { Routes }`), **añadir**:

```ts
import "../features/business/vehiculo/vehiculo.associations";
```

Archivo **nuevo** (lab — alinea FK camelCase → snake_case antes del `sync`):


**PARCHE** — `src/config/index.ts`: **debajo de** `import { sequelize, getDatabaseInfo, testConnection } from "../database/db";`, **añadir**:

```ts
```

**Dentro de** `dbConnection()`, **reemplazar** el bloque de `sequelize.sync(...)` por el de `src/config/index.ts` del repo (`SET FOREIGN_KEY_CHECKS` en MySQL, y opcional `DB_SYNC_FORCE=true`). Con BD limpia no hace falta rename legacy.


Esto registra en Sequelize:

- `Vehiculo.belongsTo(TipoVehiculo, { foreignKey: "tipo_vehiculo_id", as: "tipo_vehiculo" })`
- `TipoVehiculo.hasMany(Vehiculo, { foreignKey: "tipo_vehiculo_id", as: "vehiculos" })`

### Verificación relación

```bash
curl -s -X POST http://localhost:4000/api/vehiculos -H 'Content-Type: application/json' \
  -d '{"name":"Cola","brand":"ACME","price":2.5,"min_stock":5,"quantity":100,"tipo_vehiculo_id":1,"status":"active"}'
curl -s http://localhost:4000/api/vehiculos
```

---

## 12.6 Seeder + Swagger Vehiculo

```bash
: > src/features/business/vehiculo/vehiculo.seeder.ts
cat >> src/features/business/vehiculo/vehiculo.seeder.ts << 'EOF'
import { faker } from "@faker-js/faker";
import { Vehiculo } from "./vehiculo.model";
import { TipoVehiculo } from "../tipo-vehiculo/tipo-vehiculo.model";

/**
 * Seeder del feature Vehiculo (datos falsos con @faker-js/faker).
 * Se invoca desde `src/database/seeders` (SeedersRunner), no desde la App.
 *
 * Requiere tipos de vehiculo activos. Idempotente: si ya hay filas, no inserta.
 */
export async function seedVehiculos(count: number): Promise<number> {
  if (count <= 0) {
    console.log("⏭️  vehiculos: count=0, se omite");
    return 0;
  }

  const existing = await Vehiculo.count();
  if (existing > 0) {
    console.log(`⏭️  vehiculos: ya hay ${existing} registro(s), se omite seeder`);
    return 0;
  }

  const types = await TipoVehiculo.findAll({ where: { status: "active" } });
  if (types.length === 0) {
    console.log("⏭️  vehiculos: no hay tipos de vehiculo activos, se omite seeder");
    return 0;
  }

  const rows = Array.from({ length: count }, () => {
    const type = types[Math.floor(Math.random() * types.length)];
    return {
      name: faker.commerce.vehiculoName(),
      brand: faker.company.name(),
      price: Number(faker.commerce.price({ min: 5, max: 500, dec: 2 })),
      min_stock: faker.number.int({ min: 1, max: 10 }),
      quantity: faker.number.int({ min: 20, max: 100 }),
      tipo_vehiculo_id: type.id,
      status: "active" as const,
    };
  });

  await Vehiculo.bulkCreate(rows);
  console.log(`✅ vehiculos: insertados ${count} registro(s) falsos`);
  return count;
}
EOF
```
```bash
: > src/features/business/vehiculo/vehiculo.swagger.ts
cat >> src/features/business/vehiculo/vehiculo.swagger.ts << 'EOF'
/**
 * Documentación OpenAPI del feature Vehiculo.
 * Se agrega desde `src/swagger` (registry externo), no se monta aquí.
 *
 * Leyenda: endpoints documentados como SIN AUTH (sin middleware JWT).
 */

export const vehiculoSwagger = {
  tags: [
    {
      name: "Vehiculos",
      description: "CRUD de vehiculos — **SIN AUTH** (sin middleware JWT)",
    },
  ],
  paths: {
    "/api/vehiculos": {
      get: {
        tags: ["Vehiculos"],
        summary: "Listar vehiculos activos",
        description: "SIN AUTH — retorna vehiculos con status=active",
        security: [],
        responses: {
          "200": {
            description: "Lista de vehiculos",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    vehiculos: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Vehiculo" },
                    },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Vehiculos"],
        summary: "Crear vehiculo",
        description: "SIN AUTH — tipo_vehiculo_id debe existir y estar active",
        security: [],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/VehiculoCreate" },
            },
          },
        },
        responses: {
          "201": {
            description: "Vehiculo creado",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    vehiculo: { $ref: "#/components/schemas/Vehiculo" },
                  },
                },
              },
            },
          },
          "400": { description: "Tipo de vehiculo inactivo" },
          "404": { description: "Tipo de vehiculo no encontrado" },
        },
      },
    },
    "/api/vehiculos/{id}": {
      get: {
        tags: ["Vehiculos"],
        summary: "Obtener vehiculo por id",
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
            description: "Vehiculo encontrado",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    vehiculo: { $ref: "#/components/schemas/Vehiculo" },
                  },
                },
              },
            },
          },
          "404": { description: "No encontrado" },
        },
      },
      put: {
        tags: ["Vehiculos"],
        summary: "Actualizar vehiculo (PUT — reemplazo)",
        description: "SIN AUTH — tipo_vehiculo_id debe existir y estar active",
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
              schema: { $ref: "#/components/schemas/VehiculoUpdate" },
            },
          },
        },
        responses: {
          "200": { description: "Actualizado" },
          "400": { description: "Tipo de vehiculo inactivo" },
          "404": { description: "No encontrado" },
        },
      },
      patch: {
        tags: ["Vehiculos"],
        summary: "Actualizar vehiculo (PATCH — parcial)",
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
              schema: { $ref: "#/components/schemas/VehiculoPatch" },
            },
          },
        },
        responses: {
          "200": { description: "Actualizado" },
          "404": { description: "No encontrado" },
        },
      },
      delete: {
        tags: ["Vehiculos"],
        summary: "Eliminar vehiculo (físico)",
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
    "/api/vehiculos/{id}/deactivate": {
      patch: {
        tags: ["Vehiculos"],
        summary: "Eliminar vehiculo (lógico)",
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
      Vehiculo: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          name: { type: "string", example: "Laptop Pro" },
          brand: { type: "string", example: "TechBrand" },
          price: { type: "number", example: 1299.99 },
          min_stock: { type: "integer", example: 5 },
          quantity: { type: "integer", example: 50 },
          tipo_vehiculo_id: { type: "integer", example: 1 },
          status: { type: "string", enum: ["active", "inactive"], example: "active" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      VehiculoCreate: {
        type: "object",
        required: ["name", "brand", "price", "min_stock", "quantity", "tipo_vehiculo_id"],
        properties: {
          name: { type: "string" },
          brand: { type: "string" },
          price: { type: "number" },
          min_stock: { type: "integer" },
          quantity: { type: "integer" },
          tipo_vehiculo_id: { type: "integer" },
          status: { type: "string", enum: ["active", "inactive"], default: "active" },
        },
      },
      VehiculoUpdate: {
        type: "object",
        required: ["name", "brand", "price", "min_stock", "quantity", "tipo_vehiculo_id"],
        properties: {
          name: { type: "string" },
          brand: { type: "string" },
          price: { type: "number" },
          min_stock: { type: "integer" },
          quantity: { type: "integer" },
          tipo_vehiculo_id: { type: "integer" },
          status: { type: "string", enum: ["active", "inactive"] },
        },
      },
      VehiculoPatch: {
        type: "object",
        properties: {
          name: { type: "string" },
          brand: { type: "string" },
          price: { type: "number" },
          min_stock: { type: "integer" },
          quantity: { type: "integer" },
          tipo_vehiculo_id: { type: "integer" },
          status: { type: "string", enum: ["active", "inactive"] },
        },
      },
    },
  },
};
EOF
```
**PARCHE** counts / SeedersRunner / swagger registry: añadir `vehiculos` (default 15), `seedVehiculos`, `vehiculoSwagger` (mismo patrón que ISS-06).

### Cierre del ISS

```bash
npm run dev
```

> El servidor debe arrancar sin error. Detenerlo con Ctrl+C antes de continuar.

---

# 13. ISS-08 — Feature Carrera + feature CarreraVehiculo (carreras)

**Objetivo:** carreras con ítems N:M vía feature propio `carrera-vehiculo/` (tabla `carrera_vehiculos`, API `/api/detalle-carreras`; detalle: `quantity`, `unit_price`, `line_total`); create transaccional de cabecera+ítems en `/api/carreras` con stock.  
**Bloqueado por:** ISS-07 (+ Pasajero ISS-03).  
**API:** `/api/carreras` (cabecera) y `/api/detalle-carreras` (líneas) — **SIN AUTH**.

### Criterios de aceptación (ISS-08)

- [ ] Feature propio `src/features/business/carrera-vehiculo/` (model, controller, routes, seeder, swagger, http, associations)
- [ ] Rutas `/api/detalle-carreras` montadas en aggregators
- [ ] **13.1** Modelos `carrera` + feature `carrera-vehiculo/` (tabla `carrera_vehiculos`)
- [ ] **13.2** Controller Carrera y CarreraVehiculo en orden getAll, getOne, create, update PUT/PATCH, delete físico y lógico (el create de Carrera sigue siendo transaccional: pasajero activo, stock, totales)
- [ ] **13.3** Routes `/api/carreras` + `/api/detalle-carreras` + http/ en ese mismo orden
- [ ] **13.4** Seeders: `carreras` (cabeceras) → `carrera_vehiculos` (líneas); clave `carrera_vehiculos` en SeedCounts; swagger registry
- [ ] **13.5** **Relaciones** Pasajero↔Carrera (`carrera.associations`) y Carrera↔CarreraVehiculo↔Vehiculo (`carrera-vehiculo.associations`)
- [ ] **13.6** Swagger Carrera + CarreraVehiculo
- [ ] **13.7** Estado final consolidado (config / routes / seeders / swagger)

```bash
mkdir -p src/features/business/carrera/http
mkdir -p src/features/business/carrera-vehiculo/http
```

---

## 13.1 Modelos Carrera y feature CarreraVehiculo (`carrera-vehiculo/`)

```bash
: > src/features/business/carrera/carrera.model.ts
cat >> src/features/business/carrera/carrera.model.ts << 'EOF'
import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../../database/db";

export interface CarreraI {
  id?: number;
  carrera_date: Date | string;
  subtotal: number;
  tax: number;
  discounts: number;
  total: number;
  pasajero_id: number;
  status: "active" | "inactive";
  createdAt?: Date;
  updatedAt?: Date;
}

export class Carrera extends Model {
  public id!: number;
  public carrera_date!: Date;
  public subtotal!: number;
  public tax!: number;
  public discounts!: number;
  public total!: number;
  public pasajero_id!: number;
  public status!: "active" | "inactive";
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Carrera.init(
  {
    carrera_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    subtotal: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0,
    },
    tax: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0,
    },
    discounts: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0,
    },
    total: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0,
    },
    pasajero_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("active", "inactive"),
      defaultValue: "inactive",
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Carrera",
    tableName: "carreras",
    timestamps: true,
  }
);
EOF
```
```bash
: > src/features/business/carrera-vehiculo/carrera-vehiculo.model.ts
cat >> src/features/business/carrera-vehiculo/carrera-vehiculo.model.ts << 'EOF'
import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../../database/db";

/**
 * Detalle N:M Carrera ↔ Vehiculo (tabla `carrera_vehiculos`).
 * Opción A lab: feature propio `carrera-vehiculo/`; nombre de tabla `carrera_vehiculos`.
 * `unit_price` = snapshot del precio al vender; `line_total` = quantity × unit_price.
 */
export interface CarreraVehiculoI {
  id?: number;
  carrera_id: number;
  vehiculo_id: number;
  quantity: number;
  unit_price: number;
  line_total: number;
  status: "active" | "inactive";
  createdAt?: Date;
  updatedAt?: Date;
}

export class CarreraVehiculo extends Model {
  public id!: number;
  public carrera_id!: number;
  public vehiculo_id!: number;
  public quantity!: number;
  public unit_price!: number;
  public line_total!: number;
  public status!: "active" | "inactive";
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

CarreraVehiculo.init(
  {
    carrera_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    vehiculo_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    unit_price: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },
    line_total: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("active", "inactive"),
      defaultValue: "inactive",
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "CarreraVehiculo",
    tableName: "carrera_vehiculos",
    timestamps: true,
  }
);
EOF
```

## 13.1b Associations CarreraVehiculo

```bash
: > src/features/business/carrera-vehiculo/carrera-vehiculo.associations.ts
cat >> src/features/business/carrera-vehiculo/carrera-vehiculo.associations.ts << 'EOF'
import { CarreraVehiculo } from "./carrera-vehiculo.model";
import { Carrera } from "../carrera/carrera.model";
import { Vehiculo } from "../vehiculo/vehiculo.model";

CarreraVehiculo.belongsTo(Carrera, { foreignKey: "carrera_id", as: "carrera" });
CarreraVehiculo.belongsTo(Vehiculo, { foreignKey: "vehiculo_id", as: "vehiculo" });
Carrera.hasMany(CarreraVehiculo, { foreignKey: "carrera_id", as: "items" });
Vehiculo.hasMany(CarreraVehiculo, { foreignKey: "vehiculo_id", as: "carrera_items" });
EOF
```

## 13.2b Controller CarreraVehiculo

```bash
: > src/features/business/carrera-vehiculo/carrera-vehiculo.controller.ts
cat >> src/features/business/carrera-vehiculo/carrera-vehiculo.controller.ts << 'EOF'
import { Request, Response } from "express";
import { Transaction } from "sequelize";
import { sequelize } from "../../../database/db";
import { CarreraVehiculo, CarreraVehiculoI } from "./carrera-vehiculo.model";
import { Carrera } from "../carrera/carrera.model";
import { Vehiculo } from "../vehiculo/vehiculo.model";

function paramId(req: Request): number {
  const raw = req.params.id;
  const value = Array.isArray(raw) ? raw[0] : raw;
  return Number(value);
}

async function recalcCarreraTotals(carrera_id: number, t: Transaction): Promise<void> {
  const items = await CarreraVehiculo.findAll({
    where: { carrera_id, status: "active" },
    transaction: t,
  });
  const subtotal = items.reduce((sum, row) => sum + Number(row.line_total), 0);
  const carrera = await Carrera.findByPk(carrera_id, { transaction: t });
  if (!carrera) return;
  const total = subtotal + Number(carrera.tax) - Number(carrera.discounts);
  await carrera.update({ subtotal, total }, { transaction: t });
}

export class CarreraVehiculoController {
  // ================== READ ==================
  public async getAll(req: Request, res: Response) {
    try {
      const carrera_vehiculos = await CarreraVehiculo.findAll({
        where: { status: "active" },
      });
      res.status(200).json({ carrera_vehiculos });
    } catch (error) {
      res.status(500).json({ error: "Error fetching vehiculo carreras", detail: String(error) });
    }
  }

  public async getOne(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const vehiculo_carrera = await CarreraVehiculo.findByPk(id);
      if (!vehiculo_carrera) {
        res.status(404).json({ error: "Vehiculo carrera not found" });
        return;
      }
      res.status(200).json({ vehiculo_carrera });
    } catch (error) {
      res.status(500).json({ error: "Error fetching vehiculo carrera", detail: String(error) });
    }
  }

  // ================== CREATE ==================
  /** Agrega una línea a una venta existente (ajusta stock y totales). */
  public async create(req: Request, res: Response) {
    const t = await sequelize.transaction();
    try {
      const body = req.body as Pick<CarreraVehiculoI, "carrera_id" | "vehiculo_id" | "quantity" | "status">;

      if (!body.carrera_id || !body.vehiculo_id || !body.quantity || body.quantity < 1) {
        await t.rollback();
        res.status(400).json({ error: "carrera_id, vehiculo_id and quantity (>=1) are required" });
        return;
      }

      const carrera = await Carrera.findByPk(body.carrera_id, { transaction: t });
      if (!carrera) {
        await t.rollback();
        res.status(404).json({ error: "Carrera not found" });
        return;
      }
      if (carrera.status !== "active") {
        await t.rollback();
        res.status(400).json({ error: "Carrera must be active" });
        return;
      }

      const vehiculo = await Vehiculo.findByPk(body.vehiculo_id, {
        transaction: t,
        lock: t.LOCK.UPDATE,
      });
      if (!vehiculo) {
        await t.rollback();
        res.status(404).json({ error: "Vehiculo not found" });
        return;
      }
      if (vehiculo.status !== "active") {
        await t.rollback();
        res.status(400).json({ error: "Vehiculo must be active" });
        return;
      }
      if (vehiculo.quantity < body.quantity) {
        await t.rollback();
        res.status(400).json({
          error: "Insufficient stock",
          available: vehiculo.quantity,
          requested: body.quantity,
        });
        return;
      }

      const unit_price = Number(vehiculo.price);
      const line_total = unit_price * body.quantity;

      const vehiculo_carrera = await CarreraVehiculo.create(
        {
          carrera_id: body.carrera_id,
          vehiculo_id: body.vehiculo_id,
          quantity: body.quantity,
          unit_price,
          line_total,
          status: body.status ?? "active",
        },
        { transaction: t }
      );

      await vehiculo.update(
        { quantity: vehiculo.quantity - body.quantity },
        { transaction: t }
      );
      await recalcCarreraTotals(body.carrera_id, t);

      await t.commit();
      res.status(201).json({ vehiculo_carrera });
    } catch (error) {
      await t.rollback();
      res.status(500).json({ error: "Error creating vehiculo carrera", detail: String(error) });
    }
  }

  // ================== UPDATE ==================
  public async updatePut(req: Request, res: Response) {
    const t = await sequelize.transaction();
    try {
      const id = paramId(req);
      const body = req.body as Pick<CarreraVehiculoI, "quantity" | "status">;
      const vehiculo_carrera = await CarreraVehiculo.findByPk(id, {
        transaction: t,
        lock: t.LOCK.UPDATE,
      });
      if (!vehiculo_carrera) {
        await t.rollback();
        res.status(404).json({ error: "Vehiculo carrera not found" });
        return;
      }

      const newQty = Number(body.quantity);
      if (!newQty || newQty < 1) {
        await t.rollback();
        res.status(400).json({ error: "quantity (>=1) is required" });
        return;
      }

      const vehiculo = await Vehiculo.findByPk(vehiculo_carrera.vehiculo_id, {
        transaction: t,
        lock: t.LOCK.UPDATE,
      });
      if (!vehiculo) {
        await t.rollback();
        res.status(404).json({ error: "Vehiculo not found" });
        return;
      }

      const delta = newQty - vehiculo_carrera.quantity;
      if (delta > 0 && vehiculo.quantity < delta) {
        await t.rollback();
        res.status(400).json({
          error: "Insufficient stock",
          available: vehiculo.quantity,
          requested_extra: delta,
        });
        return;
      }

      const unit_price = Number(vehiculo_carrera.unit_price);
      const line_total = unit_price * newQty;

      await vehiculo.update(
        { quantity: vehiculo.quantity - delta },
        { transaction: t }
      );
      await vehiculo_carrera.update(
        {
          quantity: newQty,
          line_total,
          status: body.status ?? vehiculo_carrera.status,
        },
        { transaction: t }
      );
      await recalcCarreraTotals(vehiculo_carrera.carrera_id, t);

      await t.commit();
      res.status(200).json({ vehiculo_carrera });
    } catch (error) {
      await t.rollback();
      res.status(500).json({ error: "Error updating vehiculo carrera (PUT)", detail: String(error) });
    }
  }

  public async updatePatch(req: Request, res: Response) {
    const t = await sequelize.transaction();
    try {
      const id = paramId(req);
      const body = req.body as Partial<Pick<CarreraVehiculoI, "quantity" | "status">>;
      const vehiculo_carrera = await CarreraVehiculo.findByPk(id, {
        transaction: t,
        lock: t.LOCK.UPDATE,
      });
      if (!vehiculo_carrera) {
        await t.rollback();
        res.status(404).json({ error: "Vehiculo carrera not found" });
        return;
      }

      if (body.quantity !== undefined) {
        const newQty = Number(body.quantity);
        if (!newQty || newQty < 1) {
          await t.rollback();
          res.status(400).json({ error: "quantity must be >= 1" });
          return;
        }

        const vehiculo = await Vehiculo.findByPk(vehiculo_carrera.vehiculo_id, {
          transaction: t,
          lock: t.LOCK.UPDATE,
        });
        if (!vehiculo) {
          await t.rollback();
          res.status(404).json({ error: "Vehiculo not found" });
          return;
        }

        const delta = newQty - vehiculo_carrera.quantity;
        if (delta > 0 && vehiculo.quantity < delta) {
          await t.rollback();
          res.status(400).json({
            error: "Insufficient stock",
            available: vehiculo.quantity,
            requested_extra: delta,
          });
          return;
        }

        await vehiculo.update(
          { quantity: vehiculo.quantity - delta },
          { transaction: t }
        );
        await vehiculo_carrera.update(
          {
            quantity: newQty,
            line_total: Number(vehiculo_carrera.unit_price) * newQty,
          },
          { transaction: t }
        );
      }

      if (body.status !== undefined) {
        await vehiculo_carrera.update({ status: body.status }, { transaction: t });
      }

      await recalcCarreraTotals(vehiculo_carrera.carrera_id, t);
      await t.commit();
      res.status(200).json({ vehiculo_carrera });
    } catch (error) {
      await t.rollback();
      res.status(500).json({ error: "Error updating vehiculo carrera (PATCH)", detail: String(error) });
    }
  }

  // ================== DELETE ==================
  /** Eliminación física: restaura stock y recalcula totales de la venta */
  public async deletePhysical(req: Request, res: Response) {
    const t = await sequelize.transaction();
    try {
      const id = paramId(req);
      const vehiculo_carrera = await CarreraVehiculo.findByPk(id, {
        transaction: t,
        lock: t.LOCK.UPDATE,
      });
      if (!vehiculo_carrera) {
        await t.rollback();
        res.status(404).json({ error: "Vehiculo carrera not found" });
        return;
      }

      const vehiculo = await Vehiculo.findByPk(vehiculo_carrera.vehiculo_id, {
        transaction: t,
        lock: t.LOCK.UPDATE,
      });
      if (vehiculo && vehiculo_carrera.status === "active") {
        await vehiculo.update(
          { quantity: vehiculo.quantity + vehiculo_carrera.quantity },
          { transaction: t }
        );
      }

      const carrera_id = vehiculo_carrera.carrera_id;
      await vehiculo_carrera.destroy({ transaction: t });
      await recalcCarreraTotals(carrera_id, t);

      await t.commit();
      res.status(200).json({ message: "Vehiculo carrera permanently deleted", id });
    } catch (error) {
      await t.rollback();
      res.status(500).json({ error: "Error deleting vehiculo carrera", detail: String(error) });
    }
  }

  /** Eliminación lógica → status = inactive (restaura stock y recalcula) */
  public async deleteLogical(req: Request, res: Response) {
    const t = await sequelize.transaction();
    try {
      const id = paramId(req);
      const vehiculo_carrera = await CarreraVehiculo.findByPk(id, {
        transaction: t,
        lock: t.LOCK.UPDATE,
      });
      if (!vehiculo_carrera) {
        await t.rollback();
        res.status(404).json({ error: "Vehiculo carrera not found" });
        return;
      }

      if (vehiculo_carrera.status === "active") {
        const vehiculo = await Vehiculo.findByPk(vehiculo_carrera.vehiculo_id, {
          transaction: t,
          lock: t.LOCK.UPDATE,
        });
        if (vehiculo) {
          await vehiculo.update(
            { quantity: vehiculo.quantity + vehiculo_carrera.quantity },
            { transaction: t }
          );
        }
      }

      await vehiculo_carrera.update({ status: "inactive" }, { transaction: t });
      await recalcCarreraTotals(vehiculo_carrera.carrera_id, t);

      await t.commit();
      res.status(200).json({
        message: "Vehiculo carrera deactivated (logical delete)",
        vehiculo_carrera,
      });
    } catch (error) {
      await t.rollback();
      res.status(500).json({ error: "Error deactivating vehiculo carrera", detail: String(error) });
    }
  }
}
EOF
```

## 13.3b Routes CarreraVehiculo (`/api/detalle-carreras`)

```bash
: > src/features/business/carrera-vehiculo/carrera-vehiculo.routes.ts
cat >> src/features/business/carrera-vehiculo/carrera-vehiculo.routes.ts << 'EOF'
import { Application } from "express";
import { CarreraVehiculoController } from "./carrera-vehiculo.controller";

export class CarreraVehiculoRoutes {
  public vehiculoCarreraController: CarreraVehiculoController = new CarreraVehiculoController();

  public routes(app: Application): void {
    // ================== RUTAS SIN AUTENTICACIÓN / SIN MIDDLEWARE JWT ==================

    // getAll
    app
      .route("/api/detalle-carreras")
      .get(this.vehiculoCarreraController.getAll.bind(this.vehiculoCarreraController));

    // getOne
    app
      .route("/api/detalle-carreras/:id")
      .get(this.vehiculoCarreraController.getOne.bind(this.vehiculoCarreraController));

    // create
    app
      .route("/api/detalle-carreras")
      .post(this.vehiculoCarreraController.create.bind(this.vehiculoCarreraController));

    // update (PUT / PATCH)
    app
      .route("/api/detalle-carreras/:id")
      .put(this.vehiculoCarreraController.updatePut.bind(this.vehiculoCarreraController))
      .patch(this.vehiculoCarreraController.updatePatch.bind(this.vehiculoCarreraController));

    // delete físico
    app
      .route("/api/detalle-carreras/:id")
      .delete(this.vehiculoCarreraController.deletePhysical.bind(this.vehiculoCarreraController));

    // delete lógico
    app
      .route("/api/detalle-carreras/:id/deactivate")
      .patch(this.vehiculoCarreraController.deleteLogical.bind(this.vehiculoCarreraController));
  }
}
EOF
```

## 13.4b Seeder CarreraVehiculo

```bash
: > src/features/business/carrera-vehiculo/carrera-vehiculo.seeder.ts
cat >> src/features/business/carrera-vehiculo/carrera-vehiculo.seeder.ts << 'EOF'
import { faker } from "@faker-js/faker";
import { sequelize } from "../../../database/db";
import { CarreraVehiculo } from "./carrera-vehiculo.model";
import { Carrera } from "../carrera/carrera.model";
import { Vehiculo } from "../vehiculo/vehiculo.model";

/**
 * Seeder del feature CarreraVehiculo (tabla `carrera_vehiculos`).
 * Se invoca desde `src/database/seeders` (SeedersRunner), no desde la App.
 *
 * Requiere carreras y vehiculos activos. Idempotente: si ya hay filas, omite.
 * Recalcula subtotal/total de cada venta afectada y reduce stock.
 */
export async function seedCarreraVehiculos(count: number): Promise<number> {
  if (count <= 0) {
    console.log("⏭️  carrera_vehiculos: count=0, se omite");
    return 0;
  }

  const existing = await CarreraVehiculo.count();
  if (existing > 0) {
    console.log(`⏭️  carrera_vehiculos: ya hay ${existing} registro(s), se omite seeder`);
    return 0;
  }

  const carreras = await Carrera.findAll({ where: { status: "active" } });
  const vehiculos = await Vehiculo.findAll({ where: { status: "active" } });

  if (carreras.length === 0 || vehiculos.length === 0) {
    console.log("⏭️  carrera_vehiculos: faltan carreras o vehiculos activos, se omite seeder");
    return 0;
  }

  let created = 0;
  let carreraIndex = 0;

  while (created < count && carreraIndex < carreras.length * 3) {
    const carrera = carreras[carreraIndex % carreras.length];
    carreraIndex += 1;

    const t = await sequelize.transaction();
    try {
      const vehiculo = vehiculos[Math.floor(Math.random() * vehiculos.length)];
      const fresh = await Vehiculo.findByPk(vehiculo.id, {
        transaction: t,
        lock: t.LOCK.UPDATE,
      });
      if (!fresh || fresh.quantity < 1) {
        await t.rollback();
        continue;
      }

      const quantity = Math.min(
        fresh.quantity,
        faker.number.int({ min: 1, max: Math.min(3, fresh.quantity) })
      );
      const unit_price = Number(fresh.price);
      const line_total = unit_price * quantity;

      await CarreraVehiculo.create(
        {
          carrera_id: carrera.id,
          vehiculo_id: fresh.id,
          quantity,
          unit_price,
          line_total,
          status: "active",
        },
        { transaction: t }
      );

      await fresh.update(
        { quantity: fresh.quantity - quantity },
        { transaction: t }
      );

      const items = await CarreraVehiculo.findAll({
        where: { carrera_id: carrera.id, status: "active" },
        transaction: t,
      });
      const subtotal = items.reduce((sum, row) => sum + Number(row.line_total), 0);
      const carreraRow = await Carrera.findByPk(carrera.id, { transaction: t });
      if (carreraRow) {
        const total = subtotal + Number(carreraRow.tax) - Number(carreraRow.discounts);
        await carreraRow.update({ subtotal, total }, { transaction: t });
      }

      await t.commit();
      created += 1;
    } catch {
      await t.rollback();
    }
  }

  console.log(`✅ carrera_vehiculos: insertados ${created} registro(s) falsos`);
  return created;
}
EOF
```

## 13.6b Swagger CarreraVehiculo

```bash
: > src/features/business/carrera-vehiculo/carrera-vehiculo.swagger.ts
cat >> src/features/business/carrera-vehiculo/carrera-vehiculo.swagger.ts << 'EOF'
/**
 * Documentación OpenAPI del feature CarreraVehiculo (tabla carrera_vehiculos).
 * Se agrega desde `src/swagger` (registry externo), no se monta aquí.
 *
 * Leyenda: endpoints documentados como SIN AUTH (sin middleware JWT).
 */

export const vehiculoCarreraSwagger = {
  tags: [
    {
      name: "DetalleVentas",
      description:
        "CRUD de líneas Carrera↔Vehiculo (tabla carrera_vehiculos) — **SIN AUTH** (sin middleware JWT)",
    },
  ],
  paths: {
    "/api/detalle-carreras": {
      get: {
        tags: ["DetalleVentas"],
        summary: "Listar detalles de venta activos",
        description: "SIN AUTH — retorna carrera_vehiculos con status=active",
        security: [],
        responses: {
          "200": {
            description: "Lista de detalles",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    carrera_vehiculos: {
                      type: "array",
                      items: { $ref: "#/components/schemas/CarreraVehiculo" },
                    },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["DetalleVentas"],
        summary: "Agregar línea a una venta",
        description:
          "SIN AUTH — valida venta/vehiculo activos y stock; crea vehiculo_carrera, reduce quantity y recalcula totales de la venta",
        security: [],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CarreraVehiculoCreate" },
            },
          },
        },
        responses: {
          "201": {
            description: "Línea creada",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    vehiculo_carrera: { $ref: "#/components/schemas/CarreraVehiculo" },
                  },
                },
              },
            },
          },
          "400": { description: "Validación (venta/vehiculo/stock)" },
          "404": { description: "Venta o vehiculo no encontrado" },
        },
      },
    },
    "/api/detalle-carreras/{id}": {
      get: {
        tags: ["DetalleVentas"],
        summary: "Obtener detalle por id",
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
            description: "Detalle encontrado",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    vehiculo_carrera: { $ref: "#/components/schemas/CarreraVehiculo" },
                  },
                },
              },
            },
          },
          "404": { description: "No encontrado" },
        },
      },
      put: {
        tags: ["DetalleVentas"],
        summary: "Actualizar cantidad de línea (PUT)",
        description: "SIN AUTH — ajusta stock y recalcula totales",
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
              schema: { $ref: "#/components/schemas/CarreraVehiculoUpdate" },
            },
          },
        },
        responses: {
          "200": { description: "Actualizado" },
          "400": { description: "Stock insuficiente" },
          "404": { description: "No encontrado" },
        },
      },
      patch: {
        tags: ["DetalleVentas"],
        summary: "Actualizar línea (PATCH — parcial)",
        description: "SIN AUTH — quantity y/ o status",
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
              schema: { $ref: "#/components/schemas/CarreraVehiculoPatch" },
            },
          },
        },
        responses: {
          "200": { description: "Actualizado" },
          "404": { description: "No encontrado" },
        },
      },
      delete: {
        tags: ["DetalleVentas"],
        summary: "Eliminar línea (físico)",
        description: "SIN AUTH — restaura stock y recalcula totales",
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
    "/api/detalle-carreras/{id}/deactivate": {
      patch: {
        tags: ["DetalleVentas"],
        summary: "Eliminar línea (lógico)",
        description: "SIN AUTH — status = inactive; restaura stock y recalcula totales",
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
      CarreraVehiculo: {
        type: "object",
        description:
          "Detalle N:M Carrera↔Vehiculo (tabla carrera_vehiculos). quantity, unit_price (snapshot), line_total = quantity × unit_price",
        properties: {
          id: { type: "integer", example: 1 },
          carrera_id: { type: "integer", example: 1 },
          vehiculo_id: { type: "integer", example: 1 },
          quantity: { type: "integer", example: 2 },
          unit_price: { type: "number", example: 100.0 },
          line_total: { type: "number", example: 200.0 },
          status: { type: "string", enum: ["active", "inactive"], example: "active" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      CarreraVehiculoCreate: {
        type: "object",
        required: ["carrera_id", "vehiculo_id", "quantity"],
        properties: {
          carrera_id: { type: "integer" },
          vehiculo_id: { type: "integer" },
          quantity: { type: "integer", minimum: 1 },
          status: { type: "string", enum: ["active", "inactive"], default: "active" },
        },
      },
      CarreraVehiculoUpdate: {
        type: "object",
        required: ["quantity"],
        properties: {
          quantity: { type: "integer", minimum: 1 },
          status: { type: "string", enum: ["active", "inactive"] },
        },
      },
      CarreraVehiculoPatch: {
        type: "object",
        properties: {
          quantity: { type: "integer", minimum: 1 },
          status: { type: "string", enum: ["active", "inactive"] },
        },
      },
    },
  },
};
EOF
```

### HTTP CarreraVehiculo get

```bash
: > src/features/business/carrera-vehiculo/http/carrera-vehiculos.get.http
cat >> src/features/business/carrera-vehiculo/http/carrera-vehiculos.get.http << 'EOF'
### Feature CarreraVehiculo — GET
### Leyenda: SIN AUTH (sin middleware JWT / sin autenticación)
@baseUrl = http://localhost:4000

# @name getCarreraVehiculos
GET {{baseUrl}}/api/detalle-carreras

###

# @name getCarreraVehiculo
GET {{baseUrl}}/api/detalle-carreras/1
EOF
```

### HTTP CarreraVehiculo create

```bash
: > src/features/business/carrera-vehiculo/http/carrera-vehiculos.create.http
cat >> src/features/business/carrera-vehiculo/http/carrera-vehiculos.create.http << 'EOF'
### Feature CarreraVehiculo — CREATE
### Leyenda: SIN AUTH (sin middleware JWT / sin autenticación)
@baseUrl = http://localhost:4000

# @name createCarreraVehiculo
POST {{baseUrl}}/api/detalle-carreras
Content-Type: application/json

{
  "carrera_id": 1,
  "vehiculo_id": 1,
  "quantity": 2,
  "status": "active"
}
EOF
```

### HTTP CarreraVehiculo update

```bash
: > src/features/business/carrera-vehiculo/http/carrera-vehiculos.update.http
cat >> src/features/business/carrera-vehiculo/http/carrera-vehiculos.update.http << 'EOF'
### Feature CarreraVehiculo — UPDATE
### Leyenda: SIN AUTH (sin middleware JWT / sin autenticación)
@baseUrl = http://localhost:4000

# @name updateCarreraVehiculoPut
PUT {{baseUrl}}/api/detalle-carreras/1
Content-Type: application/json

{
  "quantity": 3,
  "status": "active"
}

###

# @name updateCarreraVehiculoPatch
PATCH {{baseUrl}}/api/detalle-carreras/1
Content-Type: application/json

{
  "quantity": 1
}
EOF
```

### HTTP CarreraVehiculo delete

```bash
: > src/features/business/carrera-vehiculo/http/carrera-vehiculos.delete.http
cat >> src/features/business/carrera-vehiculo/http/carrera-vehiculos.delete.http << 'EOF'
### Feature CarreraVehiculo — DELETE
### Leyenda: SIN AUTH (sin middleware JWT / sin autenticación)
@baseUrl = http://localhost:4000

# @name deleteCarreraVehiculoPhysical
DELETE {{baseUrl}}/api/detalle-carreras/1

###

# @name deleteCarreraVehiculoLogical
PATCH {{baseUrl}}/api/detalle-carreras/1/deactivate
EOF
```
---

## 13.2 Controller + routes

```bash
: > src/features/business/carrera/carrera.controller.ts
cat >> src/features/business/carrera/carrera.controller.ts << 'EOF'
import { Request, Response } from "express";
import { sequelize } from "../../../database/db";
import { Carrera, CarreraI } from "./carrera.model";
import { CarreraVehiculo } from "../carrera-vehiculo/carrera-vehiculo.model";
import { Pasajero } from "../pasajero/pasajero.model";
import { Vehiculo } from "../vehiculo/vehiculo.model";

function paramId(req: Request): number {
  const raw = req.params.id;
  const value = Array.isArray(raw) ? raw[0] : raw;
  return Number(value);
}

type CarreraItemInput = { vehiculo_id: number; quantity: number };

type CarreraCreateBody = {
  pasajero_id: number;
  tax?: number;
  discounts?: number;
  carrera_date?: Date | string;
  status?: "active" | "inactive";
  items: CarreraItemInput[];
};

export class CarreraController {
  // ================== READ ==================
  public async getAll(req: Request, res: Response) {
    try {
      const carreras = await Carrera.findAll({
        where: { status: "active" },
        include: [{ model: CarreraVehiculo, as: "items" }],
      });
      res.status(200).json({ carreras });
    } catch (error) {
      res.status(500).json({ error: "Error fetching carreras", detail: String(error) });
    }
  }

  public async getOne(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const carrera = await Carrera.findByPk(id, {
        include: [{ model: CarreraVehiculo, as: "items" }],
      });
      if (!carrera) {
        res.status(404).json({ error: "Carrera not found" });
        return;
      }
      res.status(200).json({ carrera });
    } catch (error) {
      res.status(500).json({ error: "Error fetching carrera", detail: String(error) });
    }
  }

  // ================== CREATE ==================
  public async create(req: Request, res: Response) {
    const t = await sequelize.transaction();
    try {
      const body = req.body as CarreraCreateBody;

      if (!body.items || !Array.isArray(body.items) || body.items.length === 0) {
        await t.rollback();
        res.status(400).json({ error: "Carrera requires at least one item" });
        return;
      }

      const pasajero = await Pasajero.findByPk(body.pasajero_id, { transaction: t });
      if (!pasajero) {
        await t.rollback();
        res.status(404).json({ error: "Pasajero not found" });
        return;
      }
      if (pasajero.status !== "active") {
        await t.rollback();
        res.status(400).json({ error: "Pasajero must be active" });
        return;
      }

      const lineRows: Array<{
        vehiculo_id: number;
        quantity: number;
        unit_price: number;
        line_total: number;
        vehiculo: Vehiculo;
      }> = [];

      let subtotal = 0;

      for (const item of body.items) {
        const vehiculo = await Vehiculo.findByPk(item.vehiculo_id, {
          transaction: t,
          lock: t.LOCK.UPDATE,
        });
        if (!vehiculo) {
          await t.rollback();
          res.status(404).json({ error: `Vehiculo not found: ${item.vehiculo_id}` });
          return;
        }
        if (vehiculo.status !== "active") {
          await t.rollback();
          res.status(400).json({ error: `Vehiculo must be active: ${item.vehiculo_id}` });
          return;
        }
        if (vehiculo.quantity < item.quantity) {
          await t.rollback();
          res.status(400).json({
            error: `Insufficient stock for vehiculo ${item.vehiculo_id}`,
            available: vehiculo.quantity,
            requested: item.quantity,
          });
          return;
        }

        const unit_price = Number(vehiculo.price);
        const line_total = unit_price * item.quantity;
        subtotal += line_total;
        lineRows.push({
          vehiculo_id: vehiculo.id,
          quantity: item.quantity,
          unit_price,
          line_total,
          vehiculo,
        });
      }

      const tax = Number(body.tax ?? 0);
      const discounts = Number(body.discounts ?? 0);
      const total = subtotal + tax - discounts;

      const carrera = await Carrera.create(
        {
          carrera_date: body.carrera_date ?? new Date(),
          subtotal,
          tax,
          discounts,
          total,
          pasajero_id: body.pasajero_id,
          status: body.status ?? "active",
        },
        { transaction: t }
      );

      const items = [];
      for (const line of lineRows) {
        const vehiculoCarrera = await CarreraVehiculo.create(
          {
            carrera_id: carrera.id,
            vehiculo_id: line.vehiculo_id,
            quantity: line.quantity,
            unit_price: line.unit_price,
            line_total: line.line_total,
            status: "active",
          },
          { transaction: t }
        );
        await line.vehiculo.update(
          { quantity: line.vehiculo.quantity - line.quantity },
          { transaction: t }
        );
        items.push(vehiculoCarrera);
      }

      await t.commit();
      res.status(201).json({ carrera, items });
    } catch (error) {
      await t.rollback();
      res.status(500).json({ error: "Error creating carrera", detail: String(error) });
    }
  }

  // ================== UPDATE ==================
  public async updatePut(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const body = req.body as Partial<CarreraI>;
      const carrera = await Carrera.findByPk(id);
      if (!carrera) {
        res.status(404).json({ error: "Carrera not found" });
        return;
      }

      const tax = Number(body.tax ?? 0);
      const discounts = Number(body.discounts ?? 0);
      const subtotal = Number(carrera.subtotal);
      const total = subtotal + tax - discounts;

      await carrera.update({
        carrera_date: body.carrera_date ?? carrera.carrera_date,
        tax,
        discounts,
        total,
        pasajero_id: body.pasajero_id ?? carrera.pasajero_id,
        status: body.status ?? carrera.status,
      });

      const withItems = await Carrera.findByPk(carrera.id, {
        include: [{ model: CarreraVehiculo, as: "items" }],
      });
      res.status(200).json({ carrera: withItems });
    } catch (error) {
      res.status(500).json({ error: "Error updating carrera (PUT)", detail: String(error) });
    }
  }

  public async updatePatch(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const body = req.body as Partial<CarreraI>;
      const carrera = await Carrera.findByPk(id);
      if (!carrera) {
        res.status(404).json({ error: "Carrera not found" });
        return;
      }

      const tax = body.tax !== undefined ? Number(body.tax) : Number(carrera.tax);
      const discounts =
        body.discounts !== undefined ? Number(body.discounts) : Number(carrera.discounts);
      const needsRecalc = body.tax !== undefined || body.discounts !== undefined;
      const total = needsRecalc
        ? Number(carrera.subtotal) + tax - discounts
        : Number(carrera.total);

      const patch: Partial<CarreraI> & { total?: number } = { ...body };
      if (needsRecalc) {
        patch.tax = tax;
        patch.discounts = discounts;
        patch.total = total;
      }

      await carrera.update(patch);

      const withItems = await Carrera.findByPk(carrera.id, {
        include: [{ model: CarreraVehiculo, as: "items" }],
      });
      res.status(200).json({ carrera: withItems });
    } catch (error) {
      res.status(500).json({ error: "Error updating carrera (PATCH)", detail: String(error) });
    }
  }

  // ================== DELETE ==================
  /** Eliminación física: carrera_vehiculos luego carrera (transacción) */
  public async deletePhysical(req: Request, res: Response) {
    const t = await sequelize.transaction();
    try {
      const id = paramId(req);
      const carrera = await Carrera.findByPk(id, { transaction: t });
      if (!carrera) {
        await t.rollback();
        res.status(404).json({ error: "Carrera not found" });
        return;
      }

      await CarreraVehiculo.destroy({ where: { carrera_id: id }, transaction: t });
      await carrera.destroy({ transaction: t });
      await t.commit();
      res.status(200).json({ message: "Carrera permanently deleted", id });
    } catch (error) {
      await t.rollback();
      res.status(500).json({ error: "Error deleting carrera", detail: String(error) });
    }
  }

  /** Eliminación lógica → status = inactive (carrera + items) */
  public async deleteLogical(req: Request, res: Response) {
    const t = await sequelize.transaction();
    try {
      const id = paramId(req);
      const carrera = await Carrera.findByPk(id, { transaction: t });
      if (!carrera) {
        await t.rollback();
        res.status(404).json({ error: "Carrera not found" });
        return;
      }

      await carrera.update({ status: "inactive" }, { transaction: t });
      await CarreraVehiculo.update(
        { status: "inactive" },
        { where: { carrera_id: id }, transaction: t }
      );
      await t.commit();

      const withItems = await Carrera.findByPk(id, {
        include: [{ model: CarreraVehiculo, as: "items" }],
      });
      res.status(200).json({
        message: "Carrera deactivated (logical delete)",
        carrera: withItems,
      });
    } catch (error) {
      await t.rollback();
      res.status(500).json({ error: "Error deactivating carrera", detail: String(error) });
    }
  }
}
EOF
```
```bash
: > src/features/business/carrera/carrera.routes.ts
cat >> src/features/business/carrera/carrera.routes.ts << 'EOF'
import { Application } from "express";
import { CarreraController } from "./carrera.controller";

export class CarreraRoutes {
  public carreraController: CarreraController = new CarreraController();

  public routes(app: Application): void {
    // ================== RUTAS SIN AUTENTICACIÓN / SIN MIDDLEWARE JWT ==================

    // getAll
    app
      .route("/api/carreras")
      .get(this.carreraController.getAll.bind(this.carreraController));

    // getOne
    app
      .route("/api/carreras/:id")
      .get(this.carreraController.getOne.bind(this.carreraController));

    // create
    app
      .route("/api/carreras")
      .post(this.carreraController.create.bind(this.carreraController));

    // update (PUT / PATCH)
    app
      .route("/api/carreras/:id")
      .put(this.carreraController.updatePut.bind(this.carreraController))
      .patch(this.carreraController.updatePatch.bind(this.carreraController));

    // delete físico
    app
      .route("/api/carreras/:id")
      .delete(this.carreraController.deletePhysical.bind(this.carreraController));

    // delete lógico
    app
      .route("/api/carreras/:id/deactivate")
      .patch(this.carreraController.deleteLogical.bind(this.carreraController));
  }
}
EOF
```
---

## 13.3 HTTP

```bash
: > src/features/business/carrera/http/carreras.get.http
cat >> src/features/business/carrera/http/carreras.get.http << 'EOF'
### Feature Carrera — GET ALL / GET ONE
### Leyenda: SIN AUTH (sin middleware JWT / sin autenticación)
@baseUrl = http://localhost:4000
@id = 1

# @name getAllCarreras
GET {{baseUrl}}/api/carreras

###

# @name getOneCarrera
GET {{baseUrl}}/api/carreras/{{id}}
EOF
```

```bash
: > src/features/business/carrera/http/carreras.create.http
cat >> src/features/business/carrera/http/carreras.create.http << 'EOF'
### Feature Carrera — CREATE
### Leyenda: SIN AUTH (sin middleware JWT / sin autenticación)
@baseUrl = http://localhost:4000

# @name createCarrera
POST {{baseUrl}}/api/carreras
Content-Type: application/json

{
  "pasajero_id": 1,
  "tax": 19,
  "discounts": 5,
  "items": [
    { "vehiculo_id": 1, "quantity": 2 },
    { "vehiculo_id": 2, "quantity": 1 }
  ]
}
EOF
```
```bash
: > src/features/business/carrera/http/carreras.update.http
cat >> src/features/business/carrera/http/carreras.update.http << 'EOF'
### Feature Carrera — UPDATE (PUT) / UPDATE (PATCH) — solo cabecera
### Leyenda: SIN AUTH (sin middleware JWT / sin autenticación)
@baseUrl = http://localhost:4000
@id = 1

# @name updateCarreraPut
PUT {{baseUrl}}/api/carreras/{{id}}
Content-Type: application/json

{
  "pasajero_id": 1,
  "tax": 20,
  "discounts": 10,
  "carrera_date": "2026-09-16T12:00:00.000Z",
  "status": "active"
}

###

# @name updateCarreraPatch
PATCH {{baseUrl}}/api/carreras/{{id}}
Content-Type: application/json

{
  "tax": 15,
  "discounts": 0
}
EOF
```
```bash
: > src/features/business/carrera/http/carreras.delete.http
cat >> src/features/business/carrera/http/carreras.delete.http << 'EOF'
### Feature Carrera — DELETE físico / DELETE lógico (status = inactive)
### Leyenda: SIN AUTH (sin middleware JWT / sin autenticación)
@baseUrl = http://localhost:4000
@id = 1

# @name deleteCarreraPhysical
DELETE {{baseUrl}}/api/carreras/{{id}}

###

# @name deleteCarreraLogical
PATCH {{baseUrl}}/api/carreras/{{id}}/deactivate
EOF
```
---

## 13.4 Cableado

**PARCHE** — `src/routes/index.ts`: import + `carreraRoutes`.

**PARCHE** — `src/config/index.ts`:

- **Debajo de** import vehiculo.model, **añadir**:

```ts
import "../features/business/carrera/carrera.model";
import "../features/business/carrera-vehiculo/carrera-vehiculo.model";
```

- **Dentro de** `routes()`, **añadir** `this.routePrv.carreraRoutes.routes(this.app);`

---

## 13.5 Relaciones Carrera / CarreraVehiculo / Pasajero / Vehiculo (**obligatorio**)

> Norma FK: `pasajero_id`, `carrera_id`, `vehiculo_id` (singular de la tabla referenciada + `_id`).

```bash
: > src/features/business/carrera/carrera.associations.ts
cat >> src/features/business/carrera/carrera.associations.ts << 'EOF'
import { Carrera } from "./carrera.model";
import { Pasajero } from "../pasajero/pasajero.model";

Carrera.belongsTo(Pasajero, { foreignKey: "pasajero_id", as: "pasajero" });
Pasajero.hasMany(Carrera, { foreignKey: "pasajero_id", as: "carreras" });
EOF
```
**PARCHE** — `src/config/index.ts` **ya existe**.

**Debajo de** `import "../features/business/vehiculo/vehiculo.associations";`, **añadir**:

```ts
import "../features/business/carrera/carrera.associations";
```

Relaciones registradas:

- `Carrera.belongsTo(Pasajero)` / `Pasajero.hasMany(Carrera)` — en `carrera.associations.ts`
- `CarreraVehiculo.belongsTo(Carrera|Vehiculo)` / `Carrera.hasMany(items)` / `Vehiculo.hasMany(carrera_items)` — en `carrera-vehiculo.associations.ts`

**PARCHE** — también importar side-effect:

```ts
import "../features/business/carrera-vehiculo/carrera-vehiculo.associations";
```

### Verificación venta

```bash
curl -s -X POST http://localhost:4000/api/carreras -H 'Content-Type: application/json' \
  -d '{"pasajero_id":1,"tax":0,"discounts":0,"items":[{"vehiculo_id":1,"quantity":2}],"status":"active"}'
curl -s http://localhost:4000/api/carreras
curl -s http://localhost:4000/api/detalle-carreras
```

---

## 13.6 Seeder + Swagger Carrera

```bash
: > src/features/business/carrera/carrera.seeder.ts
cat >> src/features/business/carrera/carrera.seeder.ts << 'EOF'
import { faker } from "@faker-js/faker";
import { Carrera } from "./carrera.model";
import { Pasajero } from "../pasajero/pasajero.model";

/**
 * Seeder del feature Carrera (cabeceras).
 * Las líneas `carrera_vehiculos` las inserta `carrera-vehiculo.seeder.ts`.
 * Idempotente: si ya hay carreras, no inserta.
 */
export async function seedCarreras(count: number): Promise<number> {
  if (count <= 0) {
    console.log("⏭️  carreras: count=0, se omite");
    return 0;
  }

  const existing = await Carrera.count();
  if (existing > 0) {
    console.log(`⏭️  carreras: ya hay ${existing} registro(s), se omite seeder`);
    return 0;
  }

  const pasajeros = await Pasajero.findAll({ where: { status: "active" } });
  if (pasajeros.length === 0) {
    console.log("⏭️  carreras: faltan pasajeros activos, se omite seeder");
    return 0;
  }

  const rows = Array.from({ length: count }, () => {
    const pasajero = pasajeros[Math.floor(Math.random() * pasajeros.length)];
    const tax = Number(faker.number.float({ min: 0, max: 20, fractionDigits: 2 }));
    const discounts = Number(faker.number.float({ min: 0, max: 10, fractionDigits: 2 }));
    return {
      carrera_date: faker.date.recent({ days: 30 }),
      subtotal: 0,
      tax,
      discounts,
      total: tax - discounts,
      pasajero_id: pasajero.id,
      status: "active" as const,
    };
  });

  await Carrera.bulkCreate(rows);
  console.log(`✅ carreras: insertados ${count} registro(s) falsos (sin ítems)`);
  return count;
}
EOF
```
```bash
: > src/features/business/carrera/carrera.swagger.ts
cat >> src/features/business/carrera/carrera.swagger.ts << 'EOF'
/**
 * Documentación OpenAPI del feature Carrera.
 * Se agrega desde `src/swagger` (registry externo), no se monta aquí.
 *
 * Leyenda: endpoints documentados como SIN AUTH (sin middleware JWT).
 */

export const carreraSwagger = {
  tags: [
    {
      name: "Ventas",
      description: "CRUD de carreras — **SIN AUTH** (sin middleware JWT)",
    },
  ],
  paths: {
    "/api/carreras": {
      get: {
        tags: ["Ventas"],
        summary: "Listar carreras activas",
        description: "SIN AUTH — retorna carreras con status=active e items (CarreraVehiculo)",
        security: [],
        responses: {
          "200": {
            description: "Lista de carreras",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    carreras: {
                      type: "array",
                      items: { $ref: "#/components/schemas/CarreraWithItems" },
                    },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Ventas"],
        summary: "Crear venta (transaccional)",
        description:
          "SIN AUTH — valida pasajero/vehiculos activos y stock; crea Carrera + CarreraVehiculo y reduce quantity",
        security: [],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CarreraCreate" },
            },
          },
        },
        responses: {
          "201": {
            description: "Venta creada",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    carrera: { $ref: "#/components/schemas/Carrera" },
                    items: {
                      type: "array",
                      items: { $ref: "#/components/schemas/CarreraVehiculo" },
                    },
                  },
                },
              },
            },
          },
          "400": { description: "Validación (pasajero/vehiculo/stock)" },
          "404": { description: "Pasajero o vehiculo no encontrado" },
        },
      },
    },
    "/api/carreras/{id}": {
      get: {
        tags: ["Ventas"],
        summary: "Obtener venta por id",
        description: "SIN AUTH — incluye items",
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
            description: "Venta encontrada",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    carrera: { $ref: "#/components/schemas/CarreraWithItems" },
                  },
                },
              },
            },
          },
          "404": { description: "No encontrado" },
        },
      },
      put: {
        tags: ["Ventas"],
        summary: "Actualizar cabecera de venta (PUT)",
        description:
          "SIN AUTH — solo tax, discounts, pasajero_id, carrera_date, status; recalcula total; no reescribe items",
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
              schema: { $ref: "#/components/schemas/CarreraUpdate" },
            },
          },
        },
        responses: {
          "200": { description: "Actualizado" },
          "404": { description: "No encontrado" },
        },
      },
      patch: {
        tags: ["Ventas"],
        summary: "Actualizar cabecera de venta (PATCH)",
        description: "SIN AUTH — parcial; recalcula total si cambian tax/discounts",
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
              schema: { $ref: "#/components/schemas/CarreraPatch" },
            },
          },
        },
        responses: {
          "200": { description: "Actualizado" },
          "404": { description: "No encontrado" },
        },
      },
      delete: {
        tags: ["Ventas"],
        summary: "Eliminar venta (físico)",
        description: "SIN AUTH — borra carrera_vehiculos y luego la venta (transacción)",
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
    "/api/carreras/{id}/deactivate": {
      patch: {
        tags: ["Ventas"],
        summary: "Eliminar venta (lógico)",
        description: "SIN AUTH — status = inactive en venta e items",
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
      // CarreraVehiculo schema vive en carrera-vehiculo.swagger.ts (feature propio)
      Carrera: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          carrera_date: { type: "string", format: "date-time" },
          subtotal: { type: "number", example: 200.0 },
          tax: { type: "number", example: 19.0 },
          discounts: { type: "number", example: 5.0 },
          total: { type: "number", example: 214.0 },
          pasajero_id: { type: "integer", example: 1 },
          status: { type: "string", enum: ["active", "inactive"], example: "active" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      CarreraWithItems: {
        allOf: [
          { $ref: "#/components/schemas/Carrera" },
          {
            type: "object",
            properties: {
              items: {
                type: "array",
                items: { $ref: "#/components/schemas/CarreraVehiculo" },
              },
            },
          },
        ],
      },
      CarreraCreate: {
        type: "object",
        required: ["pasajero_id", "items"],
        properties: {
          pasajero_id: { type: "integer" },
          tax: { type: "number", default: 0 },
          discounts: { type: "number", default: 0 },
          carrera_date: { type: "string", format: "date-time" },
          status: { type: "string", enum: ["active", "inactive"], default: "active" },
          items: {
            type: "array",
            minItems: 1,
            items: {
              type: "object",
              required: ["vehiculo_id", "quantity"],
              properties: {
                vehiculo_id: { type: "integer" },
                quantity: { type: "integer", minimum: 1 },
              },
            },
          },
        },
      },
      CarreraUpdate: {
        type: "object",
        properties: {
          carrera_date: { type: "string", format: "date-time" },
          tax: { type: "number" },
          discounts: { type: "number" },
          pasajero_id: { type: "integer" },
          status: { type: "string", enum: ["active", "inactive"] },
        },
      },
      CarreraPatch: {
        type: "object",
        properties: {
          carrera_date: { type: "string", format: "date-time" },
          tax: { type: "number" },
          discounts: { type: "number" },
          pasajero_id: { type: "integer" },
          status: { type: "string", enum: ["active", "inactive"] },
        },
      },
    },
  },
};
EOF
```
---

## 13.7 Estado final de agregadores (reemplazar / alinear)

Tras ISS-06…08, estos archivos quedan así (podés **reemplazar** el contenido completo con `cat >>` si preferís evitar parches acumulados):

### `src/routes/index.ts`

```bash
: > src/routes/index.ts
cat >> src/routes/index.ts << 'EOF'
import { PasajeroRoutes } from "../features/business/pasajero/pasajero.routes";
import { TipoVehiculoRoutes } from "../features/business/tipo-vehiculo/tipo-vehiculo.routes";
import { VehiculoRoutes } from "../features/business/vehiculo/vehiculo.routes";
import { CarreraRoutes } from "../features/business/carrera/carrera.routes";
import { CarreraVehiculoRoutes } from "../features/business/carrera-vehiculo/carrera-vehiculo.routes";

export class Routes {
  public pasajeroRoutes: PasajeroRoutes = new PasajeroRoutes();
  public vehiculoTypeRoutes: TipoVehiculoRoutes = new TipoVehiculoRoutes();
  public vehiculoRoutes: VehiculoRoutes = new VehiculoRoutes();
  public carreraRoutes: CarreraRoutes = new CarreraRoutes();
  public vehiculoCarreraRoutes: CarreraVehiculoRoutes = new CarreraVehiculoRoutes();
}
EOF
```
### `src/database/seeders/counts.ts`

```bash
: > src/database/seeders/counts.ts
cat >> src/database/seeders/counts.ts << 'EOF'
/**
 * Cantidad de registros por tabla (snake_case = nombre de tabla BD).
 * Prioridad: CLI (--pasajeros=N) > env (SEED_PASAJEROS) > default de este archivo.
 *
 * Cuando agregues features, suma aquí la clave (nombre de tabla) y léela en el runner.
 */
export type SeedCounts = {
  pasajeros: number;
  tipos_vehiculo: number;
  vehiculos: number;
  carreras: number;
  carrera_vehiculos: number;
  // users?: number;
  // roles?: number;
};

export const DEFAULT_SEED_COUNTS: SeedCounts = {
  pasajeros: 10,
  tipos_vehiculo: 25,
  vehiculos: 15,
  carreras: 5,
  carrera_vehiculos: 12,
};

export function resolveSeedCounts(argv: string[] = process.argv.slice(2)): SeedCounts {
  const counts: SeedCounts = { ...DEFAULT_SEED_COUNTS };

  const envMap: Array<[keyof SeedCounts, string | undefined]> = [
    ["pasajeros", process.env.SEED_PASAJEROS],
    ["tipos_vehiculo", process.env.SEED_TIPOS_VEHICULO],
    ["vehiculos", process.env.SEED_VEHICULOS],
    ["carreras", process.env.SEED_CARRERAS],
    ["carrera_vehiculos", process.env.SEED_CARRERA_VEHICULOS],
  ];
  for (const [key, value] of envMap) {
    if (value !== undefined && value !== "") {
      counts[key] = Number(value);
    }
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
### `src/database/seeders/index.ts`

```bash
: > src/database/seeders/index.ts
cat >> src/database/seeders/index.ts << 'EOF'
import dotenv from "dotenv";
import { sequelize, testConnection } from "../db";
import "../../features/business/pasajero/pasajero.model";
import "../../features/business/tipo-vehiculo/tipo-vehiculo.model";
import "../../features/business/vehiculo/vehiculo.model";
import "../../features/business/carrera/carrera.model";
import "../../features/business/carrera-vehiculo/carrera-vehiculo.model";
import "../../features/business/vehiculo/vehiculo.associations";
import "../../features/business/carrera/carrera.associations";
import "../../features/business/carrera-vehiculo/carrera-vehiculo.associations";
import { seedPasajeros } from "../../features/business/pasajero/pasajero.seeder";
import { seedTipoVehiculos } from "../../features/business/tipo-vehiculo/tipo-vehiculo.seeder";
import { seedVehiculos } from "../../features/business/vehiculo/vehiculo.seeder";
import { seedCarreras } from "../../features/business/carrera/carrera.seeder";
import { seedCarreraVehiculos } from "../../features/business/carrera-vehiculo/carrera-vehiculo.seeder";
import { resolveSeedCounts } from "./counts";

dotenv.config();

/**
 * SeedersRunner — ejecuta los seeders de TODAS las tablas (features).
 *
 * Tablas actuales (orden padres → hijos):
 *   pasajeros → tipos_vehiculo → vehiculos → carreras → carrera_vehiculos
 *
 * Ejecutar seeders de todas las tablas:
 *   npm run db:seed
 *
 * Variar cantidades (CLI o env; claves = nombre de tabla):
 *   npm run db:seed -- --pasajeros=20 --tipos_vehiculo=5 --vehiculos=15 --carreras=5 --carrera_vehiculos=12
 *   SEED_PASAJEROS=5 SEED_TIPOS_VEHICULO=3 SEED_VEHICULOS=10 SEED_CARRERAS=2 SEED_CARRERA_VEHICULOS=6 npm run db:seed
 *
 * Defaults: ver `counts.ts`. Cada seeder es idempotente (si ya hay filas, omite).
 * Ubicación de cada seeder: `src/features/.../<entidad>.seeder.ts`
 * Este archivo solo orquesta; no define datos.
 */
export async function runAllSeeders(): Promise<void> {
  const counts = resolveSeedCounts();
  console.log("🌱 Iniciando SeedersRunner...");
  console.log("📊 Conteos:", counts);

  const ok = await testConnection();
  if (!ok) {
    throw new Error("No hay conexión a la base de datos");
  }

  const isMysql =
    sequelize.getDialect() === "mysql" || sequelize.getDialect() === "mariadb";
  if (isMysql) {
    await sequelize.query("SET FOREIGN_KEY_CHECKS = 0");
  }
  try {
    await sequelize.sync({ force: false, alter: true });
  } finally {
    if (isMysql) {
      await sequelize.query("SET FOREIGN_KEY_CHECKS = 1");
    }
  }

  // Orden: business (padres → hijos)
  await seedPasajeros(counts.pasajeros);
  await seedTipoVehiculos(counts.tipos_vehiculo);
  await seedVehiculos(counts.vehiculos);
  await seedCarreras(counts.carreras);
  await seedCarreraVehiculos(counts.carrera_vehiculos);

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
### `src/swagger/index.ts`

```bash
: > src/swagger/index.ts
cat >> src/swagger/index.ts << 'EOF'
import { Application } from "express";
import swaggerUi from "swagger-ui-express";
import { pasajeroSwagger } from "../features/business/pasajero/pasajero.swagger";
import { vehiculoTypeSwagger } from "../features/business/tipo-vehiculo/tipo-vehiculo.swagger";
import { vehiculoSwagger } from "../features/business/vehiculo/vehiculo.swagger";
import { carreraSwagger } from "../features/business/carrera/carrera.swagger";
import { vehiculoCarreraSwagger } from "../features/business/carrera-vehiculo/carrera-vehiculo.swagger";

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
  vehiculoTypeSwagger,
  vehiculoSwagger,
  carreraSwagger,
  vehiculoCarreraSwagger,
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
        "API MoviCab (Express + Sequelize). Los endpoints de business están documentados como **SIN AUTH** (este lab no implementa autenticación).",
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
### Estado final `src/config/index.ts` (consolida ISS-01…08)

```bash
: > src/config/index.ts
cat >> src/config/index.ts << 'EOF'
import dotenv from "dotenv";
import express, { Application } from "express";
import morgan from "morgan";
var cors = require("cors");
import { sequelize, getDatabaseInfo, testConnection } from "../database/db";
import "../features/business/pasajero/pasajero.model";
import "../features/business/tipo-vehiculo/tipo-vehiculo.model";
import "../features/business/vehiculo/vehiculo.model";
import "../features/business/carrera/carrera.model";
import "../features/business/carrera-vehiculo/carrera-vehiculo.model";
import "../features/business/vehiculo/vehiculo.associations";
import "../features/business/carrera/carrera.associations";
import "../features/business/carrera-vehiculo/carrera-vehiculo.associations";
import { Routes } from "../routes/index";
import { setupSwagger } from "../swagger/index";

dotenv.config();

export class App {
  public app: Application;
  public routePrv: Routes = new Routes();

  constructor(private port?: number | string) {
    this.app = express();
    this.settings();
    this.middlewares();
    this.routes();
    this.docs();
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
    this.routePrv.pasajeroRoutes.routes(this.app);
    this.routePrv.vehiculoTypeRoutes.routes(this.app);
    this.routePrv.vehiculoRoutes.routes(this.app);
    this.routePrv.carreraRoutes.routes(this.app);
    this.routePrv.vehiculoCarreraRoutes.routes(this.app);
  }

  private docs(): void {
    setupSwagger(this.app);
  }

  private async dbConnection(): Promise<void> {
    try {
      const dbInfo = getDatabaseInfo();
      console.log(`🔗 Intentando conectar a: ${dbInfo.engine.toUpperCase()}`);

      const isConnected = await testConnection();
      if (!isConnected) {
        throw new Error(`No se pudo conectar a la base de datos ${dbInfo.engine.toUpperCase()}`);
      }

      // Lab: sync crea/altera tablas desde los modelos (BD limpia → snake_case desde cero).
      const force = process.env.DB_SYNC_FORCE === "true";
      const isMysql =
        sequelize.getDialect() === "mysql" || sequelize.getDialect() === "mariadb";

      if (isMysql) {
        await sequelize.query("SET FOREIGN_KEY_CHECKS = 0");
      }
      try {
        await sequelize.sync({ force, alter: !force });
      } finally {
        if (isMysql) {
          await sequelize.query("SET FOREIGN_KEY_CHECKS = 1");
        }
      }

      console.log(
        force
          ? "📦 Base de datos recreada (DB_SYNC_FORCE=true)"
          : "📦 Base de datos sincronizada exitosamente"
      );
    } catch (error) {
      console.error("❌ Error al conectar con la base de datos:", error);
      process.exit(1);
    }
  }

  async listen() {
    await this.app.listen(this.app.get('port'));
    console.log(`🚀 Servidor ejecutándose en puerto ${this.app.get('port')}`);
  }
}
EOF
```

**PARCHE** — `src/config/index.ts`: al cerrar ISS-08 el bloque de imports de modelos/asociaciones y `routes()` debe quedar como en el repo (models pasajero→tipo-vehiculo→vehiculo→carrera→carrera-vehiculo; associations vehiculo + carrera + carrera-vehiculo; `routes()` registra las **5** features business).

### Verificación ISS-08 / business completo

```bash
npx tsc --noEmit
npm run db:seed
curl -s http://localhost:4000/api/tipos-vehiculo | head
curl -s http://localhost:4000/api/vehiculos | head
curl -s http://localhost:4000/api/carreras | head
curl -s http://localhost:4000/api/detalle-carreras | head
```

### Cierre del ISS

```bash
npm run dev
```

> Swagger: `http://localhost:4000/api/docs`. El servidor debe arrancar sin error.

---

# 14. Estructura final (tras ISS-08)

## DoD del laboratorio (business SIN AUTH)

Al cerrar ISS-08 el backend está **completo para este lab**:

- [ ] 5 features: `pasajero`, `tipo-vehiculo`, `vehiculo`, `carrera`, `carrera-vehiculo`
- [ ] 5 tablas: `pasajeros`, `tipos_vehiculo`, `vehiculos`, `carreras`, `carrera_vehiculos`
- [ ] APIs: `/api/pasajeros`, `/api/tipos-vehiculo`, `/api/vehiculos`, `/api/carreras`, `/api/detalle-carreras`
- [ ] SeedersRunner + Swagger `/api/docs`
- [ ] **Sin** autenticación ni autorización (todas las rutas SIN AUTH)
- [ ] `npx tsc --noEmit` OK

Consulta de campos/tablas (opcional): `docs/BD_MOVICAB_ENTIDADES_Y_ARQUITECTURA_BACKEND_FRONTEND.md`.


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
│   │       ├── tipo-vehiculo/     # + http + seeder + swagger
│   │       ├── vehiculo/          # + associations + http + seeder + swagger
│   │       ├── carrera/             # cabecera + carrera.associations + http + seeder + swagger
│   │       └── carrera-vehiculo/     # pivote carrera_vehiculos + associations + CRUD + seeder + swagger
│   ├── routes/index.ts
│   ├── swagger/index.ts
│   └── server.ts
└── …
```

| Método | Ruta | Nota |
|--------|------|------|
| * | `/api/pasajeros…` | SIN AUTH (ISS-03) |
| * | `/api/tipos-vehiculo…` | SIN AUTH (ISS-06) |
| * | `/api/vehiculos…` | SIN AUTH (ISS-07) |
| * | `/api/carreras…` | SIN AUTH (ISS-08) |
| * | `/api/detalle-carreras…` | SIN AUTH (ISS-08 · CarreraVehiculo) |
| GET | `/api/docs` | Swagger UI |
| GET | `/api/docs.json` | OpenAPI JSON |

### Norma de nombres (carpeta, clase, tabla, FK)

| Pieza | Norma | Ejemplo |
|-------|-------|---------|
| Carpeta feature | kebab-case | `tipo-vehiculo/`, `carrera-vehiculo/` |
| Clase | PascalCase singular | `Pasajero`, `TipoVehiculo`, `Carrera`, `CarreraVehiculo` |
| Tabla BD | snake_case plural (compuestos con `_`) | `pasajeros`, `tipos_vehiculo`, `carrera_vehiculos` |
| FK | singular de la tabla referenciada + `_id` | `pasajero_id`, `tipo_vehiculo_id`, `carrera_id`, `vehiculo_id` |
| Columnas de negocio | snake_case | `min_stock`, `carrera_date`, `unit_price`, `line_total` |
| SeedCounts / JSON compuestos | snake_case | `tipos_vehiculo`, `carrera_vehiculos`, `tipo_vehiculo` |

No uses camelCase en tablas (`tipoVehiculos` ❌ → `tipos_vehiculo` ✅).

En `*.associations.ts`:

```ts
Carrera.belongsTo(Pasajero, { foreignKey: "pasajero_id", as: "pasajero" });
Pasajero.hasMany(Carrera, { foreignKey: "pasajero_id", as: "carreras" });
CarreraVehiculo.belongsTo(Carrera, { foreignKey: "carrera_id", as: "carrera" });
Carrera.hasMany(CarreraVehiculo, { foreignKey: "carrera_id", as: "items" });
Vehiculo.hasMany(CarreraVehiculo, { foreignKey: "vehiculo_id", as: "carrera_items" });
```

Con BD limpia, `sequelize.sync` crea FKs snake_case desde modelos/`*.associations.ts`.
Opcional: `DB_SYNC_FORCE=true npm run dev` recrea tablas.

### Cómo repetir el patrón (otra entidad)

```text
ISS-n-A…E  CRUD + http (cat >> / PARCHE)
ISS-n-F    seeder + PARCHE counts/runner
ISS-n-G    swagger + PARCHE registry
ISS-n-R    si hay FK `tabla_singular_id`: associations.ts + PARCHE config
```

---


# 15. Referencia rápida de paquetes

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

# 16. Fuentes

- **Este manual** es la única guía de construcción (ISS, `cat >>`, **PARCHE**).
- [`BD_MOVICAB_ENTIDADES_Y_ARQUITECTURA_BACKEND_FRONTEND.md`](./BD_MOVICAB_ENTIDADES_Y_ARQUITECTURA_BACKEND_FRONTEND.md) — **solo consulta**: entidades **business** y sus campos (no es un paso de construcción).
