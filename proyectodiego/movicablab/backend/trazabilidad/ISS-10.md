> **Workspace:** `movicab-lab/backend` · **Pista:** MoviCab IA (12 issues, sin auth) · **Guion:** `docs/Guion_IA_Desarrollo_Software.md` · **Metodología:** SDD+Kanban · **Arquitectura:** `docs/Prompt.md`

# ISS-10 — Feature Liquidación CA

**Naturaleza:** práctico (MoviCab backend pista IA)  
**Issue GitHub:** `movicab-backend #__`  
**Responsable (desarrollador):** Diego Armando De Luque Castillo  
**Revisor humano:**  
**Dependencias:** ISS-09 en Hecho  
**Commit esperado:** `feat(iss-10): feature liquidacion CA` con `Refs #__`

---

## 1. SDD — Preparado

**OBJ:** Liquidaciones agrupan carreras en transacción.

**SPEC:**
- settlements/liquidaciones.
- POST /api/liquidaciones.

**REQ:**
- Transacción obligatoria.

**AC:**
- [ ] **AC-1** POST → 201.
- [ ] **AC-2** valor = suma.
- [ ] **AC-3** excluye liquidadas.
- [ ] **AC-4** anular libera FK.

**Checklist interno (IA, En curso):**
- [ ] Transaction
- [ ] Query elegibles

---

## 2. Revisión de AC

| Fecha | Revisor | Actuación | AC revisados | Evidencia | Hallazgo | Decisión |
|-------|---------|-----------|--------------|-----------|----------|----------|
| | | | OBJ, SPEC, REQ, AC | este archivo | | pendiente |

---

## 3. IA usada — En curso

**Herramienta / modelo:** Antigravity (modo agente)  
**Fecha:** 2026-09-14  
**Prompt enviado:**

```text
Antes de implementar, actualiza docs/Prompt.md: agrega una nota debajo de la fila de
Liquidacion en la tabla de entidades que diga:

> **Nota sobre Liquidacion**: ni Prompt.md ni ISS-10.md especifican agrupar por
> conductor/empresa (solo dicen "agrupa carreras cerradas"). Se restaura el criterio de
> la especificación original del profesor: CreateLiquidacionDto recibe conductorId
> (obligatorio) + fechaDesde + fechaHasta, y solo agrupa carreras cerradas y sin liquidar
> CUYO TURNO pertenezca a ese conductor, dentro del rango de fechas. Decisión tomada en
> ISS-10, ya que agrupar sin discriminar conductor no tiene sentido de negocio real
> (¿a quién se le paga la liquidación?).

Muéstrame el diff de ese cambio antes de seguir.

Después, implementa la feature Liquidacion en src/features/business/settlements/liquidaciones/
(mismo módulo padre que Pago y Calificacion, SettlementsModule), dependiendo de los
repositorios de Carrera (ISS-08) y Turno (ISS-06, para resolver el conductorId de cada
carrera a través de su turno):

DOMAIN:
- Entidad Liquidacion (id, fecha, valor, estado, observaciones?) — SIN
  createdAt/updatedAt.
- ILiquidacionRepository; LiquidacionNotFoundException;
  SinCarrerasParaLiquidarException (409).

APPLICATION:
- CreateLiquidacionDto: conductorId (requerido), fechaDesde, fechaHasta (requeridos).
  NO incluyas valor — se calcula en servidor.
- CrearLiquidacion (use-case), DENTRO DE UNA TRANSACCIÓN SEQUELIZE:
  1. Busca todas las Carreras con estado "cerrada", liquidacionId=null, cuyo turno
     pertenezca al conductorId dado, con fechaInicio dentro del rango [fechaDesde,
     fechaHasta].
  2. Si no encuentra ninguna, lanza SinCarrerasParaLiquidarException (409) y hace
     rollback — no crea nada.
  3. Si encuentra, calcula valor = suma de Carrera.total de todas las encontradas.
  4. Crea la Liquidacion con fecha=ahora, valor calculado, estado="pendiente".
  5. Actualiza el liquidacionId de cada Carrera encontrada al id de la nueva Liquidacion.
  6. Todo esto en una sola transacción — si algo falla a mitad de camino, rollback
     completo (ninguna carrera debe quedar con liquidacionId parcialmente asignado).
- UpdateLiquidacionEstadoDto: solo permite la transición pendiente → pagada.
- AnularLiquidacion (use-case), TAMBIÉN EN TRANSACCIÓN:
  1. Verifica que la liquidación exista y no esté ya anulada.
  2. Pone estado="anulada".
  3. Libera (pone en null) el liquidacionId de todas las Carreras que tenía asignadas.
  4. Todo en una transacción.
- ListLiquidaciones (filtra por estado, rango de fechas), GetLiquidacionById (incluye
  las carreras agrupadas en la respuesta).

INFRASTRUCTURE:
- LiquidacionModel: timestamps: false; underscored: true (consistente con el resto del
  proyecto).
- Repositorio Sequelize con soporte de transacciones (usa el mismo patrón de transacción
  que ya usaste en CambiarEstadoCarreraUseCase si aplicó alguna, o el estándar de
  sequelize-typescript: sequelize.transaction(async (t) => {...})).
- CarreraModel ya tiene la columna liquidacion_id desde ISS-08 — no la vuelvas a crear,
  solo actualízala desde aquí.

PRESENTATION:
- POST /api/liquidaciones, GET /api/liquidaciones, GET /api/liquidaciones/:id,
  PATCH /api/liquidaciones/:id/estado, POST /api/liquidaciones/:id/anular.
- SIN endpoint DELETE — solo la anulación.

REGLAS IMPORTANTES:
- valor NUNCA se acepta desde el body del cliente, en ningún endpoint.
- NO modifiques nada dentro de docs/ ni de trazabilidad/ (salvo el Prompt.md del inicio,
  ya autorizado).
- NO agregues ningún seeder.
- NO hagas ningún commit sin que yo te lo pida explícitamente.
- Sigue el patrón EXACTO de sequelize-typescript que ya usa el resto del proyecto — NO
  uses @nestjs/sequelize (recuerda el error de ISS-09).
- Verifica con grep, antes de escribir cualquier comentario de "issue pendiente", que no
  hay ningún stub que dejar aquí — Liquidacion es el último issue de negocio, no debería
  necesitar ningún puerto/stub hacia una feature futura.
- Sé conciso: resume archivos y decisiones, sin reproducir código completo en el chat.
- Antes de crear archivos, dime en 3-4 líneas qué vas a crear, especialmente cómo vas a
  implementar la transacción de creación y de anulación.
```

