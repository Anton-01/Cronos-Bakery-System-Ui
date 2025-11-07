import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip';

interface MenuItem {
  label: string;
  icon: string;
  route: string;
  roles?: string[];
  children?: MenuItem[];
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    MatIconModule,
    MatListModule,
    MatTooltipModule,
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  @Input() isOpen = true;

  menuItems: MenuItem[] = [
    {
      label: 'Dashboard',
      icon: 'dashboard',
      route: '/dashboard',
    },
    {
      label: 'Materias Primas',
      icon: 'inventory_2',
      route: '/raw-materials',
    },
    {
      label: 'Recetas',
      icon: 'menu_book',
      route: '/recipes',
    },
    {
      label: 'Cotizaciones',
      icon: 'request_quote',
      route: '/quotes',
    },
    {
      label: 'Inventario',
      icon: 'warehouse',
      route: '/inventory',
    },
    {
      label: 'Reportes',
      icon: 'assessment',
      route: '/reports',
    },
    {
      label: 'Configuración',
      icon: 'settings',
      route: '/settings',
    },
  ];
}
