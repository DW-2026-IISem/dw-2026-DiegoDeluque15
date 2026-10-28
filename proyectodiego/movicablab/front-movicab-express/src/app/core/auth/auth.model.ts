/** Payload que envía el cliente al hacer login */
export interface LoginRequest {
    email: string;
    password: string;
}

/** Respuesta del backend al autenticar correctamente */
export interface LoginResponse {
    token: string;
    expiresIn: number; // segundos
}

/** Payload decodificado del JWT (claims) */
export interface JwtPayload {
    sub: string;       // userId
    email: string;
    role: string;
    iat: number;
    exp: number;
}
