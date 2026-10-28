import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { SessionStore } from './session.store';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const token = inject(SessionStore).token();

    if (!token) return next(req);

    const authReq = req.clone({
        setHeaders: { Authorization: `Bearer ${token}` },
    });

    return next(authReq);
};
