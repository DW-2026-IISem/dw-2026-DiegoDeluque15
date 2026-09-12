import { Controller, Get } from '@nestjs/common';

/**
 * HealthController — ISS-01 / ISS-02.
 * Devuelve datos crudos; el ResponseInterceptor global construye el envelope.
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
  check(): { status: string } {
    return { status: 'ok' };
  }
}
