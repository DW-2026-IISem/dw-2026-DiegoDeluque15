export enum DatabaseDialect {
  MYSQL = 'mysql',
  POSTGRES = 'postgres',
  MSSQL = 'mssql',
  ORACLE = 'oracle',
}

export const DATABASE_DIALECTS = Object.values(DatabaseDialect);
