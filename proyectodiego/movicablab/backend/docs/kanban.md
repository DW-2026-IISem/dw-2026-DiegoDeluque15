# Kanban — MoviCab (Semana 04)

Política: WIP = 1. "Bloqueado" es un indicador sobre la tarjeta, no una columna.

| Issue | Descripción | REQ | DoR (entrada) | DoD (salida) | Columna |
|---|---|---|---|---|---|
| #01 | Documentar problema, actores y requisitos del dominio | REQ-S04-01 | Proyecto asignado (S01) | docs/sdd.md con dominio | Aceptada/Evidenciada |
| #02 | Modelar dominio: entidades, relaciones y agregado | REQ-S04-02 | #01 | Diagrama de dominio | Aceptada/Evidenciada |
| #03 | Definir arquitectura por capas | REQ-S04-03 | #02 | Diagrama de arquitectura | Aceptada/Evidenciada |
| #04 | Definir contratos (DTO/API) | REQ-S04-04 | #02 | Contratos documentados | Aceptada/Evidenciada |
| #05 | Crear base del backend NestJS | REQ-S04-05 | Node LTS (S03) | Backend arranca + /api/health | Aceptada/Evidenciada |
| #06 | Actualizar docs/sdd.md y docs/kanban.md | REQ-S04-06 | #01-#05 | SDD + Kanban trazables | Aceptada/Evidenciada |
| #07 | Implementar CRUD completo de Pasajero (dominio, aplicación, infraestructura, presentación) | REQ-S04-05 | #05, #06 | Migracion y arranque del modulo evidenciados; POST verificado con id 1 | Aceptada/Evidenciada |
