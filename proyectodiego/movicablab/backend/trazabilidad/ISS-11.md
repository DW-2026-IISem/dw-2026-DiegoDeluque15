> **Workspace:** `movicab-lab/backend` · **Pista:** MoviCab IA (12 issues, sin auth) · **Guion:** `docs/Guion_IA_Desarrollo_Software.md` · **Metodología:** SDD+Kanban · **Arquitectura:** `docs/Prompt.md`

# ISS-11 — Entidades identidad RBAC (datos)

**Naturaleza:** práctico (MoviCab backend pista IA)  
**Issue GitHub:** `movicab-backend #__`  
**Responsable (desarrollador):** Diego Armando De Luque Castillo  
**Revisor humano:**  
**Dependencias:** ISS-10 en Hecho  
**Commit esperado:** `feat(iss-11): entidades identidad RBAC datos` con `Refs #__`

---

## 1. SDD — Preparado

**OBJ:** 6 entidades RBAC como CRUD sin autenticación.

**SPEC:**
- features/identity/ submodules.
- password_hash nunca en respuesta.

**REQ:**
- Prohibido login, JWT, guards, bcrypt.

**AC:**
- [ ] **AC-1** user → 201 sin hash.
- [ ] **AC-2** email dup → 409.
- [ ] **AC-3** role-user dup → 409.
- [ ] **AC-4** sin features/auth.

**Checklist interno (IA, En curso):**
- [ ] 6 modules
- [ ] Seed roles

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
(pendiente — copiar de docs/Guion_IA_Desarrollo_Software.md ISS-11)
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

Preguntas guía: ¿Qué falta para auth real?

| Fecha | Revisor | Actuación | AC | Evidencia | Hallazgo | Decisión |
|-------|---------|-----------|-----|-----------|----------|----------|
| | | | | | | |

**Respuesta del autor:**

---

## 6. Gate

**Estado:** pendiente  
**Conclusión:**  
**Trazabilidad final:**
