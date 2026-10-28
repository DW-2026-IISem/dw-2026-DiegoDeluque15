import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoginRequest, LoginResponse, JwtPayload } from './auth.model';
import { AuthUser } from './user.model';
import { SessionStore } from './session.store';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private readonly http = inject(HttpClient);
    private readonly session = inject(SessionStore);
    private readonly base = environment.apiUrl;

    /** Inicia sesión y persiste token + usuario */
    login(credentials: LoginRequest): Observable<AuthUser> {
        return this.http
            .post<LoginResponse>(`${this.base}/sesion/login`, credentials)
            .pipe(
                map((res) => {
                    const payload = this.decodeJwt(res.access_token);
                    const user: AuthUser = {
                        id: String(payload.sub ?? payload.userId ?? '1'),
                        email: payload.email ?? credentials.identifier,
                        role: (payload.role as AuthUser['role']) ?? 'admin',
                    };
                    this.session.save(res.access_token, user);
                    return user;
                }),
            );
    }

    /** Cierra sesión y limpia el store */
    logout(): void {
        this.session.clear();
    }

    /** Decodifica el payload del JWT sin verificar firma */
    private decodeJwt(token: string): JwtPayload {
        try {
            const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
            return JSON.parse(atob(base64)) as JwtPayload;
        } catch {
            return {};
        }
    }
}
