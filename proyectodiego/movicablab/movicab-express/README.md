# MoviCab Express API

Backend construido con Express + TypeScript + Sequelize para **MoviCab** (sistema de despacho de taxis). El proyecto implementa una arquitectura por features y fue construido como pista manual del curso de Desarrollo Web II.

## 🛠 Stack Tecnológico

- **Entorno:** Node.js
- **Framework:** Express 5
- **Lenguaje:** TypeScript
- **ORM:** Sequelize (configurado para MySQL por defecto, con soporte para PostgreSQL, SQL Server y Oracle)
- **Seguridad:** JWT para autenticación, bcrypt para hashing de contraseñas
- **Documentación:** Swagger / OpenAPI

## 📂 Estructura de Carpetas

La aplicación sigue una **arquitectura por features**:

- `src/features/business/`: Contiene las 11 entidades principales del negocio en inglés (`company`, `vehicle-type`, `passenger`, `fare`, `driver`, `vehicle`, `shift`, `trip`, `payment`, `rating`, `settlement`).
- `src/features/auth/`: Contiene los 7 features del sistema de autenticación y autorización (RBAC).
- `src/shared/`: Código transversal (errores compartidos, middlewares base, helpers).

## 🏢 Entidades de Negocio (Modeladas en Inglés)

El sistema modela las siguientes 11 entidades de negocio (código y base de datos en inglés; URLs HTTP conservadas en español según contrato de API):

- **Passenger** (`passengers`): Gestión de usuarios pasajeros que solicitan el servicio.
- **VehicleType** (`vehicle_types`): Categorización de los vehículos (ej. sedan, van).
- **Company** (`companies`): Entidades / empresas a las que pertenecen los conductores o vehículos.
- **Driver** (`drivers`): Choferes registrados para operar en la plataforma.
- **Vehicle** (`vehicles`): Automóviles asignados para realizar las carreras.
- **Shift** (`shifts`): Periodos o turnos en los que operan los conductores con vehículos.
- **Fare** (`fares`): Modelos de cobro y tarifas aplicables a los viajes.
- **Trip** (`trips`): Registro de los viajes o servicios prestados (máquina de estados).
- **Payment** (`payments`): Transacciones asociadas a las carreras cobradas.
- **Rating** (`ratings`): Evaluaciones y calificaciones otorgadas al término de un viaje.
- **Settlement** (`settlements`): Cálculos y liquidaciones financieras periódicas de las operaciones.

## 🔒 Sistema de Autenticación y Permisos

- **Autenticación**: Basada en **JWT** (JSON Web Tokens), implementando un `access token` de corta duración junto con un `refresh token` rotativo.
- **Autorización**: Control de Acceso Basado en Roles (**RBAC**) con el paradigma **deny by default** (todas las rutas exigen permisos a menos que se declaren explícitamente abiertas).
- **Roles Definidos**:
  - `ADMIN`: Posee acceso total (102 permisos).
  - `DESPACHO`: Posee acceso operativo restringido (26 permisos).

## 🧪 Solicitudes HTTP desde VS Code

Los archivos `.http` usan los perfiles `admin`, `despacho` y `custom` definidos en `.vscode/settings.json` mediante `rest-client.environmentVariables`. En REST Client, selecciona un perfil con `Ctrl+Alt+E`. Para usar `custom`, completa localmente `authUsername` y `authPassword` en `.vscode/settings.json` con una cuenta activa que ya tenga el rol deseado; no guardes contraseñas reales en cambios que vayas a compartir.

En cada archivo `.http`, ejecuta primero la solicitud `authLogin` una vez para obtener un access token sin copiarlo. Después puedes enviar sus solicitudes protegidas directamente; si el token expira, vuelve a ejecutar `authLogin`. Las solicitudes abiertas de sesión y los casos que prueban respuestas `401` sin token se mantienen sin cabecera de autorización.

## 🚀 Cómo levantar el proyecto localmente

1. Clona este repositorio.
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Configura el entorno copiando el archivo de ejemplo:
   ```bash
   cp .env.example .env
   ```
   *Completa las credenciales de tu base de datos local en el archivo `.env`.*
4. Sincroniza y puebla la base de datos con los datos iniciales:
   ```bash
   npm run db:seed
   ```
5. Levanta el servidor en modo desarrollo:
   ```bash
   npm run dev
   ```

## 📜 Scripts disponibles

Dentro del `package.json` están disponibles:

- `npm run dev`: Levanta el servidor usando nodemon para recarga en caliente.
- `npm run build`: Compila el código TypeScript a JavaScript en la carpeta `dist`.
- `npm run db:seed`: Corre los seeders para poblar las 17 tablas con catálogos y datos de prueba.
- `npm run db:seed:rbac`: Sincroniza solo los recursos y permisos RBAC sin reinicializar ni borrar las tablas de negocio.

## 📖 Documentación de la API

Una vez el servidor esté corriendo, la documentación interactiva estará disponible en:
👉 **[http://localhost:4000/api/docs](http://localhost:4000/api/docs)**

## 🔑 Credenciales de Prueba (Seeders)

Los seeders generan automáticamente los siguientes usuarios para pruebas. **Atención:** Utiliza estas cuentas exclusivamente en entornos de desarrollo.

- **Admin** (Rol ADMIN):
  - Usuario: `admin`
  - Contraseña: `Admin123!`
- **Seller / Despacho** (Rol DESPACHO):
  - Usuario: `seller`
  - Contraseña: `Seller123!`

## 🔄 Diagrama de Dependencias (Orden de Entidades)

Para facilitar la comprensión del dominio, las entidades de negocio se relacionan en el siguiente orden de dependencia (de padres a hijos):

`Company` → `Driver` / `Vehicle` → `Shift` → `Fare` → `Trip` → `Payment` / `Rating` / `Settlement`
