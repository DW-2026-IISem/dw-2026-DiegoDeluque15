> **Workspace:** `movicab-lab/backend` · **Pista:** MoviCab IA (12 issues, sin auth) · **Guion:** `docs/Guion_IA_Desarrollo_Software.md` · **Metodología:** SDD+Kanban · **Arquitectura:** `docs/Prompt.md`

# ISS-04 — Feature Empresa CA

**Naturaleza:** práctico (MoviCab backend pista IA)  
**Issue GitHub:** `movicab-backend #5`  
**Responsable (desarrollador):** Diego Armando De Luque Castillo  
**Revisor humano:**  
**Dependencias:** ISS-03 en Hecho  
**Commit esperado:** `feat(iss-04): feature empresa CA` con `Refs #5`

---

## 1. SDD — Preparado

**OBJ:** Al finalizar, Empresas se gestionarán con NIT único.

**SPEC:**
- Feature fleets/empresas.
- nit UQ, razon_social, contacto_principal.
- /api/empresas.

**REQ:**
- NIT inmutable tras crear.

**AC:**
- [x] **AC-1** POST válido → 201.
- [x] **AC-2** NIT duplicado → 409.
- [x] **AC-3** GET list con conteos.
- [ ] **AC-4** DELETE con activos → 409.

**Checklist interno (IA, En curso):**
- [x] Entity
- [x] Validación NIT
- [ ] Seeder

---

## 2. Revisión de AC

| Fecha | Revisor | Actuación | AC revisados | Evidencia | Hallazgo | Decisión |
|-------|---------|-----------|--------------|-----------|----------|----------|
| | | | OBJ, SPEC, REQ, AC | este archivo | | pendiente |

---

## 3. IA usada — En curso

**Herramienta / modelo:** Antigravity (modo agente)  
**Fecha:** 2026-09-12  
**Prompt enviado:**

```text
Lee completo el archivo docs/Prompt.md (contrato fijo de arquitectura) y el archivo
docs/trazabilidad/ISS-04.md (objetivo, alcance, requisitos y criterios de aceptación de
este issue).

Implementa la feature Empresa en src/features/business/fleets/empresas/, siguiendo
exactamente el mismo patrón de 4 capas que usaste para Pasajero en ISS-03:

- domain: entidad Empresa (id, nit, razonSocial, contactoPrincipal, isActive) sin ninguna
  dependencia de NestJS/Sequelize; interfaz IEmpresaRepository; EmpresaNotFoundException;
  EmpresaNitAlreadyExistsException.
- application: CreateEmpresaDto (nit requerido, razonSocial requerida, contactoPrincipal
  validado como email O como teléfono); casos de uso CreateEmpresa (valida nit único —
  409 si duplicado), ListEmpresas (incluye conteo de Conductores/Vehículos asociados —
  usa el mismo patrón de puerto/stub que usaste para Carrera en ISS-03, ya que esas
  features no existen todavía), GetEmpresaById, UpdateEmpresa (nit inmutable tras
  creación: ignora el campo si viene en el body), DeleteEmpresa (soft delete; 409 si
  tiene Conductores o Vehículos activos asociados — también vía puerto/stub).
- infrastructure: EmpresaModel con índice único en nit; repositorio Sequelize.
- presentation: GET/POST/PATCH/DELETE /api/empresas(/:id); Swagger (ya está configurado
  globalmente desde ISS-03, solo documenta este controller).
- Regístralo en un EmpresasModule dentro de un módulo fleets, importado desde
  BusinessModule.
```

**Ajustes o correcciones:**
1. Se corrigió un error inicial en los comentarios de los stubs que apuntaban a "ISS-05
   (feature Conductor + Vehículo)". Se corrigieron para referenciar ISS-05 (Vehículo) e
   ISS-06 (Conductor) según el guion oficial.
2. Se eliminó la validación `@MinLength(3)` del campo NIT en DTO y Entidad, ya que el
   contrato solo pedía obligatoriedad y unicidad, no longitud mínima.
3. Se quitaron los timestamps (createdAt/updatedAt) del modelo EmpresaModel: la
   tabla `empresas` en movicab_db fue creada sin esas columnas, y docs/sdd.md §2.1
   tampoco las define para Empresa (a diferencia de Pasajero). El modelo tenía
   timestamps: true por defecto, causando un error 500 en cualquier consulta porque
   Sequelize intentaba seleccionar columnas inexistentes. Se corrigió a
   timestamps: false y se eliminaron los campos createdAt/updatedAt de las 4 capas
   (modelo, entidad de dominio, mapper de aplicación y mapper de persistencia).

---
---

## 4. EVI — Verificación

| Fecha | Tipo | AC | Enlace | Cómo reproducir |
|-------|------|-----|--------|-----------------|
| 2026-09-12 | curl | AC-1 | capturas/iss-04-01-crear.png | POST válido → 201 |
| 2026-09-12 | curl | AC-2 | capturas/iss-04-02-nit-duplicado.png | NIT duplicado → 409 |
| 2026-09-12 | curl | AC-3 | capturas/iss-04-03-listado.png | GET list con conteos |
| 2026-09-12 | curl | AC-4 | capturas/iss-04-04-delete-pendiente.png | DELETE con activos → 409 (pendiente hasta ISS-05/ISS-06) |

**Commit (hash):** `bee73ed`  
**Autoevaluación AC:** AC-1 a AC-3 verificados con evidencia real (ver tabla EVI). AC-4 sin marcar en §1: captura documenta estado pendiente hasta ISS-05/ISS-06, no verificación completa del criterio.

**Evidencia (capturas):**
- AC-1 (POST válido → 201): `![AC-1](capturas/iss-04-01-crear.png)`
- AC-2 (NIT duplicado → 409): `![AC-2](capturas/iss-04-02-nit-duplicado.png)`
- AC-3 (GET list con conteos): `![AC-3](capturas/iss-04-03-listado.png)`
- AC-4 (DELETE con activos → 409, pendiente hasta ISS-05/ISS-06): `![AC-4](capturas/iss-04-04-delete-pendiente.png)`

---


## 5. Revisión humana

Preguntas guía: Compara con passengers/.

| Fecha | Revisor | Actuación | AC | Evidencia | Hallazgo | Decisión |
|-------|---------|-----------|-----|-----------|----------|----------|
| | | | | | | |

**Respuesta del autor:**

---

## 6. Gate

**Estado:** pendiente  
**Conclusión:**  
**Trazabilidad final:**
