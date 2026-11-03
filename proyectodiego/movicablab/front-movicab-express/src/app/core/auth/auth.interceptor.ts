import { HttpErrorResponse, HttpInterceptorFn, HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, switchMap, throwError } from 'rxjs';
import { SessionStore } from './session.store';
import { AuthService } from './auth.service';

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const session = inject(SessionStore);
  const authService = inject(AuthService);
  const router = inject(Router);

  const token = session.token();
  const isAuthEndpoint =
    req.url.includes('/sesion/login') ||
    req.url.includes('/sesion/refresh') ||
    req.url.includes('/sesion/logout');

  // Si hay token y no es endpoint abierto de autenticación, inyectamos Bearer
  const authReq = token && !isAuthEndpoint
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(authReq).pipe(
    catchError((err: unknown) => {
      if (err instanceof HttpErrorResponse && err.status === 401) {
        // Si falló login o refresh, no reintentamos: expulsamos a login
        if (isAuthEndpoint || !session.refreshToken()) {
          session.clear();
          router.navigate(['/login']);
          return throwError(() => err);
        }

        // Token expirado: intentamos rotación automática con refresh token
        return authService.refresh().pipe(
          switchMap((newTokens) => {
            const retriedReq = req.clone({
              setHeaders: { Authorization: `Bearer ${newTokens.access_token}` },
            });
            return next(retriedReq);
          }),
          catchError((refreshErr) => {
            // El refresh token también expiró o fue revocado
            session.clear();
            router.navigate(['/login']);
            return throwError(() => refreshErr);
          })
        );
      }

      return throwError(() => err);
    })
  );
};
