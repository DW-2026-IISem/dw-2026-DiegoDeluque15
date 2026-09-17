-- =============================================================================
-- Migración: restricciones FK faltantes en movicab_db (opción B)
-- =============================================================================
--
-- Agrega 10 foreign keys que Sequelize creó como columnas pero sin restricción
-- a nivel de base de datos. Diagnóstico previo (2026-09-15): 0 filas huérfanas
-- en todas las relaciones incluidas.
--
-- EXCLUIDO a propósito:
--   pagos.referencia_id → carreras.id
--
-- Motivo: Pago usa referencia polimórfica (referencia_tipo + referencia_id).
-- En el alcance actual solo existe referencia_tipo = 'carrera', pero una FK
-- directa referencia_id → carreras.id no valida el tipo y rompería el diseño
-- si en el futuro se admitieran otros referencia_tipo. La integridad de Pago
-- se mantiene en la capa de aplicación (CreatePagoUseCase).
--
-- Ejecutar manualmente contra movicab_db. NO incluye pagos.
-- =============================================================================

USE movicab_db;

-- 1. carreras.pasajero_id → pasajeros.id
ALTER TABLE carreras
  ADD CONSTRAINT fk_carreras_pasajero_id
  FOREIGN KEY (pasajero_id) REFERENCES pasajeros (id)
  ON DELETE RESTRICT ON UPDATE CASCADE;

-- 2. carreras.turno_id → turnos.id
ALTER TABLE carreras
  ADD CONSTRAINT fk_carreras_turno_id
  FOREIGN KEY (turno_id) REFERENCES turnos (id)
  ON DELETE RESTRICT ON UPDATE CASCADE;

-- 3. carreras.tarifa_id → tarifas.id
ALTER TABLE carreras
  ADD CONSTRAINT fk_carreras_tarifa_id
  FOREIGN KEY (tarifa_id) REFERENCES tarifas (id)
  ON DELETE RESTRICT ON UPDATE CASCADE;

-- 4. carreras.liquidacion_id → liquidaciones.id (nullable)
ALTER TABLE carreras
  ADD CONSTRAINT fk_carreras_liquidacion_id
  FOREIGN KEY (liquidacion_id) REFERENCES liquidaciones (id)
  ON DELETE SET NULL ON UPDATE CASCADE;

-- 5. calificaciones.carrera_id → carreras.id
ALTER TABLE calificaciones
  ADD CONSTRAINT fk_calificaciones_carrera_id
  FOREIGN KEY (carrera_id) REFERENCES carreras (id)
  ON DELETE RESTRICT ON UPDATE CASCADE;

-- 6. role_users.user_id → users.id
ALTER TABLE role_users
  ADD CONSTRAINT fk_role_users_user_id
  FOREIGN KEY (user_id) REFERENCES users (id)
  ON DELETE RESTRICT ON UPDATE CASCADE;

-- 7. role_users.role_id → roles.id
ALTER TABLE role_users
  ADD CONSTRAINT fk_role_users_role_id
  FOREIGN KEY (role_id) REFERENCES roles (id)
  ON DELETE RESTRICT ON UPDATE CASCADE;

-- 8. resource_roles.resource_id → resources.id
ALTER TABLE resource_roles
  ADD CONSTRAINT fk_resource_roles_resource_id
  FOREIGN KEY (resource_id) REFERENCES resources (id)
  ON DELETE RESTRICT ON UPDATE CASCADE;

-- 9. resource_roles.role_id → roles.id
ALTER TABLE resource_roles
  ADD CONSTRAINT fk_resource_roles_role_id
  FOREIGN KEY (role_id) REFERENCES roles (id)
  ON DELETE RESTRICT ON UPDATE CASCADE;

-- 10. refresh_tokens.user_id → users.id
ALTER TABLE refresh_tokens
  ADD CONSTRAINT fk_refresh_tokens_user_id
  FOREIGN KEY (user_id) REFERENCES users (id)
  ON DELETE RESTRICT ON UPDATE CASCADE;
