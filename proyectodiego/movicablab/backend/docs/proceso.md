# Proceso y decisiones — MoviCab

## Entrada 1 — Preparación Semana 04
**Fecha:** 04-sep-2026
**Issue:** #01, #02
**Contexto:** Análisis de dominio y arquitectura antes de escribir código.
**Decisión:** Se documentaron entidades, relaciones y arquitectura en docs/sdd.md, corrigiendo la relación Liquidacion-Carrera y agregando entidades de identidad/RBAC no explícitas en el enunciado original del profesor.
**Herramienta IA usada:** Claude, para estructurar el SDD siguiendo la plantilla StoreLab del profesor.

## Entrada 3 — Conexión a SQL Server vía Sequelize
**Fecha:** 06-sep-2026
**Contexto:** Verificar conexión remota a los 4 motores de BD desde el backend.
**Problema:** SequelizeAccessDeniedError "Login failed for user diego15" a pesar de que el login era correcto (confirmado con sqlcmd).
**Diagnóstico:** Se aisló el problema probando tedious puro (conectó bien), luego Sequelize con y sin el campo database (sin database conectó bien). Esto reveló que SQL Server disfraza "no existe la base de datos" como error de login.
**Causa real:** La base de datos movicab_db nunca se había creado en SQL Server (a diferencia de MySQL/PostgreSQL, que la crean automáticamente vía variable de entorno del contenedor).
**Solución:** CREATE DATABASE movicab_db; y CREATE USER diego15 FOR LOGIN diego15; dentro de esa base. Además se agregó dialectOptions.options.encrypt/trustServerCertificate en database.config.ts, requerido por el driver tedious para SQL Server.
**Herramienta IA usada:** Claude, para el diagnóstico paso a paso descartando capas (red, driver, versión, config).

## Entrada 4 — Conexion a Oracle vía Sequelize
**Fecha:** 06-sep-2026
**Contexto:** Verificar conexion a Oracle, ultimo de los 4 motores.
**Problema:** ORA-01017 invalid username/password.
**Diagnostico:** Se confirmo el login real con sqlplus usando Easy Connect (//localhost:1521/movicab); el .env del backend tenia la contraseña de SQL Server (Abril152006!) en vez de la de Oracle (abril152006), arrastrada de una edicion anterior.
**Causa real:** Cada motor quedo con una contraseña ligeramente distinta por las politicas de complejidad de cada uno; no se actualizo el campo correcto al cambiar de motor en el .env.
**Solucion:** Corregir DB_PASSWORD=abril152006 en el .env al probar Oracle.
**Leccion aprendida:** Documentar en un solo lugar la contraseña real de cada motor para no confundirlas al alternar el .env.

## Entrada 5 — Correccion de ubicacion de modulo Pasajero
**Fecha:** 06-sep-2026
**Contexto:** Pasajero se habia creado dentro de features/business/fleets, pero segun el SDD (seccion 3) fleets corresponde a Empresa/Vehiculo, no a Pasajero.
**Decision:** Se movio Pasajero a su propio modulo features/business/passengers, dejando fleets vacio y listo para Empresa/Vehiculo. Se uso git mv para conservar el historial de cada archivo.
**Leccion aprendida:** Verificar la asignacion de modulo contra el SDD antes de generar el codigo, no despues.
