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
- [x] **AC-1** user → 201 sin hash.
- [x] **AC-2** email dup → 409.
- [x] **AC-3** role-user dup → 409.
- [x] **AC-4** sin features/auth.

**Checklist interno (IA, En curso):**
- [x] 6 modules
- [ ] Seed roles

---

## 2. Revisión de AC

| Fecha | Revisor | Actuación | AC revisados | Evidencia | Hallazgo | Decisión |
|-------|---------|-----------|--------------|-----------|----------|----------|
| | | | OBJ, SPEC, REQ, AC | este archivo | | pendiente |

---

## 3. IA usada — En curso

**Herramienta / modelo:** Antigravity (modo agente)  
**Fecha:** 2026-09-15  
**Prompt enviado:**

```text
Antes de implementar, lee completo docs/Prompt.md y trazabilidad/ISS-11.md. Confirma
explícitamente que ISS-11 es "sin auth" en tres lugares (metadata, OBJ, REQ) y que no
hay contradicción real con Prompt.md §1. Muéstrame esa confirmación en 2-3 líneas
antes de escribir código.

Implementa las 6 entidades RBAC de identidad en src/features/identity/ mediante un
script generador Node.js con configuración declarativa por entidad. El script debe
generar de forma consistente el patrón 4 capas para: users, roles, role-users,
resources, resource-roles, refresh-tokens.

CONFIGURACIÓN DECLARATIVA (array ENTITIES):
- Unicidad simple → 409 si duplicado: User.email, Role.nombre, Resource.nombre
- Unicidad compuesta → 409 si duplicado: RoleUser (userId+roleId),
  ResourceRole (resourceId+roleId)

Por cada entidad, según Prompt.md §4.2:

USER (users/):
- domain: User (id, email, passwordHash, isActive) pura; IUserRepository;
  UserNotFoundException; UserAlreadyExistsException (email duplicado → 409)
- application: CreateUserDto (email, passwordHash, isActive); CRUD use-cases;
  UserMapper.toDto OMITIENDO passwordHash en toda respuesta
- infrastructure: UserModel (timestamps: false); repositorio con findByEmail
- presentation: CRUD GET/POST/PATCH/DELETE (controller retorna dato plano, sin envelope)

ROLE (roles/):
- domain: Role (id, nombre, isActive); IRoleRepository; findByNombre; 409 si duplicado
- application: CRUD; seeder catálogo: ADMIN, DESPACHO, CONDUCTOR, FINANZAS, SOPORTE
- infrastructure: RoleModel; repositorio Sequelize
- presentation: CRUD /roles

ROLE-USER (role-users/):
- domain: RoleUser (id, userId, roleId, isActive); unicidad compuesta (userId, roleId)
- application: CreateRoleUserDto; CRUD; 409 si par duplicado
- infrastructure: RoleUserModel; findByUserIdAndRoleId
- presentation: CRUD /role-users

RESOURCE (resources/):
- domain: Resource (id, nombre, isActive); unicidad en nombre
- application/infrastructure/presentation: mismo patrón CRUD /resources

RESOURCE-ROLE (resource-roles/):
- domain: ResourceRole (id, resourceId, roleId, isActive); unicidad compuesta
- application/infrastructure/presentation: CRUD /resource-roles

REFRESH-TOKEN (refresh-tokens/):
- domain: RefreshToken (id, userId, tokenHash, expiresAt, revoked)
- application: mapper omite tokenHash en respuesta (solo persistencia)
- infrastructure/presentation: CRUD /refresh-tokens

SCRIPT GENERADOR:
- Escribe scripts/generate-identity-modules.js que lea ENTITIES[] (name, table, fields,
  uniqueSimple[], uniqueComposite[][]) y genere domain/application/infrastructure/
  presentation + *.module.ts por entidad
- Ejecuta el script para materializar los 6 módulos
- Registra los 6 modelos en src/infrastructure/database/sequelize/all-models.ts
- Registra IdentityModule (importando los 6 submodules) en AppModule

REGLAS TRANSVERSALES:
- PROHIBIDO: login, JWT, guards, bcrypt, @nestjs/jwt, passport, features/auth/
- NO modifiques docs/ ni trazabilidad/
- NO commits sin pedido explícito
- Sigue el patrón 4 capas de Pasajero/Trips (entidad de dominio pura, sin extends Model)
- Sé conciso: resume archivos y decisiones, sin reproducir código completo en el chat
```

**Ajustes o correcciones:**
1. Confirmación previa del alcance: ISS-11.md confirma explícitamente "sin auth" en tres lugares distintos (metadata, OBJ, REQ), sin contradicción real con Prompt.md §1.
2. Se usó un script generador Node para crear los 6 módulos de forma consistente (diferenciando unicidad simple vs. compuesta según configuración declarativa).
3. El script generador usaba `@nestjs/sequelize` (paquete no instalado) en los 6 repositorios y módulos — el MISMO error de ISS-09, reintroducido a mayor escala (54 errores de build). Se corrigió el script para usar el patrón `sequelize-typescript` consistente del resto del proyecto, y se regeneraron los 6 módulos desde cero.
4. Los 6 controllers generados duplicaban el envelope de respuesta manualmente — el MISMO bug de ISS-09. Corregido para retornar datos planos.
5. Los IDs se generaron como UUID (con el paquete `uuid`) en vez de INTEGER autoincremental, inconsistente con las 10 entidades de negocio ya existentes. Corregido a INTEGER + AutoIncrement, ajustando también los tipos de FK.
6. El script tenía una inconsistencia de nomenclatura entre `plural.toLowerCase()` (sin guiones) y kebab (con guiones) para nombrar archivos, causando imports rotos. Unificado a kebab en todo el script.
7. Se detectó que un reporte inicial de la IA minimizaba el trabajo real realizado ("ya usaban sequelize-typescript, no requirieron cambios"), contradiciendo el propio código fuente del script compartido previamente; se le pidió corregir esa inexactitud antes de aceptar la documentación.

---

## 4. EVI — Verificación

**Evidencia (capturas):**
- AC-1 (user creado sin passwordHash en respuesta → 201): `![AC-1](capturas/iss-11-01-user-crear.png)`
- AC-2 (email duplicado → 409): `![AC-2](capturas/iss-11-02-email-duplicado.png)`
- AC-3 (role-user duplicado → 409): `![AC-3](capturas/iss-11-03-roleuser-duplicado.png)`
- AC-4 (sin features/auth, find vacío): `![AC-4](capturas/iss-11-04-sin-auth.png)`

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
