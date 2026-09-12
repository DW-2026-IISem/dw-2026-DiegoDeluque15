# Bitácora de proceso — MoviCab Backend (pista IA)

**Autor:** Diego Armando De Luque Castillo  
**Proyecto:** MoviCab · Desarrollo Web 2026-II  
**Repositorio:** movicab-lab/backend  
**Metodología:** SDD + Kanban + IA con revisión humana (M4)

> Registra **cada paso** que ejecutes: qué hiciste, qué herramienta usaste, qué verificaste y qué decidió el revisor. El chat de la IA **no** sustituye esta bitácora.

---

## Plantilla de entrada (copiar por cada sesión)

```markdown
### YYYY-MM-DD — ISS-XX — [Estado Kanban]

**Actividad:** (Preparado / En curso / Verificación / Revisión humana / Hecho)

**Qué hice:**
- 

**Prompt IA (si aplica):** trazabilidad/ISS-XX.md §3

**Verificación ejecutada por mí:**
- Comando: 
- Resultado: 

**Commit:** `hash` — `mensaje` — Refs #n

**Revisor:** (pendiente / conforme / devolución / Gate aprobado)

**Notas / aprendizajes:**
- 
```

---

## Registro cronológico

### 2026-09-11 — Día 0 — Preparación metodología

**Actividad:** Preparado (sin issue aún)

**Qué hice:**
- Adapté plantillas de trazabilidad del guion StoreLab a dominio MoviCab (16 entidades, sin auth).
- Creé `docs/Prompt.md`, `docs/kanban.md`, `docs/sdd.md`, `docs/Guion_IA_Desarrollo_Software.md`.
- Definí 12 issues (ISS-01…ISS-12) en lugar de 7, por mayor número de entidades.
- Base de datos elegida: **MySQL** · `movicab_db`.

**Verificación:**
- Estructura Día 0: `.git/`, `docs/`, `trazabilidad/` presentes.
- Pendiente: limpiar `src/`, `node_modules/` del track manual antes de ISS-01.

**Revisor:** pendiente

**Notas:**
- La pista manual y la pista IA comparten dominio MoviCab pero repos/flujo separados.
- WIP = 1: no crear ISS-02 hasta Gate de ISS-01.

---

### (próxima entrada) — ISS-01 — Preparado

**Actividad:** Preparado

**Qué hice:**
- Crear Issue GitHub #1 con título `ISS-01 — Esqueleto NestJS CA arrancable`.
- Completar cabecera en `trazabilidad/ISS-01.md`.
- Enviar a revisor para §2 (aprobación de AC).

**Verificación:** pendiente

**Revisor:** pendiente

---

## Evidencias de motores de BD (Semanas previas)

| Motor | Estado | Notas |
|---|---|---|
| MySQL | OK | Elegido para desarrollo · BD `movicab_db` |
| PostgreSQL | OK | Verificado con Sequelize |
| SQL Server | OK | dialectOptions encrypt |
| Oracle | OK | DUAL, service name |

Detalle en evidencias del repositorio del curso (`dw-2026-DiegoDeluque15`).

---

---

### 2026-09-12 — ISS-01 — Esqueleto NestJS CA arrancable

**Herramienta de IA:** Antigravity (modo agente)

**Prompt usado:** Guion `docs/Guion_IA_Desarrollo_Software.md` ISS-01 + prompt de
corrección con tres puntos explícitos: (1) eliminar `src/features/identity/`, (2) cambiar
PORT a 3000 en `.env.example` y `src/main.ts`, (3) hacer que `GET /api/health` devuelva
el envelope completo `{ statusCode, message, data, timestamp }` definido en Prompt.md §5,
construido manualmente en el controlador.

**Lo que propuso la IA:** Generó el esqueleto completo de NestJS 10 con Clean
Architecture: `package.json` con scripts `free:port` y `start:dev`, `tsconfig.json`,
`nest-cli.json`, `.eslintrc.js`, `.prettierrc`, `.gitignore`, `.env.example` (PORT=3002),
`scripts/free-port.js`, `src/main.ts` con prefijo `/api`, CORS y ValidationPipe,
`AppModule` con `ConfigModule` global, `HealthController` devolviendo solo
`{ "status": "ok" }`, stubs de `src/config/`, `src/common/`,
`src/infrastructure/database/` (sequelize/ y seeders/), `BusinessModule` con los seis
subdirectorios de negocio vacíos, e `IdentityModule` stub.

**Lo que corregí y por qué:**
- **Eliminé `src/features/identity/` completo:** la IA la generó apoyándose en la tabla
  §4.2 de Prompt.md, pero el contrato de la pista prohíbe explícitamente cualquier
  carpeta relacionada con RBAC/Auth bajo cualquier nombre; este issue no debía crearla.
- **Cambié PORT de 3002 a 3000** en `.env.example` y en el fallback de `src/main.ts`:
  la IA tomó 3002 directamente de Prompt.md §5/§8, pero el puerto correcto del proyecto
  es 3000.
- **Corregí `GET /api/health`:** la IA devolvía solo `{ "status": "ok" }`; el contrato
  Prompt.md §5 exige el envelope `{ statusCode, message, data, timestamp }`. Al no
  existir aún el interceptor global (llega en ISS-02), se construyó el envelope
  manualmente dentro del controlador.

**Problemas encontrados y cómo se resolvieron:**
- PowerShell interceptó los operadores `<<`, `&&` y `{…}` al pasar comandos a WSL,
  impidiendo heredocs e inline scripts. Se resolvió escribiendo todos los archivos
  mediante un script Python intermedio guardado en Windows y ejecutado con `wsl python3`.
- Dos ejecuciones de `npm install` se solaparon (la segunda lanzó errores ENOTEMPTY al
  intentar reemplazar paquetes ya escritos por la primera). Se resolvió con
  `rm -rf node_modules && npm install` limpio.

**Resultado / commit:** `pendiente`

**Evidencia (capturas):**
- AC-1 (estructura de carpetas): ![AC-1](capturas/codigo/iss-01-01-estructura.png)
- AC-2 (arranque exitoso): ![AC-2](capturas/codigo/iss-01-02-arranque.png)
- AC-3 (health check): ![AC-3](capturas/codigo/iss-01-03-health.png)
- AC-4 (features/auth no existe): ![AC-1](capturas/codigo/iss-01-01-estructura.png)

## Reflexión M6 (completar al cierre del gate semanal)

| Pregunta | Respuesta |
|---|---|
| ¿Qué aprendí sobre SDD? | |
| ¿Qué limitaciones tuvo la IA? | |
| ¿Qué corregí manualmente tras generar? | |
| ¿El Kanban reflejó la realidad (WIP=1)? | |
