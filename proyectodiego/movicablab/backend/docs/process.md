## Identificación del problema

### Descripción del problema

MoviCab es una plataforma orientada a la gestión y despacho de servicios de taxi. Actualmente, la operación requiere organizar diferentes procesos relacionados con la solicitud y asignación de carreras, disponibilidad de conductores y vehículos, cálculo de tarifas y seguimiento de los servicios realizados.

El problema principal se encuentra en la necesidad de centralizar esta información y controlar de manera organizada el proceso de una carrera, desde su solicitud y asignación hasta su finalización. También es necesario gestionar aspectos relacionados con los pagos, las calificaciones y las liquidaciones correspondientes a conductores y empresas afiliadas.

Por esta razón, se plantea el desarrollo de un backend que permita estructurar y administrar estos procesos mediante módulos independientes, aplicando reglas de negocio para el cálculo de tarifas, controlando los estados de las carreras y manteniendo la información organizada y disponible para los diferentes actores del sistema.

### Actores involucrados

| Actor | Participación en el sistema |
|---|---|
| Pasajero | Solicita servicios de taxi y puede realizar una calificación al finalizar la carrera. |
| Conductor | Recibe y realiza carreras asignadas, utilizando un vehículo registrado. |
| Personal de despacho | Gestiona las solicitudes y asigna conductores y vehículos disponibles. |
| Administrador | Gestiona la información general y configuración del sistema. |
| Área financiera | Gestiona pagos y procesos de liquidación. |
| Empresa afiliada | Agrupa y administra conductores y vehículos vinculados a la operación. |

### Necesidad identificada

Se requiere un sistema que permita centralizar la información de la operación de MoviCab, establecer una estructura clara para sus entidades y relaciones, y aplicar reglas que permitan controlar los procesos principales del servicio. El backend servirá como base para posteriormente incorporar las funcionalidades completas del sistema y facilitar su integración con otros componentes.

## Momento Académico 1

### Momento 1: identificación y temas de la semana

#### Alineación

La semana 04 inicia la aplicación integradora del proyecto MoviCab dentro de la Unidad 01: fundamentos web, dominio y arquitectura. Sobre el entorno verificado en las semanas anteriores —WSL 2, Docker con cuatro motores de base de datos, Python, Node.js y DBeaver— se definirá el dominio y se construirá la base técnica del backend.

En esta etapa se modelarán las entidades, relaciones y agregados del negocio; se establecerá una arquitectura por capas; se definirán los contratos de la API y los DTO; y se preparará la estructura inicial del backend NestJS, incluyendo configuración, componentes comunes, base de datos, logging, health checks y Swagger.

El frontend no se aborda en esta semana, porque corresponde a la Unidad 03, prevista para la semana 10.

#### Temas y resultados de aprendizaje

| Tema o contenido | Resultado de aprendizaje / competencia que tributa |
|---|---|
| Problema, actores y requisitos del proyecto MoviCab | RA: comprender el dominio y delimitar el alcance. |
| Fundamentos web y protocolos HTTP/HTTPS, bajo el modelo cliente-servidor | RA: aplicar la arquitectura cliente-servidor. |
| Modelado del dominio: entidades, relaciones, agregados y diseño por capas | RA: diseñar la arquitectura del backend. |
| Contratos de la API, DTO y modularidad | RA: definir contratos y estructura modular. |
| Base del backend NestJS: configuración, componentes comunes, base de datos, logging, health checks y Swagger | RA: dejar preparada la base técnica del backend. |

### Lectura docente del contexto

#### Construido en las semanas anteriores

- WSL 2 y repositorio del proyecto.
- Tablero Kanban y especificación inicial.
- Laboratorio de cuatro motores de base de datos en Docker.
- Toolchain de Python, Node.js y DBeaver, con script de comprobación.

#### Limitaciones y condiciones reales

- El proyecto inicia sin una base de código previa.
- La arquitectura y los contratos deben definirse antes de implementar las funcionalidades completas.
- Las bases de datos de Docker se consumen mediante conexión remota.
- Se debe decidir una estructura consistente de carpetas, módulos y configuraciones para el backend.

#### Fuera del alcance de esta semana

- CRUD completo con todas las reglas de negocio.
- Autenticación productiva y autorización RBAC completa.
- Desarrollo del frontend o de la interfaz de usuario.
- Despliegue y pruebas de carga.

Esta semana se concentrará en los fundamentos: dominio, arquitectura, contratos y base técnica del backend.

