import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { MainLayoutComponent } from './shared/components/main-layout.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    {
        path: '',
        component: MainLayoutComponent,
        canActivate: [authGuard],
        children: [
            { path: 'dashboard', loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent) },
            {
                path: 'productos',
                loadComponent: () => import('./components/producto/producto-list/producto-list.component').then(m => m.ProductoListComponent)
            },
            {
                path: 'clientes',
                loadComponent: () => import('./components/cliente/cliente-list/cliente-list.component').then(m => m.ClienteListComponent)
            },
            {
                path: 'ventas',
                loadComponent: () => import('./components/venta/venta-list/venta-list.component').then(m => m.VentaListComponent)
            },
            {
                path: 'categorias',
                loadComponent: () => import('./components/categoria/categoria-list/categoria-list.component').then(m => m.CategoriaListComponent)
            },
            {
                path: 'proveedores',
                loadComponent: () => import('./components/proveedor/proveedor-list/proveedor-list.component').then(m => m.ProveedorListComponent)
            },
            {
                path: 'mascotas',
                loadComponent: () => import('./components/mascota/mascota-list/mascota-list.component').then(m => m.MascotaListComponent)
            },
            {
                path: 'servicios',
                loadComponent: () => import('./components/servicio/servicio-list/servicio-list.component').then(m => m.ServicioListComponent)
            },
            {
                path: 'usuarios',
                loadComponent: () => import('./components/usuario/usuario-list/usuario-list.component').then(m => m.UsuarioListComponent)
            },
            {
                path: 'citas',
                loadComponent: () => import('./components/cita/cita-list/cita-list.component').then(m => m.CitaListComponent)
            },
            {
                path: 'compras',
                loadComponent: () => import('./components/compra/compra-list/compra-list.component').then(m => m.CompraListComponent)
            },
            {
                path: 'historial',
                loadComponent: () => import('./components/historial/historial-list/historial-list.component').then(m => m.HistorialListComponent)
            },
            {
                path: 'reportes/ventas',
                loadComponent: () => import('./components/reportes/reporte-ventas/reporte-ventas.component').then(m => m.ReporteVentasComponent)
            },
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
        ]
    },
    { path: '**', redirectTo: 'login' }
];
