import { Component, OnInit, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSortModule, MatSort, Sort } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatSelectModule } from '@angular/material/select';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { debounceTime, distinctUntilChanged } from 'rxjs';

import { RawMaterialsService } from '../../../../core/services/raw-materials.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { RawMaterial, RawMaterialCategory } from '../../../../shared/models/raw-material.model';

@Component({
  selector: 'app-raw-materials-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatChipsModule,
    MatSelectModule,
    MatMenuModule,
    MatDialogModule,
    MatTooltipModule,
  ],
  templateUrl: './raw-materials-list.component.html',
  styleUrl: './raw-materials-list.component.scss',
})
export class RawMaterialsListComponent implements OnInit {
  private readonly rawMaterialsService = inject(RawMaterialsService);
  private readonly notificationService = inject(NotificationService);
  private readonly dialog = inject(MatDialog);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = [
    'name',
    'category',
    'currentStock',
    'minimumStock',
    'unitCost',
    'supplier',
    'isActive',
    'actions',
  ];

  dataSource = new MatTableDataSource<RawMaterial>([]);
  categories: RawMaterialCategory[] = [];

  loading = false;
  totalElements = 0;
  pageSize = 10;
  pageIndex = 0;

  filterForm = new FormGroup({
    name: new FormControl(''),
    categoryId: new FormControl<number | null>(null),
    isActive: new FormControl<boolean | null>(null),
  });

  ngOnInit(): void {
    this.loadCategories();
    this.loadRawMaterials();
    this.setupFilters();
  }

  setupFilters(): void {
    this.filterForm.valueChanges
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe(() => {
        this.pageIndex = 0;
        this.loadRawMaterials();
      });
  }

  loadCategories(): void {
    this.rawMaterialsService.getCategories().subscribe({
      next: categories => {
        this.categories = categories;
      },
      error: error => {
        this.notificationService.showError('Error al cargar categorías');
        console.error('Error loading categories:', error);
      },
    });
  }

  loadRawMaterials(): void {
    this.loading = true;

    const filters = {
      name: this.filterForm.value.name || undefined,
      categoryId: this.filterForm.value.categoryId || undefined,
      isActive: this.filterForm.value.isActive ?? undefined,
    };

    const sort = this.sort?.active
      ? `${this.sort.active},${this.sort.direction}`
      : 'name,asc';

    this.rawMaterialsService
      .getRawMaterials(this.pageIndex, this.pageSize, sort, filters)
      .subscribe({
        next: response => {
          this.dataSource.data = response.content;
          this.totalElements = response.totalElements;
          this.loading = false;
        },
        error: error => {
          this.notificationService.showError('Error al cargar materias primas');
          console.error('Error loading raw materials:', error);
          this.loading = false;
        },
      });
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadRawMaterials();
  }

  onSortChange(sort: Sort): void {
    this.loadRawMaterials();
  }

  clearFilters(): void {
    this.filterForm.reset();
  }

  editMaterial(material: RawMaterial): void {
    // TODO: Navigate to edit page or open dialog
    console.log('Edit material:', material);
  }

  viewDetails(material: RawMaterial): void {
    // TODO: Navigate to details page or open dialog
    console.log('View details:', material);
  }

  deleteMaterial(material: RawMaterial): void {
    if (confirm(`¿Está seguro de que desea eliminar "${material.name}"?`)) {
      this.rawMaterialsService.deleteRawMaterial(material.id).subscribe({
        next: () => {
          this.notificationService.showSuccess('Materia prima eliminada correctamente');
          this.loadRawMaterials();
        },
        error: error => {
          this.notificationService.showError('Error al eliminar materia prima');
          console.error('Error deleting material:', error);
        },
      });
    }
  }

  restoreMaterial(material: RawMaterial): void {
    this.rawMaterialsService.restoreRawMaterial(material.id).subscribe({
      next: () => {
        this.notificationService.showSuccess('Materia prima restaurada correctamente');
        this.loadRawMaterials();
      },
      error: error => {
        this.notificationService.showError('Error al restaurar materia prima');
        console.error('Error restoring material:', error);
      },
    });
  }

  isLowStock(material: RawMaterial): boolean {
    return material.currentStock <= material.minimumStock;
  }

  getStockStatus(material: RawMaterial): string {
    if (material.currentStock === 0) return 'Sin stock';
    if (this.isLowStock(material)) return 'Stock bajo';
    return 'Stock normal';
  }
}
