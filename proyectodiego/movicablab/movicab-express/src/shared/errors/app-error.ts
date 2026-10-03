/**
 * Error tipado que lleva el código HTTP destino.
 *
 * Los controllers lo lanzan; `sendError` lo detecta y usa su `status` en la
 * respuesta. Cualquier otro `Error` se trata como 500 (error interno inesperado).
 */
export class AppError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly details?: unknown
  ) {
    super(message);
    this.name = "AppError";
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError);
    }
  }
}
