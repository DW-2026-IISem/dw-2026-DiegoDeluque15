import { Injectable, signal, computed } from '@angular/core';
import { AuthUser } from './user.model';

const TOKEN_KEY = 'mvc_token';
const USER_KEY = 'mvc_user';

@Injectable({ providedIn: 'root' })
export class SessionStore {
    private readonly _token = signal<string | null>(localStorage.getItem(TOKEN_KEY));
    private readonly _user = signal<AuthUser | null>(this.loadUser());

    /** Token JWT activo (o null si no hay sesión) */
    readonly token = this._token.asReadonly();

    /** Usuario autenticado (o null si no hay sesión) */
    readonly user = this._user.asReadonly();

    /** true si hay sesión activa */
    readonly isLoggedIn = computed(() => this._token() !== null);

    /** Guarda token y usuario tras login exitoso */
    save(token: string, user: AuthUser): void {
        localStorage.setItem(TOKEN_KEY, token);
        localStorage.setItem(USER_KEY, JSON.stringify(user));
        this._token.set(token);
        this._user.set(user);
    }

    /** Limpia la sesión (logout) */
    clear(): void {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        this._token.set(null);
        this._user.set(null);
    }

    private loadUser(): AuthUser | null {
        const raw = localStorage.getItem(USER_KEY);
        return raw ? (JSON.parse(raw) as AuthUser) : null;
    }
}
