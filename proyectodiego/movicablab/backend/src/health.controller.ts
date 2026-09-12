import { Controller, Get } from '@nestjs/common';

interface SuccessEnvelope<T> {
  statusCode: number;
  message: string;
  data: T;
  timestamp: string;
}

/**
 * HealthController — ISS-01.
 * Devuelve el envelope de éxito definido en docs/Prompt.md §5.
 * El interceptor global de respuesta llegará en ISS-02; aquí se construye
 * el envelope manualmente solo para este endpoint.
 *
 * GET /api/health → 200
 * {
 *   "statusCode": 200,
 *   "message": "OK",
 *   "data": { "status": "ok" },
 *   "timestamp": "<ISO>"
 * }
 */
@Controller('health')
export class HealthController {
  @Get()
  check(): SuccessEnvelope<{ status: string }> {
    return {
      statusCode: 200,
      message: 'OK',
      data: { status: 'ok' },
      timestamp: new Date().toISOString(),
    };
  }
}
