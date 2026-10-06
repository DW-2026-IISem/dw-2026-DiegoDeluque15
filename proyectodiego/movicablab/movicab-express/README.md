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

- `src/features/business/`: Contiene las 11 entidades principales del negocio.
- `src/features/auth/`: Contiene los 7 features del sistema de autenticación y autorización (RBAC).
- `src/shared/`: Código transversal (errores compartidos, middlewares base, helpers).

## 🏢 Entidades de Negocio

El sistema modela las siguientes 11 entidades:

- **Pasajero**: Gestión de usuarios que solicitan el servicio.
- **TipoVehiculo**: Categorización de los vehículos (ej. sedán, van).
- **Empresa**: Entidades a las que pertenecen los conductores o vehículos.
- **Conductor**: Choferes registrados para operar en la plataforma.
- **Vehiculo**: Automóviles asignados para realizar las carreras.
- **Turno**: Periodos de tiempo en los que operan los conductores.
- **Tarifa**: Modelos de cobro aplicables a las carreras.
- **Carrera**: Registro de los viajes o servicios prestados.
- **Pago**: Transacciones asociadas a las carreras cobradas.
- **Calificacion**: Evaluaciones otorgadas al término de una carrera.
- **Liquidacion**: Cálculos financieros periódicos de las operaciones.

## 🔒 Sistema de Autenticación y Permisos

- **Autenticación**: Basada en **JWT** (JSON Web Tokens), implementando un `access token` de corta duración junto con un `refresh token` rotativo.
- **Autorización**: Control de Acceso Basado en Roles (**RBAC**) con el paradigma **deny by default** (todas las rutas exigen permisos a menos que se declaren explícitamente abiertas).
- **Roles Definidos**:
  - `ADMIN`: Posee acceso total (92 permisos).
  - `DESPACHO`: Posee acceso operativo restringido (26 permisos).

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

`Empresa` → `Conductor` / `Vehiculo` → `Turno` → `Tarifa` → `Carrera` → `Pago` / `Calificacion` / `Liquidacion`
