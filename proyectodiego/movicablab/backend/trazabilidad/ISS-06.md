> **Workspace:** `movicab-lab/backend` · **Pista:** MoviCab IA (12 issues, sin auth) · **Guion:** `docs/Guion_IA_Desarrollo_Software.md` · **Metodología:** SDD+Kanban · **Arquitectura:** `docs/Prompt.md`

# ISS-06 — Feature Turno CA

**Naturaleza:** práctico (MoviCab backend pista IA)  
**Issue GitHub:** `movicab-backend #__`  
**Responsable (desarrollador):** Diego Armando De Luque Castillo  
**Revisor humano:**  
**Dependencias:** ISS-05 en Hecho  
**Commit esperado:** `feat(iss-06): feature turno CA` con `Refs #__`

---

## 1. SDD — Preparado

**OBJ:** Turnos vinculan Conductor y Vehículo activos sin duplicar turnos activos.

**SPEC:**
- drivers/turnos.
- /api/turnos.

**REQ:**
- Un turno activo por conductor y vehículo.

**AC:**
- [ ] **AC-1** POST válido → 201.
- [ ] **AC-2** turno duplicado → 409.
- [ ] **AC-3** conductor inactivo → 404.
- [ ] **AC-4** filtro conductor_id.

**Checklist interno (IA, En curso):**
- [ ] Unicidad
- [ ] Seeder

---

## 2. Revisión de AC

| Fecha | Revisor | Actuación | AC revisados | Evidencia | Hallazgo | Decisión |
|-------|---------|-----------|--------------|-----------|----------|----------|
| | | | OBJ, SPEC, REQ, AC | este archivo | | pendiente |

---

## 3. IA usada — En curso

**Herramienta / modelo:** pendiente  
**Fecha:** pendiente  
**Prompt enviado:**

```text
(pendiente — copiar de docs/Guion_IA_Desarrollo_Software.md ISS-06)
```

**Ajustes o correcciones:** pendiente

---

## 4. EVI — Verificación

| Fecha | Tipo | AC | Enlace | Cómo reproducir |
|-------|------|-----|--------|-----------------|
| | | | | |

**Commit (hash):** pendiente  
**Autoevaluación AC:** pendiente

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
