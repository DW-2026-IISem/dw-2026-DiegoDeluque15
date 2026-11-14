# Registro de Correcciones y Ajustes

Este documento registra los ajustes puntuales, correcciones de errores (bugfixes) y mantenimientos realizados sobre el frontend de **MoviCab Express**.

---

## 1. Visualización de Fecha en el Módulo de Calificaciones

- **Fecha:** 2026-11-11
- **Módulo afectado:** Operación &rarr; Calificaciones (`/ratings`)
- **Archivos modificados:**
  - `src/app/features/ratings/rating-list.html`
  - `docs/proceso.md`

### Descripción del Problema
Al ingresar a la vista de Calificaciones (`/ratings`), la columna "Fecha" de la tabla (`p-table`) aparecía completamente vacía para todos los registros, a pesar de que las calificaciones contaban con fecha y hora de creación registradas en el backend y la base de datos.

### Diagnóstico / Causa Raíz
1. El backend de Node.js / Express (`movicab-express`) utiliza Sequelize con la opción `timestamps: true` por defecto en el modelo `Rating` (`rating.model.ts`). Al serializar las entidades a JSON en `GET /api/calificaciones`, los campos de tiempo se exportan como `createdAt` y `updatedAt` (camelCase).
2. En la plantilla `src/app/features/ratings/rating-list.html`, la celda de fecha estaba vinculada estrictamente a `rating.created_at`:
   ```html
   <td>{{ rating.created_at | date:'dd/MM/yyyy HH:mm' }}</td>
   ```
3. Dado que `created_at` no existía en el payload devuelto por el backend (`undefined`), el pipe `date` no procesaba ningún valor y la celda se mostraba en blanco.

### Solución Implementada
Se actualizó el enlace del template en `rating-list.html` para soportar tanto `createdAt` (camelCase de Sequelize) como `created_at` (snake_case estándar de APIs REST), agregando además un caracter de respaldo (`—`) en caso de no existir valor:

```html
<td>{{ ((rating.createdAt || rating.created_at) | date:'dd/MM/yyyy HH:mm') || '—' }}</td>
```

Este patrón mantiene total coherencia con la implementación previa en el componente de detalle de carreras (`src/app/features/trips/trip-detail.html:181`):
```html
<span>{{ (rating()!.createdAt || rating()!.created_at) | date:'dd/MM/yyyy HH:mm' }}</span>
```

### Validación
- El modelo TypeScript `Rating` extiende la interfaz `Timestamps` (`src/app/core/models/api.model.ts`), la cual declara válidos tanto `createdAt?: string` como `created_at?: string`.
- La expresión evalúa prioritariamente la propiedad presente en la respuesta del backend y formatea la fecha y hora (`dd/MM/yyyy HH:mm`) correctamente en la tabla.


---

## 2. Priorización y Visualización de Conductores Habilitados para Liquidación

- **Fecha:** 2026-11-11
- **Módulo afectado:** Operación &rarr; Liquidaciones (`/settlements` y `/settlements/new`)
- **Archivos modificados:**
  - `src/app/features/settlements/settlement-list.ts`
  - `src/app/features/settlements/settlement-list.html`
  - `src/app/features/settlements/settlement-form.ts`
  - `src/app/features/settlements/settlement-form.html`
  - `docs/proceso.md`

### Descripción del Problema / Necesidad
En el apartado de Liquidaciones (`/settlements`), la interfaz solo presentaba el histórico de liquidaciones formalizadas con anterioridad. Para generar una liquidación, el operador debía navegar al formulario y seleccionar un conductor de una lista desordenada sin saber previamente si el conductor tenía viajes finalizados pendientes de cobro o si estaba activo.
Si se seleccionaba un conductor sin viajes finalizados en el rango, el backend rechazaba la transacción con error HTTP 400 (`Nothing to settle in that range for that driver`).

### Criterio de Habilitación
Un conductor se considera **Habilitado para liquidación** cuando:
1. Su estado en el sistema es `active`.
2. Cuenta con al menos una carrera con estado `cerrada` y sin liquidar (`settlement_id === null`), vinculada a través de sus turnos de trabajo (`shifts`).

Si no cumple alguna de las condiciones, se cataloga como **No habilitado** indicando el motivo correspondiente (*"Sin carreras cerradas pendientes"* o *"Conductor inactivo"*).

