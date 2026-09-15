# Contrato de arquitectura — MoviCab Backend (pista IA)

**Workspace:** `movicab-lab/backend`  
**Proyecto:** MoviCab — Despacho inteligente de taxis  
**Autor:** Diego Armando De Luque Castillo  
**Alcance pista IA:** 16 entidades, **sin autenticación** (sin JWT, guards, login ni bcrypt)

---

## 1. Propósito

Backend NestJS con Clean Architecture para gestionar el despacho de taxis: pasajeros, flota, conductores, turnos, tarifas, carreras, pagos, calificaciones, liquidaciones y entidades RBAC como **datos** (sin flujo de auth).

---

## 2. Capas y dependencias

```
presentation (controllers, DTOs HTTP)
      ↓
application (use-cases, puertos/repositorios)
      ↓
domain (entidades puras, invariantes, excepciones de dominio)

infrastructure (Sequelize models, repositorios, seeders) — implementa puertos
```

**Regla:** `presentation → application → domain`. El dominio **no** importa NestJS, Sequelize, HTTP ni `process.env`.

---

## 3. Árbol de carpetas

```
src/
├── config/                    # environment, validación .env
├── common/                    # excepciones, filters, interceptors
├── infrastructure/
│   └── database/
│       ├── sequelize/         # factory, module, ALL_MODELS
│       └── seeders/           # orquestador (ISS-12)
└── features/
    ├── business/
    │   ├── business.module.ts
    │   ├── passengers/        # Pasajero
    │   ├── fleets/            # Empresa, Vehiculo
    │   ├── drivers/           # Conductor, Turno
    │   ├── pricing/           # Tarifa
    │   ├── trips/             # Carrera
    │   └── settlements/       # Pago, Calificacion, Liquidacion
    └── identity/              # User, Role, RoleUser, Resource, ResourceRole, RefreshToken
        └── identity.module.ts # CRUD de datos; SIN authentication/
```

**Prohibido en pista IA:** `src/features/auth/`, `src/config/jwt/`, guards, `@nestjs/jwt`, `passport`, `bcrypt`.

---

## 4. Entidades y tablas

### 4.1 Negocio

| Entidad | Tabla | Campos clave | Invariantes |
|---|---|---|---|
| Pasajero | `pasajeros` | id, nombre, descripcion, is_active, created_at, updated_at | nombre obligatorio (mín. 2) |
| Empresa | `empresas` | id, nit (UQ), razon_social, contacto_principal, is_active | NIT único |
| Conductor | `conductores` | id, nombre, descripcion, empresa_id (FK nullable), is_active | empresa activa si se envía FK |
| Vehiculo | `vehiculos` | id, nombre, descripcion, empresa_id (FK), is_active | empresa_id obligatoria y activa |
| Turno | `turnos` | id, nombre, descripcion, conductor_id, vehiculo_id, is_active | conductor y vehículo activos; un turno activo por conductor/vehículo |
| Tarifa | `tarifas` | id, nombre, regla_calculo, valor_base, vigencia_desde, vigencia_hasta, is_active | valor_base > 0; vigencia_desde < vigencia_hasta; sin solape de vigencias activas |
| Carrera | `carreras` | id, pasajero_id, turno_id, tarifa_id, fecha_inicio, fecha_fin, total, estado, observaciones, liquidacion_id (nullable) | estado ∈ {solicitada, aceptada, en_curso, cerrada, cancelada}; total calculado en servidor |
| Pago | `pagos` | id, referencia_tipo, referencia_id, metodo, monto, fecha, estado | referencia_tipo = 'carrera'; monto = Carrera.total; inmutable |
| Calificacion | `calificaciones` | id, carrera_id (UQ), puntaje, comentario, is_active | 0..1 por carrera; solo tras cerrada *(Nota: campos actualizados en ISS-09 de nombre/descripcion genéricos a puntaje 1-5 y comentario)* |
| Liquidacion | `liquidaciones` | id, fecha, valor, estado, observaciones | agrupa carreras cerradas; valor = suma totales |

> **Nota sobre Liquidacion**: ni Prompt.md ni ISS-10.md especifican agrupar por conductor/empresa (solo dicen "agrupa carreras cerradas"). Se restaura el criterio de la especificación original del profesor: CreateLiquidacionDto recibe conductorId (obligatorio) + fechaDesde + fechaHasta, y solo agrupa carreras cerradas y sin liquidar CUYO TURNO pertenezca a ese conductor, dentro del rango de fechas. Decisión tomada en ISS-10, ya que agrupar sin discriminar conductor no tiene sentido de negocio real (¿a quién se le paga la liquidación?).

### 4.2 Identidad (solo datos, sin auth)

