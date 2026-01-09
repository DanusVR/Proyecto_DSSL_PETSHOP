import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../../services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  private dashboardService = inject(DashboardService);

  stats: any = {
    ventasHoy: 0,
    citasPendientes: 0,
    productosBajoStock: [],
    productosBajoStockCount: 0,
    nuevosClientes: 0,
    totalClientes: 0
  };

  loading: boolean = true;
  error: string = '';

  ngOnInit() {
    this.cargarEstadísticas();
  }

  cargarEstadísticas() {
    this.loading = true;
    this.dashboardService.obtenerEstadisticas().subscribe({
      next: (resp) => {
        if (resp.success) {
          this.stats = resp.data;
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading stats', err);
        this.error = 'Error al cargar estadísticas';
        this.loading = false;
      }
    });
  }
}
