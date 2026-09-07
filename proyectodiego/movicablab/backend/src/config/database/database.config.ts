import { registerAs } from '@nestjs/config';

// Dialectos soportados por el backend; cualquier otro valor de DB_DIALECT es rechazado al arrancar.
const allowedDialects = ['mysql', 'postgres', 'mssql', 'oracle'] as const;
type AllowedDialect = (typeof allowedDialects)[number];

export default registerAs('database', () => {
  const dialect = process.env.DB_DIALECT;

  // Validación en tiempo de ejecución: nunca dejar pasar un dialecto arbitrario al constructor de Sequelize.
  if (!dialect || !allowedDialects.includes(dialect as AllowedDialect)) {
    throw new Error('DB_DIALECT debe ser mysql, postgres, mssql u oracle');
  }

  // SQL Server (driver tedious) exige negociar TLS antes de autenticar.
  // encrypt: true activa el cifrado; trustServerCertificate: true evita que
  // rechace el certificado autofirmado del contenedor (equivalente al
  // "Trust server certificate" que activamos en DBeaver).
  // Los demás motores no necesitan esta opción, por eso solo se agrega
  // condicionalmente cuando el dialecto es mssql.
  const dialectOptions =
    dialect === 'mssql'
      ? {
          options: {
            encrypt: true,
            trustServerCertificate: true,
          },
        }
      : undefined;

  return {
    dialect: dialect as AllowedDialect,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    dialectOptions,
    autoLoadModels: true,
    synchronize: false,
  };
});
