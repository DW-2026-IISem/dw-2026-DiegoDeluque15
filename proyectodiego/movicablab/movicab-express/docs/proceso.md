# Proceso — movicab-express

Bitácora cronológica de construcción del backend Express (arquitectura por features).
Cada entrada corresponde a un sub-ítem o ISS cerrado.

---

## ISS-01 / 2.1 — package.json
Fecha: 2026-09-26
Qué se hizo: se agregaron los scripts "build" (tsc) y "dev" (nodemon con ts-node sobre src/server.ts), y se fijó "type": "commonjs".
Evidencia: N/A (paso estructural)

## ISS-01 / 2.2 — Estructura de carpetas
Fecha: 2026-09-26
Qué se hizo: se crearon src/config, src/database/seeders, src/routes y src/features/business/pasajero.
Evidencia: N/A (paso estructural)

## ISS-01 / 2.3 — Dependencias base
Fecha: 2026-09-26
Qué se hizo: se instalaron express, cors, dotenv, morgan (producción) y typescript, ts-node, nodemon, @types/node, @types/express, @types/cors, @types/morgan (dev).
Evidencia: N/A (paso estructural)

## ISS-01 / 2.4 — tsconfig.json
Fecha: 2026-09-26
Qué se hizo: se configuró target ES2020, module commonjs, rootDir ./src, outDir ./dist, strict true, con include src/**/*.ts.
Evidencia: N/A (paso estructural)

## ISS-01 / 2.5 — Esqueleto de la app
Fecha: 2026-09-26
Qué se hizo: se creó src/config/index.ts (clase App: settings, middlewares con morgan/cors/express.json, método listen) y src/server.ts (arranque de App). Verificado con "npx tsc --noEmit" sin errores.
Evidencia: N/A (paso estructural)

## ISS-01 / Cierre ISS-01 — Servidor corriendo
Fecha: 2026-09-26
Qué se hizo: se ejecutó "npm run dev" y el servidor levantó correctamente en el puerto configurado.
Cómo capturarlo: ejecutar `npm run dev` y esperar ver en la terminal "Servidor ejecutándose en puerto 4000" (o el puerto configurado) sin errores de compilación.
![Evidencia Cierre ISS-01](evidencias/iss-01-npm-run-dev.png)

## ISS-02 / 3.1 — Drivers Sequelize y .env
Fecha: 2026-09-26
Qué se hizo: se instaló el ORM Sequelize, sus tipos y los drivers para MySQL, Postgres, MSSQL y Oracle. Se creó el archivo .env con la configuración de motores y base de datos (DB_ENGINE=mysql por defecto).
Evidencia: N/A (paso estructural)

## ISS-02 / 3.2 — Configuración Sequelize (database/db.ts)
Fecha: 2026-09-26
Qué se hizo: se creó src/database/db.ts con la instancia central de Sequelize, soportando múltiples motores vía variables de entorno, y funciones utilitarias de conexión.
Evidencia: N/A (paso estructural)

## ISS-02 / 3.3 — Carpeta seeders
Fecha: 2026-09-26
Qué se hizo: se creó la carpeta reservada src/database/seeders.
Evidencia: N/A (paso estructural)

## ISS-02 / Cierre ISS-02 — Servidor corriendo
Fecha: 2026-09-26
Qué se hizo: se ejecutó "npm run dev" y el servidor levantó correctamente sin errores tras configurar los drivers de BD.
Cómo capturarlo: ejecutar `npm run dev` y esperar ver "🔌 Conectando a base de datos: MYSQL" y "Servidor ejecutándose en puerto 4000" sin errores.
![Evidencia Cierre ISS-02](evidencias/iss-02-npm-run-dev.png)

## ISS-03-A / 4.1 — Modelo Pasajero
Fecha: 2026-09-26
Qué se hizo: se creó src/features/business/pasajero/pasajero.model.ts con bcrypt para encriptar contraseñas.
Evidencia: N/A (paso estructural)

## ISS-03-A / 4.2 — Esqueleto controller / routes + carpeta http
Fecha: 2026-09-26
Qué se hizo: se crearon pasajero.controller.ts y pasajero.routes.ts (esqueleto vacío) y la carpeta src/features/business/pasajero/http/.
Evidencia: N/A (paso estructural)

