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

### Herramienta de IA usada

**Herramienta / modelo:** Antigravity (modo agente)  
**Fecha:** 2026-09-12

### Prompt enviado

```text
Lee completo el archivo docs/Prompt.md (contrato fijo de arquitectura) y el archivo
docs/trazabilidad/ISS-02.md (objetivo, alcance, requisitos y criterios de aceptación de
este issue).

Implementa exactamente lo que pide ISS-02 sobre el esqueleto ya existente:

- Validación de entorno (src/config/environment) que falle al arrancar, ANTES de intentar
  conectar a la base de datos, si falta una variable del bloque DB_<MOTOR>_* activo según
  DB_DIALECT (mysql|postgres|mssql|oracle) — indicando en el mensaje cuál variable falta.
- Una factory de Sequelize (src/infrastructure/database/sequelize) que instancie el
  dialecto correcto leyendo solo el bloque de env correspondiente, con
  sync({ alter: false }) y un arreglo ALL_MODELS vacío por ahora.
- La jerarquía de excepciones común (ApplicationException, EntityNotFoundException 404,
  DomainException 400, BusinessRuleException 409) en src/common/exceptions.
- Un filtro global de excepciones que devuelva errores como { statusCode, message, error }.
- Un interceptor global de respuesta exitosa que envuelva en { statusCode, message, data,
  timestamp }, y que soporte listados paginados como data.items[] + data.meta.
- Actualiza .env.example con el contrato de la sección 6 de docs/Prompt.md (los 4 bloques
  de motor, con los puertos ya remapeados de este proyecto: MySQL 3307, PostgreSQL 5435,
  SQL Server 1434, Oracle 1522).

Reglas importantes:
- NO modifiques nada dentro de docs/ ni de trazabilidad/.
- NO agregues todavía ninguna entidad de negocio (eso es ISS-03 en adelante).
- sync() debe ser SIEMPRE sync({ alter: false }) — nunca force:true ni alter:true en
  ningún archivo.

---

Prompt de corrección (misma sesión):

Muéstrame el validador de src/config/environment/environment.validation.ts para
DB_MYSQL_PASSWORD (y su equivalente en los otros 3 bloques de motor). Confirma si permite
explícitamente un string vacío, o si requiere @IsNotEmpty(). Si requiere no-vacío,
corrígelo para que solo valide que la variable EXISTA (aunque su valor sea ""), ya que
mi entorno de MySQL local corre sin contraseña, tal como ya lo define .env.example.
```

---

### Resumen de lo que propuso la IA

Validación fail-fast en `src/config/environment/` según `DB_DIALECT`, ejecutada en
`main.ts` antes del bootstrap de Nest. Factory Sequelize multi-motor con
`sequelize-typescript`, `ALL_MODELS=[]` y `DatabaseModule` que llama
`sync({ alter: false })`. Capa `common` con excepciones tipadas, `GlobalExceptionFilter`,
interceptores de logging, timeout (30 s) y response (envelope de éxito con soporte
paginado). Instalación de drivers (`mysql2`, `pg`, `pg-hstore`, `tedious`, `oracledb`).
`.env.example` actualizado con cuatro bloques de motor y puertos remapeados. Tras revisión,
se corrigió el validador: las variables `*_PASSWORD` aceptan valor vacío si la clave
existe; el resto del bloque activo sigue exigiendo no-vacío.

**Ajustes o correcciones:**
1. `environment.validation.ts` y `environment.config.ts`: las variables `*_PASSWORD` de
   los cuatro motores solo exigen presencia de clave (`undefined` falla; `""` es válido).
   Antes, `value.trim() === ''` rechazaba MySQL sin contraseña.
2. Se añadió `readExistingEnv()` para leer contraseñas sin exigir contenido; las demás
   variables siguen usando `readRequiredEnv()`.

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
