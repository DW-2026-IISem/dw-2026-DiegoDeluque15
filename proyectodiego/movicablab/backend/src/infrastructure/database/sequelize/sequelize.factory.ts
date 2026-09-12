import { Sequelize } from 'sequelize-typescript';
import { loadEnvironmentConfig } from '../../../config/environment';
import { ALL_MODELS } from './all-models';

export function createSequelizeInstance(): Sequelize {
  const { database } = loadEnvironmentConfig();

  return new Sequelize({
    dialect: database.dialect,
    host: database.host,
    port: database.port,
    username: database.username,
    password: database.password,
    database: database.database,
    dialectOptions: database.dialectOptions,
    models: ALL_MODELS,
    logging: false,
  });
}