## ISS-03-A / 4.3 — Agregador Routes + cableado en Config
Fecha: 2026-09-26
Qué se hizo: se creó src/routes/index.ts con clase Routes/pasajeroRoutes. Se parcheó src/config/index.ts: imports de db/modelo/Routes, propiedad routePrv, métodos routes() y dbConnection() con sync alter:true.
Evidencia: N/A (paso estructural)

## ISS-03-B / 5.1 — GetAll y GetOne (Pasajero)
Fecha: 2026-09-27
Qué se hizo: se implementaron los métodos getAll y getOne en pasajero.controller.ts, se registraron las rutas GET en pasajero.routes.ts y se creó el archivo HTTP para pruebas, excluyendo el campo password de las respuestas.
Cómo capturarlo: ejecutar `npm run dev` en una terminal y en otra ejecutar `curl -s http://localhost:4000/api/pasajeros` y `curl -s http://localhost:4000/api/pasajeros/1`. Debe verse un array vacío y un error 404 respectivamente.
![Evidencia ISS-03-B](evidencias/iss-03-b-get-pasajeros.png)
## ISS-03-C / 6.1 — Crear pasajero
Fecha: 2026-09-27
Qué se hizo: se implementó el método create en pasajero.controller.ts, se registró la ruta POST /api/pasajeros en pasajero.routes.ts y se creó el archivo HTTP pasajeros.create.http.
Cómo capturarlo: ejecutar `npm run dev` en una terminal y en otra ejecutar `curl -s -X POST http://localhost:4000/api/pasajeros -H 'Content-Type: application/json' -d '{"name":"Ana","phone":"3001","email":"ana@test.com","password":"Password123!","status":"active"}'`. Debe retornar HTTP 201 con el pasajero recién creado y sin la contraseña en la respuesta.
![Evidencia ISS-03-C](evidencias/iss-03-c-post-pasajero.png)

## ISS-03-D / 7.1 — Update PUT y PATCH (Pasajero)
Fecha: 2026-09-27
Qué se hizo: se implementaron los métodos updatePut y updatePatch en pasajero.controller.ts, se registraron las rutas PUT y PATCH /api/pasajeros/:id en pasajero.routes.ts, y se creó pasajeros.update.http. La respuesta excluye siempre el campo password.
Cómo capturarlo: ejecutar `npm run dev` y luego, en otra terminal, `curl -s -X PUT http://localhost:4000/api/pasajeros/1 -H 'Content-Type: application/json' --data-raw '{"name":"Ana Actualizada","address":"Carrera 15","phone":"3009876543","email":"ana@test.com","status":"active"}'` y `curl -s -X PATCH http://localhost:4000/api/pasajeros/1 -H 'Content-Type: application/json' --data-raw '{"phone":"3011112233"}'`. Deben retornar 200 con el registro actualizado y sin password.
![Evidencia ISS-03-D](evidencias/iss-03-d-put-pasajero.png)

