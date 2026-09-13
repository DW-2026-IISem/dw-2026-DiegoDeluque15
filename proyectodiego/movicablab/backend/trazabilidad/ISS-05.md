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

**Herramienta / modelo:** Antigravity (modo agente)  
**Fecha:** 2026-09-13  
**Prompt enviado:**

```text
Lee completo el archivo docs/Prompt.md (contrato fijo de arquitectura) y el archivo
docs/trazabilidad/ISS-05.md (objetivo, alcance, requisitos y criterios de aceptación de
este issue).

Implementa las features Conductor (en src/features/business/drivers/conductores/) y Vehiculo (en src/features/business/fleets/vehiculos/), dependiendo del repositorio de Empresa ya existente (ISS-04), siguiendo el mismo patrón de 4 capas que usaste para Empresa:

- domain: entidades (id, nombre, descripcion?, isActive, createdAt, updatedAt, empresaId) sin ninguna dependencia de NestJS/Sequelize; interfaces de Repositorios correspondientes; Excepciones de NotFound y EmpresaInactiveException (409). FK a Empresa opcional para Conductor y obligatoria para Vehiculo.
- application: DTOs y casos de uso CRUD. Validar que la empresa exista (404) y esté activa (409) al asociarla.
- infrastructure: Modelos con FK empresa_id (BelongsTo EmpresaModel); repositorios Sequelize.
- presentation: GET/POST/PATCH/DELETE /api/vehiculos(/:id) y /api/conductores(/:id).
- Módulos correspondientes importando EmpresasModule para inyectar su repositorio.

Nota importante sobre timestamps: a diferencia de Empresa (ISS-04, donde la tabla real
en MySQL no tenía created_at/updated_at y hubo que quitarlos del modelo), Conductor y Vehiculo SÍ
deben incluir createdAt/updatedAt. Las tablas no existen todavía en movicab_db, así
que usa timestamps: true en los Modelos (con @CreatedAt/@UpdatedAt) — Sequelize las
creará correctamente desde cero con esas columnas.

Reglas importantes:
- NO modifiques nada dentro de docs/ ni de trazabilidad/ todavía.
- NO agregues ningún seeder — la siembra queda centralizada para ISS-13.
- Donde uses un puerto/stub para validar Turnos activos (que no existen aún), deja un
  comentario indicando que ISS-06 (feature Turno) lo reemplazará — verifica ese número en
  docs/Guion_IA_Desarrollo_Software.md antes de escribir el comentario.
- No adelantes ninguna otra feature de negocio.
```

**Ajustes o correcciones:** 
- Se hicieron dos commits separados (Vehiculo y Conductor) sin que el desarrollador lo autorizara explícitamente; se revisaron ambos antes de continuar.
- Tras el segundo commit, aparecieron cambios sin commitear en toda la feature Vehiculo; se verificó con `git diff -w` que eran solo diferencias de fin de línea (CRLF/LF), sin cambios de contenido real, y se descartaron con `git restore`.

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
