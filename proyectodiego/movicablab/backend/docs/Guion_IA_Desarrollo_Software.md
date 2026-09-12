# Guion paso a paso — MoviCab Backend (pista IA)

**Workspace:** `movicab-lab/backend`  
**Repositorio GitHub:** `DiegoDeluque15/movicab-backend-ia` (o el repo que uses para Issues/Project)  
**Project:** `SDD Kanban — MoviCab Backend IA`  
**Metodología:** SDD + Kanban (ver guion original del curso)  
**Contrato:** `docs/Prompt.md`  
**Plantillas:** `trazabilidad/ISS-01.md` … `ISS-12.md`  
**Bitácora:** `docs/proceso.md`  
**Kanban:** `docs/kanban.md`

> Adaptación de StoreLab (4 entidades, 7 issues) → **MoviCab (16 entidades, 12 issues, sin auth)**.

---

## Alcance pista IA

| Incluido | Excluido |
|---|---|
| 10 entidades negocio | Login, JWT, guards |
| 6 entidades RBAC como **CRUD de datos** | bcrypt, passport, @nestjs/jwt |
| Clean Architecture + Sequelize | `features/auth/` |
| MySQL `movicab_db` | Autenticación real (semana posterior) |

---

## Flujo Kanban (igual al guion original)

```text
Preparado → En curso → Verificación → Revisión humana → Hecho
```

- **WIP = 1** — solo un issue En curso.
- Crear **un issue a la vez** en GitHub cuando el anterior tenga Gate aprobado.
- Commits: `feat(iss-0N): …` + `Refs #n` (no `Closes #n`).

---

## Día 0 — Estado inicial

El workspace debe contener **solo**:

- `.git/`
- `docs/` (Prompt, sdd, kanban, proceso, este guion)
- `trazabilidad/` (12 plantillas)

**No debe haber:** `src/`, `package.json`, `node_modules/`.

Si quedó código del track manual, elimínalo antes de ISS-01:

```bash
cd ~/movicab-lab/projects/dw/proyectodiego/movicablab/backend
rm -rf src node_modules dist .env tsconfig.build.tsbuildinfo
git init -b main   # si aún no hay .git en backend
git add docs trazabilidad .gitignore
git commit -m "chore(dia-0): metodologia movicab ia y plantillas trazabilidad"
git push -u origin main
```

---

## Parte A — ISS-01 (detallado)

### Pasos 1–5

1. Crear GitHub Project con 5 columnas Status (ver `docs/kanban.md`).
2. Crear **solo** Issue `#1`: `ISS-01 — Esqueleto NestJS CA arrancable`.
3. Cuerpo del issue:

```markdown
**Trazabilidad:** `trazabilidad/ISS-01.md`
**Naturaleza:** práctico (MoviCab backend pista IA)
```

4. Anotar `#1` en cabecera de `trazabilidad/ISS-01.md`.
5. Revisor aprueba AC en §2 → mover a **En curso**.

### Paso 6 — Prompt ISS-01 (modo agente Cursor)

```text
Naturaleza: PRÁCTICO. Eres asistente SOLO de ISS-01, no del backend entero.

Implementa los AC de trazabilidad/ISS-01.md siguiendo docs/Prompt.md (Clean Architecture, MoviCab).

Contexto: la raíz ya tiene .git/, docs/ y trazabilidad/. NO los borres ni modifiques.
Genera NestJS en directorio temporal (nest new movicab-backend --skip-git --package-manager npm)
y mueve contenido a la raíz fusionando .gitignore (node_modules/, dist/, .env).

Crea: src/config, src/common, src/infrastructure/database,
src/features/business/business.module.ts (stub),
src/features/identity/identity.module.ts (stub).

main.ts: setGlobalPrefix('api'), enableCors({ origin: 'http://localhost:4200', credentials: true }),
ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }),
listen(process.env.PORT ?? 3002).
GET /api/health → 200 { "status": "ok" }.
scripts/free-port.js; npm scripts free:port y start:dev.

Prohibido: Sequelize, BD, Auth, JWT, login, features/auth.
NO adelantes ISS-02. NO toques docs/ ni trazabilidad/.

Entrega: archivos tocados; cómo verificar cada AC; fuera de alcance.
```

### Pasos 7–10

7. Pegar prompt exacto en `trazabilidad/ISS-01.md` §3.
8. Verificar AC (`npm run start:dev`, `curl /api/health`, `ls src`).
9. Commit + push + EVI en §4 → **Revisión humana**.
10. Revisor §5 + Gate §6 → **Hecho** → crear ISS-02.

---

## Parte B — ISS-02 a ISS-12 (prompts por issue)

Copia el prompt tal cual a Cursor. Pega en §3 de cada `trazabilidad/ISS-XX.md`.

### ISS-02 — Sequelize + common

