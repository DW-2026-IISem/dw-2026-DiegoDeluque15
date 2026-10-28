/** Payload que envía el cliente al hacer login */
export interface LoginRequest {
    identifier: string;
    password: string;
}

/** Respuesta del backend al autenticar correctamente */
export interface LoginResponse {
    access_token: string;
    refresh_token?: string;
    expires_in?: number;
}

/** Payload decodificado del JWT (claims) */
export interface JwtPayload {
    sub?: string;
    userId?: string | number;
    email?: string;
    username?: string;
    role?: string;
    iat?: number;
    exp?: number;
}