**Ajustes o correcciones:**
1. La decisión de restaurar la agrupación por conductorId (con la nota agregada en docs/Prompt.md), ya que ni Prompt.md ni ISS-10.md especificaban agrupar por conductor/empresa originalmente.
2. La inconsistencia de tipo en "valor" (number en creación, string "45000.00" en lecturas posteriores por ser DECIMAL en MySQL); corregido con un getter Number() en el modelo Sequelize, manteniendo DECIMAL(12,2) en la base de datos.
3. Confirmación (sin cambios necesarios) de que forbidNonWhitelisted ya protege "valor" de modificaciones vía PATCH.
4. Confirmación de que doble anulación y transición inválida por PATCH (anulada vía PATCH en vez del endpoint dedicado) ya estaban correctamente bloqueadas desde la implementación inicial.

---

## 4. EVI — Verificación

**Evidencia (capturas):**
- AC-1 (crear liquidación con valor sumado → 201): `![AC-1](capturas/iss-10-01-crear.png)`
- AC-2 (GET con carreras agrupadas, valor tipo number): `![AC-2](capturas/iss-10-02-detalle.png)`
- AC-3 (segunda solicitud mismo rango → 409, excluye liquidadas): `![AC-3](capturas/iss-10-03-sin-carreras.png)`
- AC-4 (anular libera liquidacionId de las carreras): `![AC-4](capturas/iss-10-04-anular.png)`
- Extra (transición pendiente→pagada): `![Extra](capturas/iss-10-05-pagada.png)`
- Extra (inmutabilidad de valor → 400): `![Extra](capturas/iss-10-06-valor-inmutable.png)`
- Extra (doble anulación → 409): `![Extra](capturas/iss-10-07-doble-anulacion.png)`
- Extra (transición inválida por PATCH → 400): `![Extra](capturas/iss-10-08-transicion-patch.png)`

**Commit (hash):** pendiente  
**Autoevaluación AC:** pendiente

---

## 5. Revisión humana

Preguntas guía: ¿Rollback si falla?

| Fecha | Revisor | Actuación | AC | Evidencia | Hallazgo | Decisión |
|-------|---------|-----------|-----|-----------|----------|----------|
| | | | | | | |

**Respuesta del autor:**

---

## 6. Gate

**Estado:** pendiente  
**Conclusión:**  
**Trazabilidad final:**
