> **Workspace:** `movicab-lab/backend` · **Pista:** MoviCab IA (12 issues, sin auth) · **Guion:** `docs/Guion_IA_Desarrollo_Software.md` · **Metodología:** SDD+Kanban · **Arquitectura:** `docs/Prompt.md`

# ISS-02 — Entorno Sequelize y common

**Naturaleza:** práctico (MoviCab backend pista IA)  
**Issue GitHub:** `movicab-backend #__`  
**Responsable (desarrollador):** Diego Armando De Luque Castillo  
**Revisor humano:**  
**Dependencias:** ISS-01 en Hecho  
**Commit esperado:** `feat(iss-02): entorno Sequelize y common` con `Refs #__`

---

## 1. SDD — Preparado

**OBJ:** Al finalizar, la app validará .env y se conectará a movicab_db con filtro de excepciones e interceptores.

**SPEC:**
- src/config/environment/ fail-fast.
- Sequelize multi-motor, ALL_MODELS=[], sync alter false.
- Excepciones y GlobalExceptionFilter.
- Interceptors logging, timeout, response.
- .env.example; BD movicab_db.

**REQ:**
- Nunca force/alter true.
- Sin modelos negocio ni Auth.
- .env no se commitea.

**AC:**
- [ ] **AC-1** Con .env mysql completo; cuando start:dev; entonces conexión OK.
- [ ] **AC-2** Sin variable crítica; cuando arranca; entonces Error de configuración antes de conectar.
- [ ] **AC-3** Única sync es alter false.
- [ ] **AC-4** .env.example completo; .env no en git status.

**Checklist interno (IA, En curso):**
- [ ] Env
- [ ] Sequelize factory
- [ ] Common
- [ ] .env.example

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
(pendiente — copiar de docs/Guion_IA_Desarrollo_Software.md ISS-02)
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

Preguntas guía: ¿Por qué envConfig.KEY y no ConfigService?

| Fecha | Revisor | Actuación | AC | Evidencia | Hallazgo | Decisión |
|-------|---------|-----------|-----|-----------|----------|----------|
| | | | | | | |

**Respuesta del autor:**

---

## 6. Gate

**Estado:** pendiente  
**Conclusión:**  
**Trazabilidad final:**
