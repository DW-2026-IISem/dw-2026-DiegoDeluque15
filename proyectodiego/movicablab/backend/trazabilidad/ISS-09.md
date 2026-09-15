> **Workspace:** `movicab-lab/backend` · **Pista:** MoviCab IA (12 issues, sin auth) · **Guion:** `docs/Guion_IA_Desarrollo_Software.md` · **Metodología:** SDD+Kanban · **Arquitectura:** `docs/Prompt.md`

# ISS-09 — Features Pago y Calificación CA

**Naturaleza:** práctico (MoviCab backend pista IA)  
**Issue GitHub:** `movicab-backend #__`  
**Responsable (desarrollador):** Diego Armando De Luque Castillo  
**Revisor humano:**  
**Dependencias:** ISS-08 en Hecho  
**Commit esperado:** `feat(iss-09): features pago y calificacion CA` con `Refs #__`

---

## 1. SDD — Preparado

**OBJ:** Pagos y Calificaciones post-carrera cerrada.

**SPEC:**
- settlements/pagos y calificaciones.

**REQ:**
- Pagos inmutables.

**AC:**
- [ ] **AC-1** pago OK → 201.
- [ ] **AC-2** monto incorrecto → 409.
- [ ] **AC-3** calificación duplicada → 409.
- [ ] **AC-4** carrera no cerrada → 409.

**Checklist interno (IA, En curso):**
- [ ] Pago
- [ ] Calificación

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
Implementa las features Pago y Calificacion en src/features/business/settlements/,
dependiendo del repositorio de Carrera ya existente (ISS-08):

═══════════════════════════════════════
FEATURE PAGO (src/features/business/settlements/pagos/)
═══════════════════════════════════════

DOMAIN:
- Entidad Pago (id, referenciaTipo, referenciaId, metodo, monto, fecha, estado) — SIN
  createdAt/updatedAt.
- IPagoRepository; PagoNotFoundException; CarreraNoCerradaException (409);
  MontoInvalidoException (409).

APPLICATION:
- CreatePagoDto: referenciaId (id de la Carrera) y metodo requeridos. NO incluyas monto
  — el cliente nunca lo envía.
- CrearPago (use-case): valida que la Carrera exista (404) y esté "cerrada" (409 si no);
  toma monto = Carrera.total automáticamente; referenciaTipo = "carrera" fijo;
  estado inicial = "pendiente" (o el que definas, documenta tu elección).
- UpdatePagoEstadoDto: solo el campo estado. Ignora (o rechaza vía whitelist) monto y
  referenciaId si vienen en el body de un PATCH.
- ListPagos, GetPagoById.

INFRASTRUCTURE:
- PagoModel: timestamps: false; FK referencia_id → tabla carreras (sin BelongsTo activo
  necesariamente, ya que referenciaTipo es polimórfico en el contrato general, pero en
  este alcance solo existe "carrera").
- Repositorio Sequelize.

PRESENTATION:
- GET/POST/PATCH(solo estado) /api/pagos(/:id) — SIN endpoint DELETE, Pago es inmutable.

═══════════════════════════════════════
FEATURE CALIFICACION (src/features/business/settlements/calificaciones/)
═══════════════════════════════════════

DOMAIN:
- Entidad Calificacion (id, carreraId, puntaje, comentario?, isActive) — SIN
  createdAt/updatedAt (confirma esto también en el resto de la definición de entidades
  antes de asumirlo).
- ICalificacionRepository; CalificacionNotFoundException; CarreraNoCerradaException
  (409); CalificacionYaExisteException (409).

APPLICATION:
- CreateCalificacionDto: carreraId requerido, puntaje entero 1-5 requerido, comentario
  opcional.
- CrearCalificacion (use-case): valida que la Carrera exista (404) y esté "cerrada" (409
  si no); valida que no exista ya una calificación para esa carrera (409 si ya existe).
- UpdateCalificacionDto: puntaje y/o comentario.
- ListCalificaciones, GetCalificacionById.
- DeleteCalificacion: soft delete.

INFRASTRUCTURE:
- CalificacionModel: timestamps: false; índice único en carrera_id (para reforzar la
  unicidad 0..1:1 a nivel de base de datos, no solo de aplicación).
- Repositorio Sequelize.

PRESENTATION:
- GET/POST/PATCH/DELETE /api/calificaciones(/:id).

═══════════════════════════════════════
REGLAS TRANSVERSALES
═══════════════════════════════════════
- NO modifiques nada dentro de docs/ ni de trazabilidad/ todavía.
- NO agregues ningún seeder.
- NO hagas ningún commit sin que yo te lo pida explícitamente.
- Registra ambos módulos (PagosModule, CalificacionesModule) dentro de un
  SettlementsModule, importado desde BusinessModule.
- Sé conciso: resume archivos y decisiones, sin reproducir código completo en el chat.
- Antes de crear archivos, dime en 3-4 líneas qué vas a crear.
```

**Ajustes o correcciones:**
1. Confirmación de campos semánticos de Calificación y documentación en Prompt.md.
2. Cambio de patrón @nestjs/sequelize a sequelize-typescript consistente.
3. Fix de índice único de Calificación (ER_KEY_COLUMN_DOES_NOT_EXITS) con underscored: true.
4. Eliminación de envelope duplicado en respuestas de los controladores.
5. Ajuste de ruta PATCH a /api/pagos/:id/estado (faltaba el sufijo).
6. Modificación de PATCH (Pago/Calificacion) para devolver entidad completa actualizada (no null).

---

## 4. EVI — Verificación

**Evidencia (capturas):**
- AC-1 (pago creado con monto automático → 201): `![AC-1](capturas/iss-09-01-pago-crear.png)`
- AC-2/interpretación (pago sobre carrera no cerrada → 409): `![AC-2](capturas/iss-09-02-pago-no-cerrada.png)`
- AC-3 (calificación duplicada → 409): `![AC-3](capturas/iss-09-03-calificacion-duplicada.png)`
- AC-4 (calificación sobre carrera no cerrada → 409): `![AC-4](capturas/iss-09-04-calificacion-no-cerrada.png)`
- Extra (validación de rango de puntaje → 400): `![Extra](capturas/iss-09-05-puntaje-rango.png)`
**Commit (hash):** pendiente  
**Autoevaluación AC:** pendiente

---

## 5. Revisión humana

Preguntas guía: ¿Por qué Pago es inmutable?

| Fecha | Revisor | Actuación | AC | Evidencia | Hallazgo | Decisión |
|-------|---------|-----------|-----|-----------|----------|----------|
| | | | | | | |

**Respuesta del autor:**

---

## 6. Gate

**Estado:** pendiente  
**Conclusión:**  
**Trazabilidad final:**
