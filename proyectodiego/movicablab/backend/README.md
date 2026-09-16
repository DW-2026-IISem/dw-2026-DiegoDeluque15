# MoviCab Backend

API NestJS con Clean Architecture para despacho inteligente de taxis (pista IA — **sin autenticación real**).

## Requisitos previos

- **Node.js** 18+ y npm
- **MySQL** 8 (local o contenedor Docker del lab `movicab-lab`)
- Opcional: `curl` y `jq` para reproducir el libreto de demo

## Base de datos

Crear la base vacía (ajusta usuario/host según tu entorno):

```sql
DROP DATABASE IF EXISTS movicab_db;
CREATE DATABASE movicab_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

## Configuración

```bash
cp .env.example .env
```

Edita `.env` con el bloque del dialecto activo (`DB_DIALECT=mysql`). Variables mínimas:

- `PORT` — puerto HTTP (ej. `3000`)
- `DB_MYSQL_HOST`, `DB_MYSQL_PORT`, `DB_MYSQL_USERNAME`, `DB_MYSQL_PASSWORD`, `DB_MYSQL_NAME`

## Arranque

```bash
npm install
npm run start:dev
```

Al iniciar, Sequelize ejecuta `sync({ alter: false })` y luego el **orquestador de seeders** (`src/infrastructure/database/seeders/seed.runner.ts`) siembra datos demo idempotentes. En consola verás:

```
[Seeders] Conteos antes: { ... }
[Seeders] Conteos después: { ... }
[Seeders] Idempotencia: OK (0 duplicados)   ← en el segundo arranque
```

**Orden de siembra:** Empresas → Conductores → Vehículos → Turnos → Pasajeros → Tarifas → Roles.

No se siembran Carreras, Pagos, Calificaciones ni Liquidaciones (se crean en vivo durante la demo).

## Documentación API

Swagger UI: **http://localhost:3000/api/docs**

Salud: `GET /api/health`

### Endpoints principales

| Feature | Rutas base |
|---------|------------|
| Pasajeros | `/api/pasajeros` |
| Empresas | `/api/empresas` |
| Conductores | `/api/conductores` |
| Vehículos | `/api/vehiculos` |
| Turnos | `/api/turnos` |
| Tarifas | `/api/tarifas`, `/api/tarifas/vigente` |
| Carreras | `/api/carreras`, `PATCH /api/carreras/:id/estado` |
| Pagos | `/api/pagos` |
| Calificaciones | `/api/calificaciones` |
| Liquidaciones | `/api/liquidaciones` |
| Identidad (CRUD datos) | `/api/users`, `/api/roles`, `/api/role-users`, `/api/resources`, `/api/resource-roles`, `/api/refresh-tokens` |

Detalle de DTOs y schemas: ver Swagger.

---

## Libreto de demo (BD vacía → flujo completo)

Variables de entorno para los ejemplos:

```bash
export API=http://localhost:3000/api
```

### 1. Arrancar con BD vacía y confirmar seeders

Tras `npm run start:dev`, revisa el log `[Seeders]`. En el **segundo** arranque consecutivo los conteos antes/después deben coincidir (`Idempotencia: OK`).

### 2. Confirmar datos sembrados

```bash
curl -s $API/empresas | jq '.data.items | length'      # esperado: 3
curl -s $API/conductores | jq '.data.items | length'  # esperado: 3
curl -s $API/vehiculos | jq '.data.items | length'    # esperado: 3
curl -s $API/turnos | jq '.data.items | length'       # esperado: 2
curl -s $API/pasajeros | jq '.data.items | length'    # esperado: 3
curl -s $API/tarifas/vigente | jq '.data.nombre'      # "Tarifa Vigente Demo"
curl -s $API/roles | jq '[.data[].nombre]'            # ADMIN, DESPACHO, ...
```

Obtener ids reales de entidades demo (por nombre sembrado):

```bash
PASAJERO_ID=$(curl -s $API/pasajeros | jq '.data.items[] | select(.nombre=="Ana García Demo") | .id')
TURNO_ID=$(curl -s $API/turnos | jq '.data.items[] | select(.nombre=="Turno Mañana Carlos Demo") | .id')
CONDUCTOR_ID=$(curl -s $API/conductores | jq '.data.items[] | select(.nombre=="Carlos Mendoza Demo") | .id')
echo "PASAJERO_ID=$PASAJERO_ID TURNO_ID=$TURNO_ID CONDUCTOR_ID=$CONDUCTOR_ID"
```

### 3. Crear carrera

```bash
CARRERA_ID=$(curl -s -X POST $API/carreras \
  -H 'Content-Type: application/json' \
  -d "{\"pasajeroId\": $PASAJERO_ID, \"turnoId\": $TURNO_ID}" | jq '.data.id')
echo "CARRERA_ID=$CARRERA_ID"
```

### 4. Cambiar estados hasta cerrada

```bash
curl -s -X PATCH $API/carreras/$CARRERA_ID/estado -H 'Content-Type: application/json' -d '{"estado":"aceptada"}'
curl -s -X PATCH $API/carreras/$CARRERA_ID/estado -H 'Content-Type: application/json' -d '{"estado":"en_curso"}'
curl -s -X PATCH $API/carreras/$CARRERA_ID/estado -H 'Content-Type: application/json' -d '{"estado":"cerrada"}' | jq '.data.total'
# total calculado (ej. 15000)
```

### 5. Pagar carrera cerrada

```bash
curl -s -X POST $API/pagos \
  -H 'Content-Type: application/json' \
  -d "{\"referenciaId\": $CARRERA_ID, \"metodo\": \"efectivo\"}" | jq .
```

### 6. Calificar

```bash
curl -s -X POST $API/calificaciones \
  -H 'Content-Type: application/json' \
  -d "{\"carreraId\": $CARRERA_ID, \"puntaje\": 5, \"comentario\": \"Excelente servicio\"}" | jq .
```

### 7. Liquidar al conductor

```bash
FECHA_DESDE=$(date -u +%Y-%m-01)
FECHA_HASTA=$(date -u +%Y-%m-%d)
curl -s -X POST $API/liquidaciones \
  -H 'Content-Type: application/json' \
  -d "{\"conductorId\": $CONDUCTOR_ID, \"fechaDesde\": \"$FECHA_DESDE\", \"fechaHasta\": \"$FECHA_HASTA\"}" | jq .
```

### 8. Error controlado (409)

Intentar calificar de nuevo la misma carrera:

```bash
curl -s -X POST $API/calificaciones \
  -H 'Content-Type: application/json' \
  -d "{\"carreraId\": $CARRERA_ID, \"puntaje\": 3}" | jq .
# → 409 Conflict
```

---

## Autenticación

**Esta pista NO incluye autenticación real.** Las entidades User, Role, RoleUser, Resource, ResourceRole y RefreshToken existen como **datos CRUD** (ISS-11), sin JWT, guards ni login. Ver `docs/Prompt.md` §1.

Prohibido en este proyecto: `src/features/auth/`, `@nestjs/jwt`, `passport`, `bcrypt`.
