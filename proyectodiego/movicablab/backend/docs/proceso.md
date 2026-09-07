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
