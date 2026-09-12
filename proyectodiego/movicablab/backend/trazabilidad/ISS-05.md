> **Workspace:** `movicab-lab/backend` · **Pista:** MoviCab IA (12 issues, sin auth) · **Guion:** `docs/Guion_IA_Desarrollo_Software.md` · **Metodología:** SDD+Kanban · **Arquitectura:** `docs/Prompt.md`

# ISS-05 — Features Conductor y Vehículo CA

**Naturaleza:** práctico (MoviCab backend pista IA)  
**Issue GitHub:** `movicab-backend #__`  
**Responsable (desarrollador):** Diego Armando De Luque Castillo  
**Revisor humano:**  
**Dependencias:** ISS-04 en Hecho  
**Commit esperado:** `feat(iss-05): features conductor y vehiculo CA` con `Refs #__`

---

## 1. SDD — Preparado

**OBJ:** Conductores y Vehículos con FK a Empresa activa.

**SPEC:**
- drivers/conductores y fleets/vehiculos.
- /api/conductores, /api/vehiculos.

**REQ:**
- FK validada en use-case.

**AC:**
- [ ] **AC-1** Conductor con empresa → 201.
- [ ] **AC-2** Vehículo sin empresa → 400.
- [ ] **AC-3** empresa inexistente → 404.
- [ ] **AC-4** empresa inactiva → 409.

**Checklist interno (IA, En curso):**
- [ ] Dos features
- [ ] FK models
- [ ] Seeders

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
(pendiente — copiar de docs/Guion_IA_Desarrollo_Software.md ISS-05)
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

Preguntas guía: ¿Dónde vive la FK?

| Fecha | Revisor | Actuación | AC | Evidencia | Hallazgo | Decisión |
|-------|---------|-----------|-----|-----------|----------|----------|
| | | | | | | |

**Respuesta del autor:**

---

## 6. Gate

**Estado:** pendiente  
**Conclusión:**  
**Trazabilidad final:**
