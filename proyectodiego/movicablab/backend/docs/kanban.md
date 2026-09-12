# Kanban — MoviCab Backend (pista IA)

**Repositorio:** `movicab-lab/backend` (GitHub)  
**Project:** `SDD Kanban — MoviCab Backend IA`  
**Metodología:** SDD + Kanban · WIP = 1  
**Guion:** `docs/Guion_IA_Desarrollo_Software.md`

---

## Columnas (campo Status del Project)

```text
Preparado → En curso → Verificación → Revisión humana → Hecho
```

**Label adicional:** `Bloqueado` (rojo) — no es columna.

---

## Definition of Ready (DoR)

Un issue puede pasar a **En curso** cuando:

- [ ] §1 SDD completo (OBJ, SPEC, REQ, AC)
- [ ] §2 con decisión `AC aprobados — puede En curso` (revisor)
- [ ] Issue anterior en **Hecho** con Gate aprobado
- [ ] Cabecera de `trazabilidad/ISS-XX.md` con número GitHub y responsable

---

## Definition of Done (DoD)

Un issue puede pasar a **Hecho** cuando:

- [ ] §3 prompt pegado tal cual
- [ ] §4 EVI con hash de commit y autoevaluación AC
- [ ] §5 revisión humana con decisión conforme o aporte
- [ ] §6 Gate = `aprobado` o `aprobado con observación` (revisor)
- [ ] Commit en remoto con `Refs #n`

---

## Mapa de issues (12 issues · 16 entidades sin auth)

| Issue | Título | Entidades / alcance | Dependencia | Trazabilidad |
|---|---|---|---|---|
| #01 | Esqueleto NestJS CA arrancable | Árbol CA, health | — | `trazabilidad/ISS-01.md` |
| #02 | Entorno Sequelize y common | Config, BD multi-motor, excepciones | #01 Hecho | `trazabilidad/ISS-02.md` |
| #03 | Feature Pasajero CA | Pasajero | #02 Hecho | `trazabilidad/ISS-03.md` |
| #04 | Feature Empresa CA | Empresa (NIT único) | #03 Hecho | `trazabilidad/ISS-04.md` |
| #05 | Features Conductor y Vehículo CA | Conductor, Vehículo (FK Empresa) | #04 Hecho | `trazabilidad/ISS-05.md` |
| #06 | Feature Turno CA | Turno (FK Conductor + Vehículo) | #05 Hecho | `trazabilidad/ISS-06.md` |
| #07 | Feature Tarifa CA | Tarifa (vigencias) | #06 Hecho | `trazabilidad/ISS-07.md` |
| #08 | Feature Carrera CA | Carrera (máquina de estados, total servidor) | #07 Hecho | `trazabilidad/ISS-08.md` |
| #09 | Features Pago y Calificación CA | Pago, Calificación | #08 Hecho | `trazabilidad/ISS-09.md` |
| #10 | Feature Liquidación CA | Liquidación (agrupa carreras, transacción) | #09 Hecho | `trazabilidad/ISS-10.md` |
| #11 | Entidades identidad/RBAC (datos) | User, Role, RoleUser, Resource, ResourceRole, RefreshToken | #10 Hecho | `trazabilidad/ISS-11.md` |
| #12 | Integración, seeders y demo | Orquestador, Swagger, README, libreto demo | #11 Hecho | `trazabilidad/ISS-12.md` |

> **Fuera de alcance pista IA:** login, JWT, guards, bcrypt, `@nestjs/jwt`, `passport`. Las entidades RBAC son solo CRUD de datos.

---

## Matriz de trazabilidad Semana 04 (documentación)

| OBJ | REQ | Issue doc | Evidencia |
|---|---|---|---|
| OBJ-S04 | REQ-S04-01 | docs/sdd.md §1 | Problema y actores |
| OBJ-S04 | REQ-S04-02 | docs/sdd.md §2 | Diagrama ER |
| OBJ-S04 | REQ-S04-03 | docs/sdd.md §3, §6 | Arquitectura capas |
| OBJ-S04 | REQ-S04-04 | docs/sdd.md §7 | Contratos API |
| OBJ-S04 | REQ-S04-05 | ISS-01…02 | Health, Sequelize, Swagger |
| OBJ-S04 | REQ-S04-06 | Este archivo + docs/proceso.md | Kanban y bitácora |

---

## Configuración GitHub Project (una vez)

1. Repo → **Projects** → **New project** → **Board**
2. Nombre: `SDD Kanban — MoviCab Backend IA`
3. Campo **Status**: `Preparado`, `En curso`, `Verificación`, `Revisión humana`, `Hecho`
4. Vista Board → Group by **Status**
5. Label `Bloqueado` (rojo)
6. Crear **solo ISS-01** al inicio; los demás cuando el anterior esté en Hecho

---

## Quién mueve cada tarjeta

| Transición | Responsable |
|---|---|
| Preparado → En curso | Desarrollador (tras §2 aprobado) |
| En curso → Verificación | Desarrollador |
| Verificación → Revisión humana | Desarrollador (EVI + push) |
| Revisión humana → Hecho | **Revisor** (Gate §6) |
| Revisión humana → En curso | **Revisor** (devolución) |
| IA | **No mueve nada** |
