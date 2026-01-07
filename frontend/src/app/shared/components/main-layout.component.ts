import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="layout-container">
      <aside class="sidebar">
        <div class="logo">
          <h2>PetShop</h2>
        </div>
        <nav>
          <ul>
            <li><a routerLink="/dashboard" routerLinkActive="active">Dashboard</a></li>
            <li><a routerLink="/usuarios" routerLinkActive="active">Usuarios</a></li>
            <li><a routerLink="/clientes" routerLinkActive="active">Clientes</a></li>
            <li><a routerLink="/mascotas" routerLinkActive="active">Mascotas</a></li>
            <li><a routerLink="/productos" routerLinkActive="active">Productos</a></li>
            <li><a routerLink="/servicios" routerLinkActive="active">Servicios</a></li>
            <li><a routerLink="/categorias" routerLinkActive="active">Categorias</a></li>
            <li><a routerLink="/proveedores" routerLinkActive="active">Proveedores</a></li>
            
            <li><a routerLink="/ventas" routerLinkActive="active">Ventas</a></li>

            <li><a routerLink="/compras" routerLinkActive="active">Compras</a></li>

            <li><a routerLink="/citas" routerLinkActive="active">Citas</a></li>
            <li><a routerLink="/historial" routerLinkActive="active">Historial Médico</a></li>
            <li><a routerLink="/reportes/ventas" routerLinkActive="active">Reportes</a></li>
          </ul>
        </nav>
        <div class="user-info">
            <p>{{ (currentUser$ | async)?.fullname }}</p>
            <button (click)="logout()">Cerrar Sesión</button>
        </div>
      </aside>
      <main class="content">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .layout-container { display: flex; height: 100vh; font-family: 'Inter', sans-serif; }
    .sidebar { width: 250px; background: #2d3748; color: white; display: flex; flex-direction: column; }
    .logo { padding: 1.5rem; border-bottom: 1px solid #4a5568; }
    .logo h2 { margin: 0; font-size: 1.5rem; color: #a3bffa; }
    nav { flex: 1; overflow-y: auto; padding-top: 1rem; }
    nav ul { list-style: none; padding: 0; margin: 0; }
    nav li a { display: block; padding: 0.75rem 1.5rem; color: #cbd5e0; text-decoration: none; transition: background 0.2s; }
    nav li a:hover, nav li a.active { background: #4a5568; color: white; border-left: 4px solid #667eea; }
    
    .submenu { background: #1a202c; }
    .submenu li a { padding-left: 2.5rem; font-size: 0.95rem; border-left: none; }
    .submenu li a:hover, .submenu li a.active { border-left: 4px solid #667eea; }
    .arrow { font-size: 0.8rem; }

    .user-info { padding: 1.5rem; border-top: 1px solid #4a5568; background: #1a202c; }
    .user-info p { margin-bottom: 0.5rem; font-size: 0.9rem; color: #a0aec0; }
    .user-info button { width: 100%; padding: 0.5rem; background: #e53e3e; color: white; border: none; border-radius: 4px; cursor: pointer; }
    .content { flex: 1; background: #f7fafc; overflow-y: auto; padding: 2rem; }
  `]
})
export class MainLayoutComponent {
  authService = inject(AuthService);
  router = inject(Router);
  currentUser$ = this.authService.currentUser$;



  logout() {
    this.authService.logout();
  }
}
