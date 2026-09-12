import { DatabaseDialect } from './database-dialect.enum';
import { validateEnvironment } from './environment.validation';

export interface DatabaseConnectionConfig {
  dialect: DatabaseDialect;
  host: string;
  port: number;
  username: string;
  password: string;
  database?: string;
  dialectOptions?: Record<string, unknown>;
}

export interface EnvironmentConfig {
  port: number;
  dbDialect: DatabaseDialect;
  database: DatabaseConnectionConfig;
}

function readExistingEnv(key: string): string {
  const value = process.env[key];

  if (value === undefined) {
    throw new Error(`Error de configuración: falta la variable de entorno ${key}`);
  }

  return value;
}

function readRequiredEnv(key: string): string {
  const value = readExistingEnv(key).trim();

  if (!value) {
    throw new Error(`Error de configuración: falta la variable de entorno ${key}`);
  }

  return value;
}

function buildDatabaseConfig(dialect: DatabaseDialect): DatabaseConnectionConfig {
  switch (dialect) {
    case DatabaseDialect.MYSQL:
      return {
        dialect,
        host: readRequiredEnv('DB_MYSQL_HOST'),
        port: Number(readRequiredEnv('DB_MYSQL_PORT')),
        username: readRequiredEnv('DB_MYSQL_USERNAME'),
        password: readExistingEnv('DB_MYSQL_PASSWORD'),
        database: readRequiredEnv('DB_MYSQL_NAME'),
      };
    case DatabaseDialect.POSTGRES:
      return {
        dialect,
        host: readRequiredEnv('DB_POSTGRES_HOST'),
        port: Number(readRequiredEnv('DB_POSTGRES_PORT')),
        username: readRequiredEnv('DB_POSTGRES_USERNAME'),
        password: readExistingEnv('DB_POSTGRES_PASSWORD'),
        database: readRequiredEnv('DB_POSTGRES_NAME'),
      };
    case DatabaseDialect.MSSQL:
      return {
        dialect,
        host: readRequiredEnv('DB_MSSQL_HOST'),
        port: Number(readRequiredEnv('DB_MSSQL_PORT')),
        username: readRequiredEnv('DB_MSSQL_USERNAME'),
        password: readExistingEnv('DB_MSSQL_PASSWORD'),
        database: readRequiredEnv('DB_MSSQL_NAME'),
      };
    case DatabaseDialect.ORACLE: {
      const host = readRequiredEnv('DB_ORACLE_HOST');
      const port = Number(readRequiredEnv('DB_ORACLE_PORT'));
      const service = readRequiredEnv('DB_ORACLE_SERVICE');

      return {
        dialect,
        host,
        port,
        username: readRequiredEnv('DB_ORACLE_USERNAME'),
        password: readExistingEnv('DB_ORACLE_PASSWORD'),
        dialectOptions: {
          connectString: `${host}:${port}/${service}`,
        },
      };
    }
    default: {
      const exhaustiveCheck: never = dialect;
      return exhaustiveCheck;
    }
  }
}

export function loadEnvironmentConfig(): EnvironmentConfig {
  const dbDialect = validateEnvironment();

  return {
    port: Number(process.env.PORT ?? 3000),
    dbDialect,
    database: buildDatabaseConfig(dbDialect),
  };
}
