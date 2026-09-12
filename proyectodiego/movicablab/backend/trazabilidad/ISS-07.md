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

**Herramienta / modelo:** pendiente  
**Fecha:** pendiente  
**Prompt enviado:**

```text
(pendiente — copiar de docs/Guion_IA_Desarrollo_Software.md ISS-07)
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
