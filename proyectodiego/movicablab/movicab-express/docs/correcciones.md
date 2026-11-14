# Registro de Correcciones y Mantenimiento Backend (MoviCab Express)

Este documento registra los ajustes técnicos, correcciones de errores (bugfixes) y mejoras de internacionalización/usabilidad aplicadas sobre el backend **movicab-express** (Node.js, Express, Sequelize).

---

## 1. Ajuste en Consulta de Rango de Fechas para Liquidaciones (Feature Settlement)

- **Fecha:** 2026-11-11
- **Módulo afectado:** `src/features/business/settlement`
- **Archivo modificado:** `src/features/business/settlement/settlement.controller.ts`

### Descripción de la Incidencia
Al invocar `POST /api/liquidaciones` enviando un rango de fechas de un mismo día (ej. `date_from: "2026-10-21"`, `date_to: "2026-10-21"`), la API respondía con error HTTP 400:
`"Nothing to settle in that range for that driver"`
a pesar de que el conductor sí poseía carreras en estado `"cerrada"` y sin liquidar finalizadas en esa fecha.

### Causa Raíz
1. La sentencia Sequelize realizaba la comparación:
   ```ts
   ended_at: {
     [Op.gte]: new Date(date_from),
     [Op.lte]: new Date(date_to),
   }
   ```
2. Al recibir una fecha en formato `YYYY-MM-DD`, la función `new Date("YYYY-MM-DD")` la parsea en UTC como medianoche exacta (`00:00:00.000Z`).
3. En consecuencia, la condición `ended_at <= date_to` exigía que la carrera hubiese finalizado a las `00:00:00` o antes, excluyendo automáticamente cualquier viaje ocurrido durante el transcurso del día (ej. 08:30, 14:15, 20:00).

### Solución Implementada
Se actualizó `SettlementController.create()` para normalizar dinámicamente la fecha final `endDate`:
```ts
const startDate = new Date(date_from);
const endDate = new Date(date_to);

if (typeof date_to === "string" && date_to.length <= 10) {
  endDate.setUTCHours(23, 59, 59, 999);
} else if (endDate.getHours() === 0 && endDate.getMinutes() === 0 && endDate.getSeconds() === 0) {
  endDate.setHours(23, 59, 59, 999);
}
```
Esto garantiza que la consulta cubra la totalidad de la jornada hasta el último milisegundo (`23:59:59.999`), independientemente de si el cliente envía solo la fecha (`YYYY-MM-DD`) o timestamp ISO.

---

## 2. Localización de Respuestas de Error al Español

- **Fecha:** 2026-11-11
- **Módulo afectado:** `src/features/business/settlement`
- **Archivo modificado:** `src/features/business/settlement/settlement.controller.ts`

### Descripción del Cambio
Las respuestas de error HTTP de `SettlementController` se encontraban originalmente en inglés (`"Nothing to settle in that range for that driver"`, `"driver_id, date_from and date_to are required"`, `"Settlement not found"`, etc.).

Se estandarizaron todas las respuestas de error al idioma español:

| Código HTTP | Mensaje Original (EN) | Mensaje Actualizado (ES) |
|---|---|---|
| **400** | `"driver_id, date_from and date_to are required"` | `"El conductor y las fechas de inicio y fin son obligatorios"` |
| **400** | `"Nothing to settle in that range for that driver"` | `"No hay carreras cerradas pendientes para liquidar en ese rango de fechas para este conductor"` |
| **404** | `"Driver with id=... not found"` | `"Conductor con id=... no encontrado"` |
| **404** | `"Settlement not found"` | `"Liquidación no encontrada"` |
| **500** | `"Transaction failed"` | `"Error en la transacción al procesar la liquidación"` |
| **500** | `"Error fetching settlements"` | `"Error al consultar las liquidaciones"` |