### Solución Implementada
1. **Listado Principal (`settlement-list`):**
   - Se añadió en la parte superior el panel de **Disponibilidad de Conductores para Liquidación** antes del historial de liquidaciones.
   - Se procesan concurrentemente mediante `forkJoin` los servicios de `SettlementApi`, `DriverApi`, `TripApi` y `ShiftApi`.
   - **Orden prioritario:** Se presentan **primero los conductores habilitados** (ordenados por mayor monto acumulado) y después los **no habilitados**.
   - Se incluyeron filtros con contadores interactivos: `Todos`, `Habilitados` y `No Habilitados`.
   - En cada conductor habilitado se muestra el número de carreras pendientes, el monto acumulado estimado, el rango sugerido de fechas y un botón directo **«Liquidar»**.
2. **Formulario de Generación (`settlement-form`):**
   - El selector `p-select` muestra a los conductores priorizados (habilitados primero con badge verde de carreras y monto).
   - Soporte para parámetros de ruta (`queryParams: driver_id, date_from, date_to`) para transferir los datos del conductor seleccionado en un clic desde la tabla.
   - Banner reactivo en el formulario que confirma al operador si el conductor seleccionado está habilitado (mostrando saldo y carreras) o emite una advertencia si no tiene carreras pendientes.

### Validación
- Compilación de tipos TypeScript validada con `tsc --noEmit` exitosa con código de salida 0.

---

## 3. Corrección de Rango de Fechas y Localización de Mensajes de Error en Liquidaciones

- **Fecha:** 2026-11-11
- **Módulo afectado:** Operación &rarr; Liquidaciones (`/settlements/new`) y Backend (`movicab-express`)
- **Archivos modificados:**
  - `src/app/features/settlements/settlement-form.ts`
  - `../movicab-express/src/features/business/settlement/settlement.controller.ts`

### Descripción del Problema
Al intentar formalizar una liquidación para un conductor habilitado con fechas idénticas o de un mismo día (ej. `21/10/2026` a `21/10/2026`), aparecía un mensaje de error en inglés en la esquina superior derecha:
`Nothing to settle in that range for that driver`

### Diagnóstico / Causa Raíz
1. **Truncamiento de hora en rango de fechas:** Al enviar únicamente `YYYY-MM-DD` (ej. `2026-10-21`), `new Date("2026-10-21")` evalúa a `2026-10-21T00:00:00.000Z`. La comparación SQL `ended_at <= date_to` excluía cualquier viaje completado después de las 00:00:00 del mismo día (por ejemplo a las 14:00 horas), arrojando cero viajes en el rango.
2. **Mensajes no traducidos:** El backend respondía con cadenas en inglés (`Nothing to settle in that range for that driver`, `driver_id, date_from and date_to are required`), las cuales eran mostradas directamente en el toast de notificación del frontend sin traducir.

### Solución Implementada
1. **Ajuste del límite superior de fechas:**
   - En el frontend (`settlement-form.ts`), la fecha final `date_to` se envía con extensión al final del día (`YYYY-MM-DDT23:59:59.999Z`), cubriendo todas las carreras realizadas durante dicha jornada.
   - En el backend (`settlement.controller.ts`), se incorporó lógica preventiva para que, si `date_to` llega sin componente horario o a medianoche, se extienda automáticamente a las `23:59:59.999`.
2. **Localización de mensajes de error al español:**
   - En el backend Express (`settlement.controller.ts`), se tradujeron todas las respuestas HTTP a español estándar.
   - En el frontend (`settlement-form.ts`), se implementó la función `translateError()` que intercepta cualquier código o mensaje devuelto por el servidor y asegura que la notificación toast siempre se presente en español claro, amigable y explicativo.

---

## 4. Sincronización y Visibilidad de Campos de Modelo en Vistas y Tablas

- **Fecha:** 2026-11-14
- **Módulos afectados:**
  - Operación &rarr; Conductores (`/drivers`)
  - Operación &rarr; Turnos (`/shifts`)
  - Operación &rarr; Tarifas (`/fares`)
  - Operación &rarr; Carreras (`/trips` y `/trips/:id`)
  - Operación &rarr; Liquidaciones (`/settlements`)
- **Archivos modificados:**
  - `src/app/features/drivers/driver-list.html`
  - `src/app/features/shifts/shift-list.html`
  - `src/app/features/fares/fare-list.html`
  - `src/app/features/trips/trip-list.html`
  - `src/app/features/trips/trip-detail.html`
  - `src/app/features/settlements/settlement-list.html`
  - `docs/proceso.md`