| Entidad | Tabla | Campos clave | Invariantes |
|---|---|---|---|
| User | `users` | id, email (UQ), password_hash, is_active | email único; nunca devolver password_hash en API |
| Role | `roles` | id, nombre (UQ), is_active | catálogo: ADMIN, DESPACHO, CONDUCTOR, FINANZAS, SOPORTE |
| RoleUser | `role_users` | id, user_id, role_id, is_active | único activo por (user_id, role_id) |
| Resource | `resources` | id, nombre (UQ), is_active | ej. POST /carreras |
| ResourceRole | `resource_roles` | id, resource_id, role_id, is_active | único activo por par |
| RefreshToken | `refresh_tokens` | id, user_id, token_hash, expires_at, revoked | solo persistencia; sin endpoint login |

### 4.3 Relaciones (FK en models Sequelize)

- Empresa 1:N Conductor, Vehiculo
- Conductor 1:N Turno; Vehiculo 1:N Turno
- Pasajero 1:N Carrera; Turno 1:N Carrera; Tarifa 1:N Carrera
- Carrera 1:N Pago; Carrera 0..1 Calificacion
- Liquidacion 1:N Carrera (FK `carreras.liquidacion_id`)
- User N:M Role (role_users); Role N:M Resource (resource_roles)
- User 1:N RefreshToken

---

## 5. HTTP y errores

- Prefijo global: `/api`
- Puerto: `process.env.PORT ?? 3002`
- ValidationPipe: `whitelist`, `forbidNonWhitelisted`, `transform`
- CORS: `origin: 'http://localhost:4200'`, `credentials: true`
- Errores: `{ statusCode, message, error }`
- Respuestas exitosas (desde ISS-02): `{ statusCode, message, data, timestamp }`
- Códigos: 400 validación/dominio, 404 no encontrado, 409 regla de negocio

### Endpoints principales (CRUD por feature salvo excepciones)

| Recurso | Rutas base |
|---|---|
| Salud | `GET /api/health` |
| Pasajeros | `/api/pasajeros` |
| Empresas | `/api/empresas` |
| Conductores | `/api/conductores` |
| Vehículos | `/api/vehiculos` |
| Turnos | `/api/turnos` |
| Tarifas | `/api/tarifas`, `GET /api/tarifas/vigente` |
| Carreras | `/api/carreras`, `PATCH /api/carreras/:id/estado` |
| Pagos | `/api/pagos` |
| Calificaciones | `/api/calificaciones` |
| Liquidaciones | `/api/liquidaciones` |
| Users / Roles / etc. | `/api/users`, `/api/roles`, … |

---

## 6. Patrón por feature

Cada feature incluye:

```
feature/
├── domain/entities/          # entidad PURA (sin Sequelize)
├── domain/interfaces/        # IFeatureRepository
├── domain/exceptions/
├── application/dto/
├── application/mappers/
├── application/use-cases/
├── infrastructure/persistence/models/
├── infrastructure/persistence/repositories/
├── infrastructure/persistence/seeders/   # si aplica
├── presentation/http/controllers/
└── feature.module.ts
```

- Entidad de dominio: clase TypeScript pura con invariantes y métodos de negocio (ej. `Carrera.cambiarEstado()`).
- Model: Sequelize en `infrastructure/persistence/models` — **único** lugar con decoradores ORM.
- Repositorio: interfaz en domain; implementación Sequelize en infrastructure.
- Use-case: un `execute()` por operación; orquesta repositorios y entidades.
- Soft delete: `is_active = false` salvo Pago y Liquidacion (inmutables).

---

## 7. Sequelize

- `sequelize.sync({ alter: false })` — **nunca** `force: true` ni `alter: true`
- `ALL_MODELS` en factory; cada issue registra sus models
- Transacciones obligatorias en agregados (Liquidacion, Carrera con side-effects)
- Base de datos desarrollo: **`movicab_db`** (MySQL)

---

## 8. Variables de entorno

```env
PORT=3002
DB_DIALECT=mysql

DB_MYSQL_HOST=localhost
DB_MYSQL_PORT=3306
DB_MYSQL_USERNAME=admin
DB_MYSQL_PASSWORD=abril152006
DB_MYSQL_NAME=movicab_db

DB_POSTGRES_HOST=
DB_POSTGRES_PORT=5432
DB_POSTGRES_USERNAME=
DB_POSTGRES_PASSWORD=
DB_POSTGRES_NAME=movicab_db

DB_MSSQL_HOST=
DB_MSSQL_PORT=1433
DB_MSSQL_USERNAME=
DB_MSSQL_PASSWORD=
DB_MSSQL_NAME=movicab_db

DB_ORACLE_HOST=
DB_ORACLE_PORT=1521
DB_ORACLE_USERNAME=
DB_ORACLE_PASSWORD=
DB_ORACLE_SERVICE=movicab_db
```

Validación **fail-fast**: exigir solo el bloque del `DB_DIALECT` activo. Mensaje: `Error de configuración: … <VARIABLE>`.

`.env` en `.gitignore`. `.env.example` versionado.

---

## 9. Convenciones

- Commits: `feat(iss-0N): descripción` + cuerpo `Refs #n`
- No usar `Closes #n` — el Gate humano cierra el issue
- Seeders idempotentes: `findOrCreate`
- Swagger en `/api/docs` (ISS-12)
- Nombres en español para dominio MoviCab; código en camelCase en TS, snake_case en BD
