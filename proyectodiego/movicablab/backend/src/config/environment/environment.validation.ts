import { DatabaseDialect, DATABASE_DIALECTS } from './database-dialect.enum';

const DIALECT_ENV_VARS: Record<DatabaseDialect, readonly string[]> = {
  [DatabaseDialect.MYSQL]: [
    'DB_MYSQL_HOST',
    'DB_MYSQL_PORT',
    'DB_MYSQL_USERNAME',
    'DB_MYSQL_PASSWORD',
    'DB_MYSQL_NAME',
  ],
  [DatabaseDialect.POSTGRES]: [
    'DB_POSTGRES_HOST',
    'DB_POSTGRES_PORT',
    'DB_POSTGRES_USERNAME',
    'DB_POSTGRES_PASSWORD',
    'DB_POSTGRES_NAME',
  ],
  [DatabaseDialect.MSSQL]: [
    'DB_MSSQL_HOST',
    'DB_MSSQL_PORT',
    'DB_MSSQL_USERNAME',
    'DB_MSSQL_PASSWORD',
    'DB_MSSQL_NAME',
  ],
  [DatabaseDialect.ORACLE]: [
    'DB_ORACLE_HOST',
    'DB_ORACLE_PORT',
    'DB_ORACLE_USERNAME',
    'DB_ORACLE_PASSWORD',
    'DB_ORACLE_SERVICE',
  ],
};

function isPasswordVariable(variableName: string): boolean {
  return variableName.endsWith('_PASSWORD');
}

/** Exige que la clave exista en process.env; permite valor vacío (p. ej. MySQL sin contraseña). */
function isMissingEnvKey(value: string | undefined): boolean {
  return value === undefined;
}

/** Exige clave presente y valor no vacío tras trim. */
function isMissingEnvValue(value: string | undefined): boolean {
  return value === undefined || value.trim() === '';
}

function resolveActiveDialect(): DatabaseDialect {
  const dialect = process.env.DB_DIALECT?.trim();

  if (!dialect) {
    throw new Error('Error de configuración: falta la variable de entorno DB_DIALECT');
  }

  if (!DATABASE_DIALECTS.includes(dialect as DatabaseDialect)) {
    throw new Error(
      'Error de configuración: DB_DIALECT debe ser mysql, postgres, mssql u oracle',
    );
  }

  return dialect as DatabaseDialect;
}

/**
 * Valida fail-fast el bloque DB_<MOTOR>_* según DB_DIALECT activo.
 * Debe ejecutarse antes de intentar conectar a la base de datos.
 */
export function validateEnvironment(): DatabaseDialect {
  const dialect = resolveActiveDialect();

  for (const variableName of DIALECT_ENV_VARS[dialect]) {
    const value = process.env[variableName];
    const isMissing = isPasswordVariable(variableName)
      ? isMissingEnvKey(value)
      : isMissingEnvValue(value);

    if (isMissing) {
      throw new Error(
        `Error de configuración: falta la variable de entorno ${variableName}`,
      );
    }
  }

  return dialect;
}
