> **Workspace:** `movicab-lab/backend` · **Pista:** MoviCab IA (12 issues, sin auth) · **Guion:** `docs/Guion_IA_Desarrollo_Software.md` · **Metodología:** SDD+Kanban · **Arquitectura:** `docs/Prompt.md`

# ISS-01 — Esqueleto NestJS CA arrancable

**Naturaleza:** práctico (MoviCab backend pista IA)  
**Issue GitHub:** `movicab-backend #__`  
**Responsable (desarrollador):** Diego Armando De Luque Castillo  
**Revisor humano:**  
**Dependencias:** ninguna  
**Commit esperado:** `feat(iss-01): esqueleto NestJS CA arrancable` con `Refs #__`

---

## 1. SDD — Preparado

**OBJ:** Al finalizar, el desarrollador podrá arrancar un proyecto NestJS versionado en Git, con el árbol de Clean Architecture de MoviCab, para construir features sin reorganizar carpetas.

**SPEC:**
- Proyecto NestJS en raíz conservando `.git/`, `docs/`, `trazabilidad/`.
- Árbol `src/config/`, `src/common/`, `src/infrastructure/database/`, `src/features/business/` (stub), `src/features/identity/` (stub).
- `main.ts`: prefijo `/api`, CORS, ValidationPipe, puerto 3002.
- `GET /api/health` → 200.
- `scripts/free-port.js`, scripts `free:port` y `start:dev`.

**REQ:**
- Sin Sequelize, BD, Auth, JWT, login.
- No adelantar ISS-02.
- No borrar `docs/` ni `trazabilidad/`.

**AC:**
- [ ] **AC-1** Dado workspace con docs y trazabilidad; cuando IA termina; entonces existen package.json, src/main.ts intactos.
- [ ] **AC-2** Dado deps instaladas; cuando npm run start:dev; entonces arranque en puerto 3002.
- [ ] **AC-3** Dado app arriba; cuando GET /api/health; entonces 200 y status ok.
- [ ] **AC-4** Dado src/; entonces carpetas CA existen y no existe features/auth/.

**Checklist interno (IA, En curso):**
- [ ] Generar Nest sin borrar docs
- [ ] Árbol CA
- [ ] Health
- [ ] free-port

---

## 2. Revisión de AC

| Fecha | Revisor | Actuación | AC revisados | Evidencia | Hallazgo | Decisión |
|-------|---------|-----------|--------------|-----------|----------|----------|
| | | | OBJ, SPEC, REQ, AC | este archivo | | pendiente |

---

## 3. IA usada — En curso

**Herramienta / modelo:** Antigravity IDE — Claude Sonnet 4.6 (modo agente)  
**Fecha:** 2026-09-12  
**Prompt enviado:**

```text
Lee completo el archivo docs/Prompt.md (contrato fijo de arquitectura) y el archivo
docs/trazabilidad/ISS-01.md (objetivo, alcance, requisitos y criterios de aceptación de
este issue).

Implementa exactamente lo que pide ISS-01: el esqueleto de un proyecto NestJS dentro de
esta carpeta backend/, respetando el árbol de capas y las reglas de docs/Prompt.md.

Reglas importantes:
- NO modifiques nada dentro de docs/ ni de trazabilidad/.
- NO instales Sequelize ni ninguna dependencia de base de datos o de autenticación.
- Antes de crear archivos, dime en 3-4 líneas qué vas a crear y por qué.
- Al terminar, dame un resumen: qué archivos creaste/modificaste, y cualquier decisión
  que hayas tomado que no estuviera explícita en el prompt.
```

**Ajustes o correcciones:**
1. Eliminé `src/features/identity/` completo: la IA la generó basándose en §4.2 de
   Prompt.md, pero ninguna carpeta relacionada con RBAC/Auth debe existir en esta pista.
2. Cambié PORT de 3002 a 3000 en `.env.example` y en el fallback de `src/main.ts`.
3. Corregí `GET /api/health` para que devuelva el envelope de éxito completo
   `{ statusCode, message, data, timestamp }` según Prompt.md §5, construido
   manualmente en el controlador al no existir aún el interceptor global (ISS-02).

---

## 4. EVI — Verificación

| Fecha | Tipo | AC | Enlace | Cómo reproducir |
|-------|------|-----|--------|-----------------|
| | | | | |

**Commit (hash):** pendiente  
**Autoevaluación AC:** pendiente

---

## 5. Revisión humana

Preguntas guía: Señala qué va en config, common, infrastructure, features/business e identity.

| Fecha | Revisor | Actuación | AC | Evidencia | Hallazgo | Decisión |
|-------|---------|-----------|-----|-----------|----------|----------|
| | | | | | | |

**Respuesta del autor:**

---

## 6. Gate

**Estado:** pendiente  
**Conclusión:**  
**Trazabilidad final:**

**Evidencia (capturas):**
- AC-1 (estructura de carpetas): `![AC-1](../docs/capturas/iss-01-01-estructura.png)`
- AC-2 (arranque exitoso): `![AC-2](../docs/capturas/iss-01-02-arranque.png)`
- AC-3 (health check): `![AC-3](../docs/capturas/iss-01-03-health.png)`
- AC-4 (features/auth no existe): `![AC-1](../docs/capturas/iss-01-01-estructura.png)`
