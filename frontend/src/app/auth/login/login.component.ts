import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LoginRequest, AuthResponse } from '../../models/usuario.model';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent {
    credentials: LoginRequest = {
        nombre_usuario: '',
        password: ''
    };
    errorMessage: string = '';
    isLoading: boolean = false;

    constructor(
        private authService: AuthService,
        private router: Router
    ) {
        // Si ya está autenticado, redirigir al dashboard
        if (this.authService.isAuthenticated()) {
            this.router.navigate(['/']);
        }
    }

    onSubmit(): void {
        if (!this.credentials.nombre_usuario || !this.credentials.password) {
            this.errorMessage = 'Por favor, complete todos los campos';
            return;
        }

        this.isLoading = true;
        this.errorMessage = '';

        this.authService.login(this.credentials).subscribe({
            next: (response: AuthResponse) => {
                if (response.success) {
                    this.router.navigate(['/']);
                } else {
                    this.errorMessage = response.mensaje || 'Error al iniciar sesión';
                }
                this.isLoading = false;
            },
            error: (error: any) => {
                // Check if backend returned a specific error message
                if (error.error && error.error.mensaje) {
                    this.errorMessage = error.error.mensaje;
                } else {
                    this.errorMessage = 'Error al conectar con el servidor';
                }
                this.isLoading = false;
            }
        });
    }
}
