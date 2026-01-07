export interface Usuario {
    idusuario?: number;
    id?: number; // Alias para idusuario
    nombre_usuario: string;
    nombre_completo: string;
    fullname?: string; // Alias para nombre_completo
    email: string;
    password?: string;
    rol: 'ADMIN' | 'USUARIO';
    estado?: string;
    fecha_registro?: string;
}

export interface LoginRequest {
    nombre_usuario: string;
    password: string;
}

export interface LoginResponse {
    success: boolean;
    mensaje?: string;
    token?: string;
    usuario?: Usuario;
}

export interface RegistroRequest {
    nombre: string;
    email: string;
    password: string;
    rol?: 'ADMIN' | 'USUARIO';
}

export interface AuthResponse {
    success: boolean;
    mensaje?: string;
    token?: string;
    usuario?: Usuario;
    data?: Usuario | Usuario[];
    error?: string;
}