```text
Naturaleza: PRÁCTICO. Asistente SOLO ISS-02.
Implementa AC de trazabilidad/ISS-02.md y docs/Prompt.md §7-8.
Env validado fail-fast por DB_DIALECT. Sequelize multi-motor, ALL_MODELS=[], sync({ alter: false }).
Common: ApplicationException, EntityNotFoundException (404), DomainException (400), BusinessRuleException (409),
GlobalExceptionFilter, interceptors logging/timeout/response (envelope data).
.env.example + .env local con bloques DB_*; BD movicab_db.
Drivers: mysql2, pg, tedious, oracledb.
Prohibido: modelos negocio, Auth, force/alter true. NO adelantes ISS-03.
```

### ISS-03 — Pasajero

```text
Naturaleza: PRÁCTICO. SOLO ISS-03.
Feature src/features/business/passengers: entidad Pasajero PURA, IPasajeroRepository,
PasajeroModel (pasajeros) en ALL_MODELS, CRUD use-cases, /api/pasajeros, seeder idempotente.
Errores: 400 DTO, 404 id, soft delete is_active.
Prohibido: Auth, entidad extends Model. NO adelantes ISS-04.
```

### ISS-04 — Empresa

```text
Naturaleza: PRÁCTICO. SOLO ISS-04.
Feature fleets (empresas): nit UQ, razon_social, contacto_principal, /api/empresas.
Mismo patrón que passengers. 409 NIT duplicado. NIT inmutable en update.
```

### ISS-05 — Conductor + Vehículo

```text
Naturaleza: PRÁCTICO. SOLO ISS-05.
drivers/conductores (empresa_id opcional) y fleets/vehiculos (empresa_id obligatorio).
Validar empresa activa en use-case. FK solo en models. Seeders después de Empresa.
```

### ISS-06 — Turno

```text
Naturaleza: PRÁCTICO. SOLO ISS-06.
drivers/turnos: conductor_id + vehiculo_id activos; 409 si ya hay turno activo para conductor o vehículo.
/api/turnos.
```

### ISS-07 — Tarifa

```text
Naturaleza: PRÁCTICO. SOLO ISS-07.
pricing/tarifas: valor_base>0, vigencias sin solape, GET /api/tarifas/vigente.
```

### ISS-08 — Carrera

```text
Naturaleza: PRÁCTICO. SOLO ISS-08.
trips/carreras: máquina estados solicitada→aceptada→en_curso→cerrada|cancelada.
POST /api/carreras (pasajeroId, turnoId); total calculado con tarifa vigente; PATCH /api/carreras/:id/estado.
Entidad con cambiarEstado(). 409 transiciones inválidas.
```

### ISS-09 — Pago + Calificación

```text
Naturaleza: PRÁCTICO. SOLO ISS-09.
settlements/pagos y calificaciones. Pago: carrera cerrada, monto=total, inmutable.
Calificación: 0..1 por carrera, solo cerrada.
```

### ISS-10 — Liquidación

```text
Naturaleza: PRÁCTICO. SOLO ISS-10.
settlements/liquidaciones: agrupa carreras cerradas sin liquidacion_id; valor=suma; transacción Sequelize;
anular libera FK carreras.
```

### ISS-11 — RBAC datos (sin auth)

```text
Naturaleza: PRÁCTICO. SOLO ISS-11.
features/identity/: users, roles, role-users, resources, resource-roles, refresh-tokens.
CRUD básico; password_hash nunca en respuesta; seed catálogo roles.
PROHIBIDO: login, JWT, guards, bcrypt, @nestjs/jwt, passport, features/auth.
```

### ISS-12 — Integración + demo

```text
Naturaleza: PRÁCTICO. SOLO ISS-12.
Orquestador seeders: pasajero→empresa→conductor→vehículo→turno→tarifa→roles (idempotente).
Swagger /api/docs. README con libreto demo MoviCab:
 pasajero → empresa → conductor → vehículo → turno → tarifa → carrera (estados) → pago → liquidación.
Verificar ausencia Auth. BD vacía se recrea con SQL no force:true.
```

---

## Libreto demo MoviCab (ISS-12)

1. `DROP/CREATE DATABASE movicab_db` + `npm run start:dev`
2. `POST /api/pasajeros` → P
3. `POST /api/empresas` → E
4. `POST /api/conductores` `{ empresaId: E }` → C
5. `POST /api/vehiculos` `{ empresaId: E }` → V
6. `POST /api/turnos` `{ conductorId: C, vehiculoId: V }` → T
7. `POST /api/tarifas` (vigente hoy) → tarifa activa
8. `POST /api/carreras` `{ pasajeroId: P, turnoId: T }` → carrera solicitada
9. `PATCH estado` aceptada → en_curso → cerrada (total calculado)
10. `POST /api/pagos` → 201
11. `POST /api/liquidaciones` → agrupa carrera cerrada

---

## Errores que invalidan el método

- Prompt «hazme todo el backend»
- Adelantar issues sin Gate previo
- §3 sin prompt pegado tal cual
- EVI = «la IA dijo que funciona»
- Hecho marcado por desarrollador o IA
- `sync({ force: true })` o entidad dominio extends Model
- Commitear `.env`

---

## Referencia

Metodología completa (fundamentos SDD, roles, EVI, Gate): guion original  
`Guion_IA_Desarrollo_Software.md` del curso (StoreLab), aplicando las sustituciones de este documento.