### Descripción del Requerimiento
A raíz de la revisión técnica del frontend, se identificó que ciertos atributos clave definidos en los modelos TypeScript y formularios del sistema no estaban siendo proyectados en las tablas de visualización ni en las vistas de detalle:
1. **Conductores:** Faltaban las columnas `ID` y `description` (descripción u observaciones del conductor) en el listado.
2. **Turnos:** La tabla solo exponía `Nombre`, `Conductor`, `Vehículo` y `Estado`, omitiendo `ID` y `description`.
3. **Tarifas:** En el listado no se mostraba el `ID` de tarifa ni su regla o fórmula de cálculo (`calculation_rule`).
4. **Carreras:** En la tabla de viajes no se visualizaba la fecha/hora de finalización (`ended_at`) ni las `notes` (indicaciones o notas de ruta). Asimismo, en el detalle integral de la carrera (`/trips/:id`) se requería visibilidad explícita de `ended_at` y del vínculo de liquidación (`settlement_id`).
5. **Liquidaciones:** En la tabla histórica de liquidaciones registradas se requería la visualización de las `notes` u observaciones consignadas en la formalización.
6. **Criterio de Auditoría:** Se mantuvo la restricción explícita de no sobrecargar las interfaces de usuario con marcas temporales de auditoría interna de base de datos (`createdAt`, `updatedAt`, `created_at`, `updated_at`), reservando el espacio de pantalla para datos de negocio legibles y accionables.

### Solución Implementada
1. **Conductores (`src/app/features/drivers/driver-list.html`):**
   - Se incorporó la columna `ID` (`#{{ driver.id }}`) al inicio de la tabla.
   - Se añadió la columna `Descripción` (`{{ driver.description || '—' }}`) con texto truncable y tooltip.
   - Se amplió el ancho mínimo de la tabla a `58rem` para garantizar legibilidad.
2. **Turnos (`src/app/features/shifts/shift-list.html`):**
   - Se incorporó la columna `ID` (`#{{ shift.id }}`).
   - Se añadió la columna `Descripción` (`{{ shift.description || '—' }}`).
   - Se amplió el ancho mínimo de la tabla a `62rem`.
3. **Tarifas (`src/app/features/fares/fare-list.html`):**
   - Se incluyó la columna `ID` (`#{{ fare.id }}`).
   - Se agregó la columna `Regla de Cálculo` (`{{ fare.calculation_rule || '—' }}`).
   - Se amplió el ancho mínimo de la tabla a `68rem`.
4. **Carreras (`src/app/features/trips/trip-list.html` y `trip-detail.html`):**
   - **Listado:** Se agregaron las columnas `Fin` (`ended_at | date:'dd/MM/yyyy HH:mm'`) indicando `"En curso"` en caso de null, y `Notas` (`trip.notes || '—'`).
   - **Detalle de Carrera:** Se agregaron dos tarjetas de información en la sección "Servicio de Transporte":
     - `Finalización`: Muestra la fecha y hora exacta de culminación o `"En curso / Pendiente"`.
     - `Liquidación`: Indica el estado de conciliación mostrando `"Liquidada (ID #X)"` con badge verde o `"Pendiente por liquidar"` en ámbar.
5. **Liquidaciones (`src/app/features/settlements/settlement-list.html`):**
   - En el bloque "Historial de Liquidaciones Registradas", se agregó la columna `Notas` (`s.notes || '—'`).
   - Se ajustó el `colspan` del estado vacío a 7 columnas y el `tableStyle` a `min-width: 68rem`.

### Validación
- Verificación exhaustiva con el compilador TypeScript (`node ./node_modules/typescript/bin/tsc --noEmit`), finalizando con código de salida 0 y sin advertencias ni errores de tipos o plantillas.

---

## 5. Matriz Visual Interactiva de Permisos RBAC con Toggle Reactivo

- **Fecha:** 2026-11-14
- **Módulo afectado:** Administración &rarr; Seguridad y RBAC (`/admin/rbac`)
- **Archivos modificados:**
  - `src/app/features/admin/rbac-admin.ts`
  - `src/app/features/admin/rbac-admin.html`
  - `docs/proceso.md`

### Descripción del Requerimiento
La implementación previa del módulo RBAC gestionaba la asignación y revocación de permisos mediante tablas separadas (pestañas independientes de Asignaciones y Concesiones), formularios de selección y botones de acción explícitos. Esta experiencia resultaba lenta, poco intuitiva y no permitía visualizar fácilmente el estado global de autorización de un rol o usuario.

