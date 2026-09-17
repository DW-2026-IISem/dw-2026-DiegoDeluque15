> **Workspace:** `movicab-lab/backend` · **Pista:** MoviCab IA (12 issues, sin auth) · **Guion:** `docs/Guion_IA_Desarrollo_Software.md` · **Metodología:** SDD+Kanban · **Arquitectura:** `docs/Prompt.md`

# ISS-08 — Feature Carrera CA

**Naturaleza:** práctico (MoviCab backend pista IA)  
**Issue GitHub:** `movicab-backend #9`  
**Responsable (desarrollador):** Diego Armando De Luque Castillo  
**Revisor humano:**  
**Dependencias:** ISS-07 en Hecho  
**Commit esperado:** `feat(iss-08): feature carrera CA` con `Refs #9`

---

## 1. SDD — Preparado

**OBJ:** Carreras con total en servidor y máquina de estados.

**SPEC:**
- trips/carreras.
- POST /api/carreras, PATCH estado.

**REQ:**
- Total nunca del cliente.

**AC:**
- [x] **AC-1** POST → 201 solicitada.
- [x] **AC-2** turno inactivo → 404.
- [x] **AC-3** transición inválida → 409.
- [x] **AC-4** cerrada fija total.

**Checklist interno (IA, En curso):**
- [x] State machine
- [x] Use-cases

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
Antes de escribir una sola línea de código, lee completo docs/Prompt.md y
docs/trazabilidad/ISS-08.md, y muéstrame textualmente los campos exactos que
ISS-08.md define para la entidad Carrera, los Criterios de Aceptación completos
y si la entidad incluye o no createdAt/updatedAt.
[Confirmación del desarrollador]
Implementa la feature completa en src/features/business/trips/ dependiendo de
ISS-03 (Pasajero), ISS-06 (Turno) e ISS-07 (Tarifa):
DOMAIN: Entidad Carrera (id, pasajeroId, turnoId, tarifaId, fechaInicio, fechaFin?,
total?, estado, observaciones?, liquidacionId?) SIN timestamps. Método cambiarEstado()
dentro de la entidad con máquina de estados: solicitada→aceptada→en_curso→cerrada /
solicitada|aceptada→cancelada. Cualquier otra transición lanza EstadoInvalidoException
(409). ICarreraRepository, CarreraNotFoundException.
APPLICATION: CreateCarreraDto solo con pasajeroId y turnoId. CreateCarreraUseCase
valida Pasajero activo (404), Turno activo (404), Tarifa vigente. CambiarEstadoUseCase:
al pasar a cerrada fija fechaFin y total=tarifa.valorBase en servidor. List y GetById.
INFRASTRUCTURE: CarreraModel (timestamps:false), registrar en ALL_MODELS. Reemplazar
los stubs en PassengersModule, TurnosModule y PricingModule por adapters reales que
consultan CarreraModel. TripsModule con forwardRef donde haya circularidad.
PRESENTATION: POST /api/carreras (201), PATCH /api/carreras/:id/estado, GET lista y por
id. POST /api/despachos/:id como alias de despachar (aceptada). Sin seeders. Sin commit.
```

**Ajustes o correcciones:**
- Los 3 stubs (`StubCarreraActivaAdapter` en Pasajero y Turno,
  `StubCarreraActivaTarifaAdapter` en Tarifa) no habían sido reemplazados en el primer
  reporte; se completó el reemplazo y se eliminaron los 3 archivos stub.
- Referencia incorrecta "ISS-09" → "ISS-08" en comentarios de Pasajero; corregida.
- Confirmado que `forbidNonWhitelisted` ya rechaza `total` en el body con 400.
- Confirmada la decisión de mantener `POST /api/despachos/:id` (id en URL).

---

## 4. EVI — Verificación

| Fecha | Tipo | AC | Enlace | Cómo reproducir |
|-------|------|-----|--------|-----------------|
| 2026-09-13 | curl | AC-1 | capturas/codigo/iss-08-01-crear.png | Crear carrera válida → 201, estado: solicitada |
| 2026-09-13 | curl | AC-2 | capturas/codigo/iss-08-02-notfound.png | Turno inexistente → 404 |
| 2026-09-13 | curl | AC-3 | capturas/codigo/iss-08-03-transicion-invalida.png | Transición inválida → 409 |
| 2026-09-13 | curl | AC-4 | capturas/codigo/iss-08-04-cerrada.png | Cerrada con total calculado |

**Commit (hash):** `51bda76`  
**Autoevaluación AC:** Todos los AC verificados con evidencia real (ver tabla EVI).

---

## 5. Revisión humana

Preguntas guía: Recorre transiciones válidas.

| Fecha | Revisor | Actuación | AC | Evidencia | Hallazgo | Decisión |
|-------|---------|-----------|-----|-----------|----------|----------|
| | | | | | | |

**Respuesta del autor:**

---

## 6. Gate

**Estado:** pendiente  
**Conclusión:**  
**Trazabilidad final:**
