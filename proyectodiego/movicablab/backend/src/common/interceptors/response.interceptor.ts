import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { isPaginatedResult } from '../interfaces/paginated-result.interface';
import { SuccessEnvelope } from '../interfaces/success-envelope.interface';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<SuccessEnvelope<unknown>> {
    const response = context.switchToHttp().getResponse<{ statusCode: number }>();

    return next.handle().pipe(
      map((data: unknown) => {
        const statusCode = response.statusCode ?? 200;

        if (isPaginatedResult(data)) {
          return {
            statusCode,
            message: 'OK',
            data: {
              items: data.items,
              meta: data.meta,
            },
            timestamp: new Date().toISOString(),
          };
        }

        return {
          statusCode,
          message: 'OK',
          data,
          timestamp: new Date().toISOString(),
        };
      }),
    );
  }
}
