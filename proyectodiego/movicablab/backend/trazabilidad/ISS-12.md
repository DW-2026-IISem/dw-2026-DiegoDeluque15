> **Workspace:** `movicab-lab/backend` · **Pista:** MoviCab IA (12 issues, sin auth) · **Guion:** `docs/Guion_IA_Desarrollo_Software.md` · **Metodología:** SDD+Kanban · **Arquitectura:** `docs/Prompt.md`

# ISS-12 — Integración, seeders y demo

**Naturaleza:** práctico (MoviCab backend pista IA)  
**Issue GitHub:** `movicab-backend #__`  
**Responsable (desarrollador):** Diego Armando De Luque Castillo  
**Revisor humano:**  
**Dependencias:** ISS-01…11 en Hecho  
**Commit esperado:** `feat(iss-12): integracion seeders y demo movicab` con `Refs #__`

---

## 1. SDD — Preparado

**OBJ:** Demo MoviCab reproducible desde BD vacía.

**SPEC:**
- Orquestador seeders.
- Swagger /api/docs.
- README libreto demo.

**REQ:**
- BD con SQL no force.

**AC:**
- [x] **AC-1** BD vacía OK.
- [x] **AC-2** libreto demo OK.
- [x] **AC-3** sin auth.
- [x] **AC-4** README OK.
- [x] **AC-5** Swagger OK.

**Checklist interno (IA, En curso):**
- [x] Runner
- [x] README
- [x] Swagger

---

## 2. Revisión de AC

| Fecha | Revisor | Actuación | AC revisados | Evidencia | Hallazgo | Decisión |
|-------|---------|-----------|--------------|-----------|----------|----------|
| | | | OBJ, SPEC, REQ, AC | este archivo | | pendiente |

---

## 3. IA usada — En curso

**Herramienta / modelo:** Antigravity (modo agente)  
**Fecha:** 2026-09-15  
**Prompt enviado:**