## ISS-03-E / 8.1 — Delete fisico y logico (Pasajero)
Fecha: 2026-09-27
Que se hizo: se implementaron deletePhysical (DELETE /api/pasajeros/:id — borrado permanente) y deleteLogical (PATCH /api/pasajeros/:id/deactivate — status = inactive). Se verifico: tras borrado logico el registro desaparece del GET /api/pasajeros (filtra active), pero queda en la tabla; tras borrado fisico se elimina de la BD. La respuesta nunca expone el password.
Como capturarlo: ejecutar `npm run dev`, crear un pasajero con POST /api/pasajeros y anotar el id. Luego ejecutar `curl -s -X PATCH http://localhost:4000/api/pasajeros/<id>/deactivate` para el borrado logico y verificar con `curl -s http://localhost:4000/api/pasajeros` que ya no aparece. Despues `curl -s -X DELETE http://localhost:4000/api/pasajeros/<id>` para el borrado fisico y confirmar con GET que la lista queda vacia.
![Evidencia ISS-03-E](evidencias/iss-03-e-delete-pasajero.png)
## ISS-06 / 11.1 — Modelo TipoVehiculo
Fecha: 2026-09-27
Qué se hizo: se creó el modelo TipoVehiculo en tipo-vehiculo.model.ts con los campos (name, description, status) y timestamps activos. Se importó el modelo en src/config/index.ts para su sincronización con la base de datos (Sequelize).
Evidencia: N/A (paso estructural, sin captura)
## ISS-06 / 11.2-A — GetAll y GetOne (TipoVehiculo)
Fecha: 2026-09-27
Qué se hizo: se creó tipo-vehiculo.controller.ts con los métodos getAll y getOne, tipo-vehiculo.routes.ts con las rutas GET, http/tipos-vehiculo.get.http, y se cableó en src/routes/index.ts y src/config/index.ts.
Cómo capturarlo: ejecutar `npm run dev` y en otra terminal `curl -s http://localhost:4000/api/tipos-vehiculo | python3 -m json.tool` (debe retornar array vacío) y `curl -s http://localhost:4000/api/tipos-vehiculo/999 | python3 -m json.tool` (debe retornar 404).
![Evidencia ISS-06-GetAll-GetOne](evidencias/iss-06-a-get-tipos-vehiculo.png)
## ISS-06 / 11.2-B — Create POST (TipoVehiculo)
Fecha: 2026-09-27
Qué se hizo: se agregó el método create en tipo-vehiculo.controller.ts, se registró la ruta POST /api/tipos-vehiculo en tipo-vehiculo.routes.ts, y se creó http/tipos-vehiculo.create.http. Verificado: retorna 201 con el registro recién creado (id=1 en BD).
Cómo capturarlo: ejecutar `npm run dev` y en otra terminal `curl -s -X POST http://localhost:4000/api/tipos-vehiculo -H 'Content-Type: application/json' --data-raw '{"name":"Sedan","description":"Vehiculo de 4 puertas","status":"active"}' | python3 -m json.tool`. Debe retornar 201 con el objeto creado.
![Evidencia ISS-06-B](evidencias/iss-06-b-post-tipo-vehiculo.png)
## ISS-06 / 11.2-C — Update PUT y PATCH (TipoVehiculo)
Fecha: 2026-09-27
Qué se hizo: se agregaron los métodos updatePut y updatePatch en tipo-vehiculo.controller.ts, se registraron las rutas PUT y PATCH /api/tipos-vehiculo/:id en tipo-vehiculo.routes.ts, y se creó http/tipos-vehiculo.update.http. La respuesta retorna el registro actualizado con 200.
Cómo capturarlo: ejecutar `npm run dev` y luego `curl -s -X PUT http://localhost:4000/api/tipos-vehiculo/1 -H 'Content-Type: application/json' --data-raw '{"name":"Sedan Actualizado","description":"Categoria renovada","status":"active"}' | python3 -m json.tool` y `curl -s -X PATCH http://localhost:4000/api/tipos-vehiculo/2 -H 'Content-Type: application/json' --data-raw '{"description":"Descripcion parcial actualizada"}' | python3 -m json.tool`. Deben retornar 200 con el registro actualizado.
![Evidencia ISS-06-C](evidencias/iss-06-c-put-tipo-vehiculo.png)
## ISS-06 / 11.2-D — Delete (TipoVehiculo)
Fecha: 2026-09-27
Qué se hizo: se agregaron los métodos deletePhysical y deleteLogical en tipo-vehiculo.controller.ts, las rutas DELETE /api/tipos-vehiculo/:id y PATCH /api/tipos-vehiculo/:id/deactivate en tipo-vehiculo.routes.ts, y el archivo http/tipos-vehiculo.delete.http. Verificado: borrado lógico oculta el registro en el GET (lo marca como inactive) y el físico lo borra por completo de la BD.
Cómo capturarlo: ejecutar `npm run dev` y en otra terminal crear un registro de prueba (ej. id 5): `curl -s -X POST http://localhost:4000/api/tipos-vehiculo -H 'Content-Type: application/json' --data-raw '{"name":"Borrar","status":"active"}' | python3 -m json.tool`. Luego hacer delete físico: `curl -s -X DELETE http://localhost:4000/api/tipos-vehiculo/5 | python3 -m json.tool` y confirmar con `curl -s http://localhost:4000/api/tipos-vehiculo | python3 -m json.tool` que ya no está.
![Evidencia ISS-06-D](evidencias/iss-06-d-delete-tipo-vehiculo.png)