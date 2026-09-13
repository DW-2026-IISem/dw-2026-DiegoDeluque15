> **Workspace:** `movicab-lab/backend` · **Pista:** MoviCab IA (12 issues, sin auth) · **Guion:** `docs/Guion_IA_Desarrollo_Software.md` · **Metodología:** SDD+Kanban · **Arquitectura:** `docs/Prompt.md`

# ISS-07 — Feature Tarifa CA

**Naturaleza:** práctico (MoviCab backend pista IA)  
**Issue GitHub:** `movicab-backend #__`  
**Responsable (desarrollador):** Diego Armando De Luque Castillo  
**Revisor humano:**  
**Dependencias:** ISS-06 en Hecho  
**Commit esperado:** `feat(iss-07): feature tarifa CA` con `Refs #__`

---

## 1. SDD — Preparado

**OBJ:** Tarifas con vigencias sin solape y endpoint vigente.

**SPEC:**
- pricing/tarifas.
- GET /api/tarifas/vigente.

**REQ:**
- valor_base > 0.

**AC:**
- [ ] **AC-1** POST válido → 201.
- [ ] **AC-2** valor_base <= 0 → 400.
- [ ] **AC-3** solape → 409.
- [ ] **AC-4** GET vigente OK.

**Checklist interno (IA, En curso):**
- [ ] Validación vigencias
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
docs/trazabilidad/ISS-07.md (objetivo, alcance, requisitos y criterios de aceptación de
este issue).

Implementa la feature Tarifa en src/features/business/pricing/, siguiendo el mismo
patrón de 4 capas que usaste en las features anteriores:

- domain: entidad Tarifa (id, nombre, reglaCalculo, valorBase, vigenciaDesde,
  vigenciaHasta, isActive) — SIN createdAt/updatedAt, la definición de entidades del
  proyecto no los incluye para Tarifa (igual que Empresa en ISS-04, a diferencia de
  Vehiculo/Conductor/Turno que sí los llevan). Sin ninguna dependencia de
  NestJS/Sequelize; interfaz ITarifaRepository; TarifaNotFoundException;
  TarifaSolapadaException (409).
- application: CreateTarifaDto (valorBase debe ser mayor que 0 — 400 si no; vigenciaDesde
  debe ser anterior a vigenciaHasta — 400 si no); caso de uso CreateTarifa valida que no
  haya solape de vigencias activas para la misma reglaCalculo (409 si hay solape); caso
  de uso GetTarifaVigente devuelve la tarifa activa cuya vigencia cubre la fecha actual
  (404 si ninguna cubre hoy); UpdateTarifa solo permitido si vigenciaDesde de esa tarifa
  todavía no ha llegado (409 si ya está vigente o vencida).
- infrastructure: TarifaModel con timestamps: false; repositorio Sequelize.
- presentation: GET/POST/PATCH/DELETE /api/tarifas(/:id) + GET /api/tarifas/vigente
  (esta ruta específica debe registrarse ANTES de /api/tarifas/:id en el controller para
  que Nest no la interprete como un :id literal).
- Módulo pricing registrado en BusinessModule.

Reglas importantes:
- NO modifiques nada dentro de docs/ ni de trazabilidad/ todavía.
- NO agregues ningún seeder.
- Delete = soft delete; 409 si la tarifa está vigente y tiene Carreras asociadas — deja
  un puerto/stub documentado para esa validación, con un comentario indicando qué issue
  de Carrera lo reemplazará (verifica el número exacto en docs/Guion_IA_Desarrollo_Software.md,
  no asumas de memoria).
- No hagas ningún commit sin que yo te lo pida explícitamente.
- No adelantes ninguna otra feature de negocio.

Eficiencia (importante): sé conciso en tus respuestas de texto. No repitas el contenido
completo de archivos que ya generaste ni describas cada línea de código escrita — un
resumen breve de qué archivos creaste y qué decisiones tomaste es suficiente. Evita
releer o reescribir archivos que no necesitas modificar. Antes de crear archivos, dime
en 2-3 líneas (no más) qué vas a crear y por qué.

Cuando yo te diga "documenta ISS-07", edita directamente docs/proceso.md (nueva entrada,
mismo formato que los issues anteriores, usando SIEMPRE "Antigravity (modo agente)" sin
nombre de modelo específico) y trazabilidad/ISS-07.md (solo la sección de "IA usada", con
el prompt completo real, sin tocar EVI, revisión humana ni Gate), mostrándome el diff
antes de confirmar — también de forma concisa, sin reproducir el archivo completo si el
diff ya es claro.
```

**Ajustes o correcciones:** 
- Se corrigió un código HTTP incorrecto en la validación de fechas invertidas (`vigenciaDesde >= vigenciaHasta`), cambiando de 409 (conflicto) a 400 (Bad Request).

---

## 4. EVI — Verificación

**Evidencia (capturas):**
- AC-1 (crear tarifa válida → 201): `![AC-1](capturas/iss-07-01-crear.png)`
- AC-2 (valorBase <= 0 → 400): `![AC-2](capturas/iss-07-02-validacion.png)`
- AC-3 (solape de vigencia → 409): `![AC-3](capturas/iss-07-03-solape.png)`
- AC-4 (GET /vigente → 200): `![AC-4](capturas/iss-07-04-vigente.png)`
- Extra (fechas invertidas → 400, tras corrección): `![Extra](capturas/iss-07-05-fechas.png)`
- Extra (update bloqueado si ya vigente → 409): `![Extra](capturas/iss-07-06-update-bloqueado.png)`

| Fecha | Tipo | AC | Enlace | Cómo reproducir |
|-------|------|-----|--------|-----------------|
| | | | | |

**Commit (hash):** pendiente  
**Autoevaluación AC:** pendiente

-------|------|-----|--------|-----------------|
| | | | | |

**Commit (hash):** pendiente  
**Autoevaluación AC:** pendiente

---

## 5. Revisión humana

Preguntas guía: ¿Dónde se detecta solape?

| Fecha | Revisor | Actuación | AC | Evidencia | Hallazgo | Decisión |
|-------|---------|-----------|-----|-----------|----------|----------|
| | | | | | | |

**Respuesta del autor:**

---

## 6. Gate

**Estado:** pendiente  
**Conclusión:**  
**Trazabilidad final:**
