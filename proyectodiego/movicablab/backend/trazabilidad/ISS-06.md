> **Workspace:** `movicab-lab/backend` · **Pista:** MoviCab IA (12 issues, sin auth) · **Guion:** `docs/Guion_IA_Desarrollo_Software.md` · **Metodología:** SDD+Kanban · **Arquitectura:** `docs/Prompt.md`

# ISS-06 — Feature Turno CA

**Naturaleza:** práctico (MoviCab backend pista IA)  
**Issue GitHub:** `movicab-backend #7`  
**Responsable (desarrollador):** Diego Armando De Luque Castillo  
**Revisor humano:**  
**Dependencias:** ISS-05 en Hecho  
**Commit esperado:** `feat(iss-06): feature turno CA` con `Refs #7`

---

## 1. SDD — Preparado

**OBJ:** Turnos vinculan Conductor y Vehículo activos sin duplicar turnos activos.

**SPEC:**
- drivers/turnos.
- /api/turnos.

**REQ:**
- Un turno activo por conductor y vehículo.

**AC:**
- [x] **AC-1** POST válido → 201.
- [x] **AC-2** turno duplicado → 409.
- [x] **AC-3** conductor inactivo → 404.
- [x] **AC-4** filtro conductor_id.

**Checklist interno (IA, En curso):**
- [x] Unicidad
- [ ] Seeder

---

## 2. Revisión de AC

| Fecha | Revisor | Actuación | AC revisados | Evidencia | Hallazgo | Decisión |
|-------|---------|-----------|--------------|-----------|----------|----------|
| | | | OBJ, SPEC, REQ, AC | este archivo | | pendiente |

---

## 3. IA usada — En curso

**Herramienta / modelo:** Antigravity (modo agente)
**Fecha:** 2026-09-13
**Prompt enviado:**

```text
Lee completo el archivo docs/Prompt.md (contrato fijo de arquitectura) y el archivo
docs/trazabilidad/ISS-06.md (objetivo, alcance, requisitos y criterios de aceptación de
este issue).

Implementa la feature Turno en src/features/business/drivers/turnos/, dependiendo de los
repositorios de Conductor y Vehiculo ya existentes (ISS-05), siguiendo el mismo patrón de
4 capas:

- domain: entidad Turno (id, nombre, descripcion?, isActive, createdAt, updatedAt,
  conductorId, vehiculoId) sin ninguna dependencia de NestJS/Sequelize; interfaz
  ITurnoRepository; TurnoNotFoundException; TurnoSolapadoException (409);
  ConductorInactiveException / VehiculoInactiveException (409) si aplica según el AC.
- application: CreateTurnoDto (conductorId y vehiculoId requeridos); caso de uso
  CreateTurno valida que ambos existan y estén activos (404 si no existen), y que
  ninguno tenga ya otro turno activo simultáneo (409 si hay solape — defínelo como:
  mismo conductorId o mismo vehiculoId en un turno con isActive=true); ListTurnos filtra
  por conductorId, vehiculoId, isActive.
- infrastructure: TurnoModel con FKs conductor_id y vehiculo_id (BelongsTo); repositorio
  Sequelize.
- presentation: GET/POST/PATCH/DELETE /api/turnos(/:id).
- TurnosModule importa ConductoresModule y VehiculosModule para inyectar sus
  repositorios, y se registra dentro de DriversModule.

Nota sobre timestamps: la tabla turnos no existe todavía en movicab_db. Según la
definición de entidades del proyecto, Turno SÍ incluye createdAt/updatedAt — usa
timestamps: true en TurnoModel (con @CreatedAt/@UpdatedAt).

Reglas importantes:
- NO modifiques nada dentro de docs/ ni de trazabilidad/ todavía.
- NO agregues ningún seeder — la siembra queda centralizada para el issue de
  integración final.
- No implementes todavía el bloqueo de "no reasignar conductor/vehículo de un turno con
  Carreras en_curso" ni el DELETE bloqueado por Carreras — Carrera aún no existe. Deja un
  puerto/stub documentado con un comentario indicando qué issue lo reemplazará (verifica
  el número exacto de la feature Carrera en docs/Guion_IA_Desarrollo_Software.md antes de
  escribir el comentario — no asumas el número de memoria).
- No hagas ningún commit sin que yo te lo pida explícitamente.
- No adelantes ninguna otra feature de negocio.
- Antes de crear archivos, dime en 3-4 líneas qué vas a crear y por qué.

Cuando yo te diga "documenta ISS-06", edita directamente docs/proceso.md (nueva entrada,
mismo formato que los issues anteriores) y trazabilidad/ISS-06.md (solo la sección de
"IA usada", con el prompt completo real, no un resumen — sin tocar EVI, revisión humana
ni Gate), mostrándome el diff antes de confirmar.
```

**Ajustes o correcciones:** 
- Se verificó con `grep` que la numeración de ISS-08 (Carrera) era correcta desde el inicio.
- Se confirmó con `git diff --stat` que el reemplazo de stubs en `ConductoresModule` y `VehiculosModule` fue mínimo y acotado (solo 4 inserciones/8 eliminaciones en total).

---

## 4. EVI — Verificación

**Evidencia (capturas):**
- AC-1 (crear turno válido → 201): `![AC-1](capturas/iss-06-01-crear.png)`
- AC-2 (solape de conductor/vehículo → 409): `![AC-2](capturas/iss-06-02-solape.png)`
- AC-3 (conductor inexistente → 404): `![AC-3](capturas/iss-06-03-notfound.png)`
- AC-4 (filtro por conductorId): `![AC-4](capturas/iss-06-04-filtro.png)`
- Extra (integración: DELETE bloqueado por turno activo): `![Extra](capturas/iss-06-05-integracion.png)`

| Fecha | Tipo | AC | Enlace | Cómo reproducir |
|-------|------|-----|--------|-----------------|
| 2026-09-13 | curl | AC-1 | capturas/iss-06-01-crear.png | Crear turno válido → 201 |
| 2026-09-13 | curl | AC-2 | capturas/iss-06-02-solape.png | Solape de conductor/vehículo → 409 |
| 2026-09-13 | curl | AC-3 | capturas/iss-06-03-notfound.png | Conductor inexistente → 404 |
| 2026-09-13 | curl | AC-4 | capturas/iss-06-04-filtro.png | Filtro por `conductorId` |

**Commit (hash):** `28dccf1`  
**Autoevaluación AC:** Todos los AC verificados con evidencia real (ver tabla EVI).

---

## 5. Revisión humana

Preguntas guía: ¿Cómo detectas turno activo duplicado?

| Fecha | Revisor | Actuación | AC | Evidencia | Hallazgo | Decisión |
|-------|---------|-----------|-----|-----------|----------|----------|
| | | | | | | |

**Respuesta del autor:**

---

## 6. Gate

**Estado:** pendiente  
**Conclusión:**  
**Trazabilidad final:**