## Dominio de MoviCab

### Entidades de negocio

| Entidad | Atributos y claves sugeridos |
|---|---|
| Pasajero | `id`, `nombre`, `descripcion`, `is_active`, `created_at`, `updated_at` |
| Empresa | `id`, `nit` (único), `razon_social`, `contacto_principal`, `is_active` |
| Conductor | `id`, `nombre`, `descripcion`, `is_active`, `created_at`, `updated_at` |
| Vehículo | `id`, `nombre`, `descripcion`, `is_active`, `created_at`, `updated_at` |
| Turno | `id`, `nombre`, `descripcion`, `is_active`, `created_at`, `updated_at` |
| Tarifa | `id`, `nombre`, `regla_calculo`, `valor_base`, `vigencia_desde`, `vigencia_hasta`, `is_active` |
| Carrera | `id`, `referencia_id` (FK), `fecha_inicio`, `fecha_fin`, `total`, `estado`, `observaciones` |
| Pago | `id`, `referencia_tipo`, `referencia_id`, `metodo`, `monto`, `fecha`, `estado` |
| Calificación | `id`, `nombre`, `descripcion`, `is_active`, `created_at`, `updated_at` |
| Liquidación | `id`, `referencia_id` (FK), `fecha`, `valor`, `estado`, `observaciones` |

### Relaciones de negocio

- Una empresa tiene muchos conductores y muchos vehículos.
- Un conductor y un vehículo pueden tener muchos turnos.
- Un pasajero puede solicitar muchas carreras y un turno puede asociarse a muchas carreras.
- Una tarifa puede aplicarse a muchas carreras.
- Una carrera puede tener muchos pagos y cero o una calificación.
- Un conductor puede tener muchas liquidaciones; cada liquidación agrupa carreras cerradas.

### Reglas y recursos iniciales

La tarifa se calcula con reglas vigentes, recargos y distancia. Los parámetros protegidos no pueden ser alterados por el conductor. La carrera debe controlarse desde la solicitud y asignación hasta el cierre, y los pagos, calificaciones y liquidaciones deben conservar trazabilidad.

Los roles iniciales son `ADMIN`, `DESPACHO`, `CONDUCTOR`, `FINANZAS` y `SOPORTE`. Los recursos de referencia son:

- `POST /carreras`
- `POST /despachos`
- `PATCH /carreras/:id/estado`
- `POST /liquidaciones`

### Arquitectura y modularidad inicial

El backend se organizará por capas y módulos, separando responsabilidades de presentación, aplicación, dominio e infraestructura. Los módulos de negocio sugeridos son:

- `features/business/fleets`
- `features/business/drivers`
- `features/business/dispatch`
- `features/business/trips`
- `features/business/pricing`
- `features/business/settlements`

La base transversal del backend incluirá configuración, componentes comunes, persistencia, logging, health checks y documentación Swagger. Los contratos de entrada y salida se formalizarán mediante DTO y endpoints versionables, para que las reglas del dominio no dependan directamente del transporte HTTP.

## Objetivo semanal: OBJ-S04

Al finalizar la semana, el estudiante comprende el dominio y la arquitectura de MoviCab —su problema, actores, requisitos, entidades y relaciones—, define la arquitectura por capas, establece los contratos DTO/API y deja lista la base del backend NestJS, incluyendo configuración, componentes comunes, base de datos, logging, health checks y Swagger. Esta base permitirá construir durante la clase una primera rebanada vertical funcional y continuar la integración del proyecto en las semanas siguientes.

## Resultados esperados: Momento 2 · Especificación SDD

| ID | Resultado esperado (descompone OBJ-S04) |
|---|---|
| R-S04-01 | Problema, actores y requisitos del dominio de MoviCab identificados y documentados. |
| R-S04-02 | Modelo de dominio definido —entidades, relaciones y agregados— y preparado para ser diagramado. |
| R-S04-03 | Arquitectura por capas definida: `presentation`, `application`, `domain` e `infrastructure`. |
| R-S04-04 | Contratos DTO/API iniciales definidos y documentados para los recursos principales del despacho, las carreras y las liquidaciones. |
| R-S04-05 | Base del backend NestJS creada: `config`, `common`, `database`, `logging`, `health` y Swagger. |
| R-S04-06 | La SDD (`docs/sdd.md`) y el Kanban (`docs/kanban.md`) de MoviCab se encuentran actualizados. |