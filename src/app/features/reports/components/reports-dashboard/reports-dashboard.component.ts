import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';

@Component({
  selector: 'app-reports-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatGridListModule,
  ],
  templateUrl: './reports-dashboard.component.html',
  styleUrl: './reports-dashboard.component.scss',
})
export class ReportsDashboardComponent {
  // Placeholder component for reports dashboard
  reports = [
    {
      title: 'Ventas por Período',
      description: 'Reporte de ventas agrupadas por día, semana o mes',
      icon: 'timeline',
    },
    {
      title: 'Productos Más Vendidos',
      description: 'Top de productos con mayores ventas',
      icon: 'trending_up',
    },
    {
      title: 'Inventario Actual',
      description: 'Estado actual del inventario de materias primas',
      icon: 'inventory_2',
    },
    {
      title: 'Costos de Producción',
      description: 'Análisis de costos por receta y producto',
      icon: 'attach_money',
    },
    {
      title: 'Cotizaciones',
      description: 'Resumen de cotizaciones por estado',
      icon: 'request_quote',
    },
    {
      title: 'Rentabilidad',
      description: 'Análisis de rentabilidad por producto',
      icon: 'pie_chart',
    },
  ];
}
