# Bitácora de Proceso - Frontend MoviCab Express

Documento de seguimiento paso a paso del desarrollo del frontend de **MoviCab Express** en Angular 22 (signals, zoneless, standalone) con PrimeNG 22 y Tailwind CSS 4, siguiendo la guía técnica y la convención de commits por cada ISS terminado.

---

## Información del Proyecto

| Dato | Valor |
|---|---|
| **Frontend** | `front-movicab-express` |
| **Backend** | `movicab-express` (http://localhost:4000/api) |
| **Stack** | Angular 22, PrimeNG 22 (Aura), Tailwind CSS 4 |
| **Carpeta de Evidencias** | `docs/evidencias/` |
| **Convención de Capturas** | `ISS-XX_paso_descripcion.png` |

---

## ISS-00 — Requisitos previos

- **Fecha:** 2026-10-27
- **Estado:** ✅ Completado
- **Objetivo:** Verificar entorno de ejecución, versiones requeridas y disponibilidad del backend sin escribir código en Angular.

### Sub-ítems y Evidencias:

#### Paso 0.1 — Comprobación de versiones de entorno
Se validó que Node.js cumpla con `>= 22.22.3` / `24.x`, NPM y Angular CLI 22.
- **Node.js:** `v22.23.1`
- **NPM:** `10.9.8` / `11.19.1`
- **Angular CLI:** `22.2.3`

```bash
node -v && npm -v
./node_modules/.bin/ng version
```

![Versiones de Node, NPM y Angular](evidencias/ISS-00_0.1_versiones.png)

---

#### Paso 0.2 — Verificación de disponibilidad del backend
El backend Express se encuentra escuchando en el puerto 4000. Al consultar endpoints protegidos sin token responde `401 Unauthorized`.

```bash
curl -s http://localhost:4000/api/permisos
```

![Backend escuchando en puerto 4000](evidencias/ISS-00_0.2_backend-4000.png)

---

#### Paso 0.3 — Autenticación y permisos
Se ejecutó login por POST hacia `/api/sesion/login` obteniendo el `access_token` JWT. Luego se validó el acceso a `/api/permisos` con el token en cabecera `Authorization: Bearer <TOKEN>`.

```bash
curl -s -X POST http://localhost:4000/api/sesion/login \
  -H "Content-Type: application/json" \
  -d '{"identifier":"admin","password":"Admin123!"}'
```

![Respuesta de login y permisos](evidencias/ISS-00_0.3_login-permisos.png)

---

## ISS-01 — Bootstrap Angular 22 con CLI, Tailwind y PrimeNG

- **Fecha:** 2026-10-27
- **Estado:** ⏳ En desarrollo (Listos pasos 1.1 al 1.7)
- **Objetivo:** Configurar la base del proyecto Angular 22 integrando Tailwind CSS 4 y PrimeNG 22 con el tema Aura, definiendo capas CSS, proveedores globales y componente de validación interactiva con Signals.

### Sub-ítems y Evidencias:

#### Paso 1.1 — Creación del proyecto con Angular CLI
Proyecto generado con soporte de Tailwind CSS mediante `npx @angular/cli@22 new front-movicab-express --directory .`.

- **Estado:** ✅ Completado

![Creación del proyecto con ng new](evidencias/ISS-01_1.1_ng-new.png)

---

#### Paso 1.2 — Instalación y verificación de dependencias
Se completaron las dependencias del stack instalando `@angular/cdk` como peer dependency requerida por PrimeNG 22.

- **Comandos:**
```bash
npm install @angular/cdk
npm ls primeng @primeuix/themes primeicons @angular/cdk --depth=0
```
- **Estado:** ✅ Completado

![Dependencias instaladas](evidencias/ISS-01_1.2_dependencias.png)

---

#### Paso 1.3 — Configuración de estilos globales y capas CSS
Se estructuró `src/styles.css` con `@layer theme, base, primeng, utilities;` para garantizar que las utilidades de Tailwind tengan prioridad sin recurrir a `!important`.

- **Estado:** ✅ Completado

---

#### Paso 1.4 — Configuración de PrimeNG, tema Aura y entornos
Generación de entornos (`ng generate environments`), configuración de clave de PrimeUI Community en `src/environments/` y configuración de `src/app/app.config.ts` con providers de routing, tema Aura con soporte de dark mode, `MessageService` y `ConfirmationService`.

- **Estado:** ✅ Configurado (pendiente captura en navegador)

![Verificación de licencia PrimeUI](evidencias/ISS-01_1.4_licencia.png)

---

#### Paso 1.5 — Pantalla de arranque de ejemplo
Creación del componente interactivo de prueba (`src/app/demo/ejemplo/`) para validar componentes PrimeNG (`p-card`, `p-tag`, `p-inputtext`, `p-button`, `p-message`) y la reactividad con Signals (`signal`, `computed`, `effect`). `App` compone `<app-ejemplo />`.

- **Estado:** ✅ Configurado (pendiente captura en navegador)

![Pantalla de ejemplo con tarjeta](evidencias/ISS-01_1.5_pantalla-ejemplo.png)

---

#### Paso 1.6 — Configuración de `index.html`
Ajuste de título a `MoviCab Express · Angular 22`, idioma `lang="es"` y clases utilitarias de Tailwind en `<body>`.

- **Estado:** ✅ Completado
![Ajuste de titulo y lenguaje](evidencias/ISS-01_1.6_titulo-lenguaje.png)
---

#### Paso 1.7 — Presupuesto de compilación en `angular.json`
Ajuste de presupuesto de bundle en `angular.json` a `maximumWarning: 750kB` y `maximumError: 1MB`.

- **Estado:** ✅ Completado
![Ajuste de presupuesto de bundle](evidencias/ISS-01_1.7_presupuesto-bundle.png)
---

#### Paso 1.8 — Primera ejecución y prueba interactiva
Ejecución del servidor de desarrollo con `npm start` y comprobación de interacción con Signals (+1000 al precio).

- **Estado:** ⏳ Listo para ejecutar

![Prueba interactiva de Signals](evidencias/ISS-01_1.8_ejemplo-interaccion.png)

---

#### Verificación final del ISS-01
Validación de compilación limpia y pruebas unitarias (`ng build` y `npm test -- --watch=false`).

- **Estado:** ⏳ Pendiente tras capturas en navegador

![Build exitoso y pruebas aprobadas](evidencias/ISS-01_verificacion_build-test.png)

---

### Problemas y soluciones encontrados:
1. **Error de compilación en Paso 1.5 (`NG8004: No pipe found with name 'number'`):**
   - **Causa:** En componentes standalone de Angular, cualquier pipe utilizado en la plantilla debe importarse explícitamente en el componente.
   - **Solución:** Se importó `DecimalPipe` desde `@angular/common` y se añadió al arreglo `imports` de `Ejemplo` en `src/app/demo/ejemplo/ejemplo.ts`.
2. **Advertencia de presupuesto de bundle (`maximum budget 500kB exceeded`):**
   - **Causa:** El bundle inicial con PrimeNG y Tailwind ronda los 604 kB, superando el aviso inicial por defecto de 500 kB.
   - **Solución:** Se ajustó en `angular.json` el `maximumWarning` a `750kB` (Paso 1.7), logrando compilación limpia con código 0 y sin advertencias.

---