```text
Implementa ISS-12 — integración final de la pista. Tres entregables:

═══════════════════════════════════════
1. ORQUESTADOR DE SEEDERS
═══════════════════════════════════════

Crea src/infrastructure/database/seeders/seed.runner.ts (o el nombre que prefieras, pero
regístralo de forma clara), que siembre datos en este orden estricto de dependencias:

1. Empresas (2-3 registros)
2. Conductores (algunos con empresaId, alguno independiente sin empresa)
3. Vehiculos (ligados a las empresas)
4. Turnos (combinando conductores y vehículos activos)
5. Pasajeros (2-3 registros)
6. Tarifas (al menos una vigente HOY — usa fechas relativas a la fecha actual del
   sistema, no fechas fijas hardcodeadas, para que la demo siga funcionando en el futuro)
7. Roles (ADMIN, DESPACHO, CONDUCTOR, FINANZAS, SOPORTE — nombres del catálogo RBAC ya
   mencionado en el dominio, aunque no se usen para autenticación real)

NO siembres Carreras, Pagos, Calificaciones ni Liquidaciones — esas se crean en vivo
durante la demo, tal como está definido en el alcance de esta pista.

Cada seeder debe ser IDEMPOTENTE: usa findOrCreate con una clave natural (nit para
Empresa, nombre para Pasajero/Rol, etc.) para que correr start:dev una segunda vez NO
duplique registros. Verifica esto explícitamente al final: cuenta las filas antes y
después de un segundo arranque.

Engancha el runner en el arranque de la aplicación (por ejemplo, en el onModuleInit de
DatabaseModule, después de sync(), o en main.ts antes de listen()) — decide el lugar más
limpio y explícalo.

═══════════════════════════════════════
2. SWAGGER COMPLETO
═══════════════════════════════════════

Ya existe Swagger desde ISS-03, pero verifica y completa:
- Que las 10 features de negocio Y las 6 de identity aparezcan documentadas en /api/docs
  con sus DTOs correctos.
- Que cada controller tenga al menos @ApiTags() con el nombre del recurso, para que el
  Swagger UI quede organizado por secciones, no como una lista plana de 16 controllers.

═══════════════════════════════════════
3. README.md en backend/
═══════════════════════════════════════

Crea (o actualiza si ya existe uno genérico de Nest) backend/README.md con:

- Requisitos previos (Node, MySQL, Docker si aplica).
- Cómo crear la base movicab_db.
- Cómo configurar .env (referencia a .env.example).
- Cómo arrancar (npm install, npm run start:dev).
- Lista de endpoints principales (puedes agrupar por feature, con un link o mención a
  Swagger para el detalle completo).
- LIBRETO DE DEMO paso a paso, reproducible desde BD vacía, en este orden (usa los ids
  reales que generen los seeders, no inventes ids fijos):
  1. Arrancar con BD vacía → confirmar que los seeders corrieron (contar filas).
  2. GET /api/empresas, /api/conductores, /api/vehiculos, /api/turnos, /api/pasajeros,
     /api/tarifas/vigente → confirmar datos sembrados.
  3. POST /api/carreras → crear una carrera.
  4. PATCH .../estado → aceptada → en_curso → cerrada (mostrar total calculado).
  5. POST /api/pagos → pagar la carrera cerrada.
  6. POST /api/calificaciones → calificarla.
  7. POST /api/liquidaciones → liquidar al conductor correspondiente.
  8. Un ejemplo de error controlado (409 o 404) para mostrar el manejo de errores.
- Una sección explícita: "Esta pista NO incluye autenticación real. Las entidades
  User/Role/RoleUser/Resource/ResourceRole/RefreshToken existen como datos CRUD
  (ISS-11), sin JWT, guards, ni login. Ver docs/Prompt.md §1."

═══════════════════════════════════════
REGLAS IMPORTANTES
═══════════════════════════════════════
- NO uses sync({force:true}) en ningún punto — los seeders trabajan sobre el esquema ya
  sincronizado con alter:false.
- NO crees src/features/auth/ ni agregues ninguna dependencia de Auth.
- NO hagas ningún commit sin que yo te lo pida explícitamente.
- Antes de escribir el runner de seeders, dime en 3-4 líneas dónde lo vas a enganchar y
  por qué, ya que es la decisión más delicada de este issue.
```

**Ajustes o correcciones:**
Sin correcciones al entregable inicial tras verificación completa: build 0 errores, seeders idempotentes, Swagger con 17 tags, README y libreto demo verificados. Trabajo aceptado **sin cambios de código**.

**Hallazgo en verificación (no requirió cambio de código):** `POST /api/carreras` con `pasajeroId: 6` → 404 (pasajero inactivo de pruebas manuales previas, no del seeder). Resuelto en la demo usando pasajero sembrado `id: 9` ("Ana García Demo").

---

## 4. EVI — Verificación

**Evidencia (capturas):**
- AC-1 (BD vacía, seeders corren al arrancar): `![AC-1](capturas/iss-12-01-seeders-arranque.png)`
- AC-2 (libreto demo completo, carrera de punta a punta): `![AC-2](capturas/iss-12-02-libreto-completo.png)`
- AC-3 (sin auth, grep y find vacíos): `![AC-3](capturas/iss-12-03-sin-auth.png)`
- AC-4 (README visible): `![AC-4](capturas/iss-12-04-readme.png)`
- AC-5 (Swagger con 17 secciones organizadas): `![AC-5](capturas/iss-12-05-swagger.png)`
- Extra (idempotencia: mismos totales antes/después de reiniciar): `![Extra](capturas/iss-12-06-idempotencia.png)`

**Commit (hash):** pendiente  
**Autoevaluación AC:** pendiente

---

## 5. Revisión humana

Preguntas guía: Demo en vivo.

| Fecha | Revisor | Actuación | AC | Evidencia | Hallazgo | Decisión |
|-------|---------|-----------|-----|-----------|----------|----------|
| | | | | | | |

**Respuesta del autor:**

---

## 6. Gate

**Estado:** pendiente  
**Conclusión:**  
**Trazabilidad final:**
