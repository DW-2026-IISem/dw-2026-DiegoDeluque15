> **Workspace:** `movicab-lab/backend` · **Pista:** MoviCab IA (12 issues, sin auth) · **Guion:** `docs/Guion_IA_Desarrollo_Software.md` · **Metodología:** SDD+Kanban · **Arquitectura:** `docs/Prompt.md`

# ISS-03 — Feature Pasajero CA

**Naturaleza:** práctico (MoviCab backend pista IA)  
**Issue GitHub:** `movicab-backend #4`  
**Responsable (desarrollador):** Diego Armando De Luque Castillo  
**Revisor humano:**  
**Dependencias:** ISS-02 en Hecho  
**Commit esperado:** `feat(iss-03): feature pasajero CA` con `Refs #4`

---

## 1. SDD — Preparado

**OBJ:** Al finalizar, el API permitirá CRUD de Pasajeros con entidad pura y repositorio por contrato.

**SPEC:**
- Feature passengers cuatro capas.
- Tabla pasajeros.
- Endpoints /api/pasajeros.
- Seeder idempotente.

**REQ:**
- Patrón referencia.
- Sin Auth.

**AC:**
- [x] **AC-1** POST pasajero válido → 201.
- [x] **AC-2** POST sin nombre → 400.
- [x] **AC-3** GET id inexistente → 404.
- [x] **AC-4** Soft delete is_active false.

**Checklist interno (IA, En curso):**
- [x] Entidad pura
- [x] Repository
- [x] Use-cases
- [x] Controller

---

## 2. Revisión de AC

| Fecha | Revisor | Actuación | AC revisados | Evidencia | Hallazgo | Decisión |
|-------|---------|-----------|--------------|-----------|----------|----------|
| | | | OBJ, SPEC, REQ, AC | este archivo | | pendiente |

---

## 3. IA usada — En curso

### Herramienta de IA usada

**Herramienta / modelo:** Antigravity (modo agente)  
**Fecha:** 2026-09-12

### Prompt enviado

```text
Lee completo el archivo docs/Prompt.md (contrato fijo de arquitectura) y el archivo
docs/trazabilidad/ISS-03.md (objetivo, alcance, requisitos y criterios de aceptación de
este issue).

Implementa la feature completa de Pasajero en src/features/business/passengers/, con sus
4 capas (domain, application, infrastructure, presentation), siguiendo exactamente el
contrato de entidades y de HTTP de docs/Prompt.md §4-5:

- domain: entidad Pasajero (id, nombre, descripcion?, isActive, createdAt, updatedAt) sin
  ninguna dependencia de NestJS/Sequelize; interfaz IPasajeroRepository; excepción
  PasajeroNotFoundException.
- application: CreatePasajeroDto (nombre obligatorio, mínimo 2 caracteres) y
  UpdatePasajeroDto; casos de uso CreatePasajero, ListPasajeros (filtro por isActive,
  paginado), GetPasajeroById, UpdatePasajero, DeletePasajero. DeletePasajero debe
  rechazar (409) si el pasajero tiene Carreras en estado "en_curso" o "aceptada" — aunque
  la feature de Carrera no exista todavía, deja el puerto (interfaz) preparado para
  inyectar esa validación cuando exista, y documenta claramente en el código qué falta
  conectar.
- infrastructure: modelo Sequelize PasajeroModel (tabla pasajeros), agregado a
  ALL_MODELS; repositorio concreto.
- presentation: PasajerosController con GET/POST/PATCH/DELETE /api/pasajeros(/:id),
  Swagger.
- Regístralo en un BusinessModule que se importe desde AppModule.

Reglas importantes:
- NO modifiques nada dentro de docs/ ni de trazabilidad/ todavía (eso es la Parte 2).
- Usa exactamente los códigos HTTP y el envelope ya definidos en el contrato.
- No adelantes ninguna otra feature de negocio.

---

Prompts de corrección (misma sesión):

1. Swagger: se queda como está (decisión de mantenerlo aunque planeado para ISS-13).
2. Seeder: quitar de PassengersModule y eliminar pasajero.seeder.ts; siembra en ISS-13.
3. Documentar en código que StubCarreraActivaAdapter siempre retorna false; bloqueo DELETE
   no verificable hasta ISS-09 (feature Carrera).
4. Corregir referencias ISS-08 → ISS-09 en comentarios del puerto Carrera (ISS-08 es
   Tarifa, no Carrera).
```

---

### Resumen de lo que propuso la IA

Feature `passengers` con cuatro capas CA: entidad pura `Pasajero` con invariante de
nombre (mín. 2), `IPasajeroRepository`, cinco casos de uso CRUD (list paginado con
`isActive`), `PasajeroModel` en `ALL_MODELS`, repositorio y mapper de persistencia,
`PasajerosController` en `/api/pasajeros` con Swagger, puerto `ICarreraActivaPort` +
`StubCarreraActivaAdapter`, registro en `BusinessModule`/`AppModule`, y setup Swagger
global en `/api/docs`.

**Ajustes o correcciones:**
1. **Seeder eliminado:** se quitó `onModuleInit` con `seedPasajeros()` y el archivo
   `pasajero.seeder.ts`; comentario en `PassengersModule` apunta a orquestador ISS-13.
2. **Swagger mantenido:** sin cambios tras decisión del autor (planeado ISS-13).
3. **Puerto Carrera documentado:** comentarios explícitos de que el stub siempre retorna
   `false` y el 409 por carreras activas no es verificable hasta ISS-09.
4. **Numeración de issue corregida:** referencias a Carrera unificadas en ISS-08 (no
   ISS-07, que es Tarifa) en `carrera-activa.port.interface.ts`,
   `stub-carrera-activa.adapter.ts` y `delete-pasajero.use-case.ts`.

---

## 4. EVI — Verificación

| Fecha | Tipo | AC | Enlace | Cómo reproducir |
|-------|------|-----|--------|-----------------|
| 2026-09-12 | curl | AC-1 | capturas/codigo/iss-03-01-crear.png | POST pasajero válido → 201 |
| 2026-09-12 | curl | AC-2 | capturas/codigo/iss-03-02-validacion.png | POST sin nombre → 400 |
| 2026-09-12 | curl | AC-3 | capturas/codigo/iss-03-03-notfound.png | GET id inexistente → 404 |
| 2026-09-12 | curl | AC-4 | capturas/codigo/iss-03-04-softdelete.png | Soft delete, `isActive=false` |

**Commit (hash):** `aaaf892`  
**Autoevaluación AC:** Todos los AC verificados con evidencia real (ver tabla EVI).

---

## 5. Revisión humana

Preguntas guía: Explica cada capa con un archivo de Pasajero.

| Fecha | Revisor | Actuación | AC | Evidencia | Hallazgo | Decisión |
|-------|---------|-----------|-----|-----------|----------|----------|
| | | | | | | |

**Respuesta del autor:**

---

## 6. Gate

**Estado:** pendiente  
**Conclusión:**  
**Trazabilidad final:**