Se requirió sustituir ese flujo por una **Matriz Visual Interactiva** donde cada permiso es representado por un *toggle switch* que se activa o revoca **de forma instantánea y reactiva** al hacer clic, sin formularios adicionales ni confirmaciones innecesarias.

### Solución Implementada

#### A. Nuevo sistema de pestañas
Se reorganizó la navegación del componente: las anteriores pestañas de *Asignaciones* y *Concesiones* (gestión técnica de tablas) fueron sustituidas por una única pestaña principal denominada **«Matriz de Permisos»**, que se muestra primero y por defecto al acceder al módulo.

#### B. Dos modos de gestión: por Rol y por Usuario

**Modo "Por Rol" (gestión de permisos de API):**
- Selector desplegable filtrable (`p-select`) para elegir el rol a configurar.
- Badge numérico con el recuento de permisos activos del rol seleccionado.
- Carga asíncrona de los `grants` del rol mediante `GET /api/concesiones-rol?role_id=X`.
- La matriz de permisos se actualiza automáticamente sin necesidad de recargar la página.

**Modo "Por Usuario" (gestión de roles asignados):**
- Selector de usuario filtrable.
- Aparece una cuadrícula de tarjetas de roles con toggle interactivo (checkboxes visuales personalizados).
- Al hacer clic sobre un rol, se invoca `POST /api/asignaciones-rol`, `PATCH .../deactivate` o `PATCH .../reactivate` según el estado actual.

#### C. Categorización segmentada de permisos
Los recursos API se agrupan automáticamente en las siguientes categorías funcionales definidas en la constante `PERMISSION_CATEGORIES` del componente:

| Categoría | Patrón de ruta |
|---|---|
| Carreras (Viajes) | `/carreras` |
| Turnos y Horarios | `/turnos` |
| Tarifas y Precios | `/tarifas` |
| Conductores | `/conductores` |
| Pasajeros | `/pasajeros` |
| Vehículos y Tipos | `/vehiculos`, `/tipos-vehiculo` |
| Empresas | `/empresas` |
| Cobros y Pagos | `/pagos` |
| Liquidaciones | `/liquidaciones` |
| Calificaciones | `/calificaciones` |
| Seguridad y Administración | `/usuarios`, `/roles`, `/recursos`, `/asignaciones-rol`, `/concesiones-rol`, `/sesion`, `/permisos` |
| Otros Recursos | (resto no clasificado) |

Cada categoría es un acordeón colapsable con cabecera de color distintivo, icono identificativo, descripción funcional y un contador de permisos activos vs. total de la categoría.

#### D. Toggle Switch reactivo por fila
Cada recurso de API muestra en su fila:
- **Toggle switch animado** (deslizante, estilo moderno): posición izquierda = sin acceso, posición derecha = autorizado.
- **Badge del método HTTP** con color semántico: `GET` verde, `POST` azul, `PATCH/PUT` ámbar, `DELETE` rojo.
- **Ruta técnica** en fuente monospace.
- **Descripción en lenguaje natural** del permiso.
- **Badge de estado** actualizado en tiempo real: *Autorizado* (verde) / *Sin acceso* (gris).
- **Micro-spinner** superpuesto sobre el toggle mientras la petición HTTP está en vuelo.

La lógica de toggle implementa tres caminos:
1. No existe `grant` → crea uno nuevo (`POST /api/concesiones-rol`).
2. `grant.status === 'active'` → revoca el permiso (`PATCH .../deactivate`).
3. `grant.status !== 'active'` → reactiva el permiso (`PATCH .../reactivate`).

Cada acción emite un toast de notificación descriptivo en español confirmando el cambio.

#### E. Mejoras en las pestañas secundarias
- **Usuarios:** La tabla ahora muestra los roles activos asignados a cada usuario como badges inline, facilitando el diagnóstico de privilegios.
- **Roles:** Se sustituyó la tabla por una **cuadrícula de tarjetas** (`grid`) con contador de permisos activos por rol.
- **Recursos API:** Se mantiene la tabla, mejorando los badges de método HTTP con la misma paleta cromática semántica de la matriz.

#### F. Carga concurrente con `forkJoin`
El método `loadAll()` utiliza `forkJoin` para cargar en paralelo usuarios, roles, recursos, asignaciones y concesiones, reduciendo el tiempo de inicialización del componente.

### Validación
- Verificación de tipos TypeScript con `node ./node_modules/typescript/bin/tsc --noEmit`: **código de salida 0, sin errores**.
