import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslateModule } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';

import { RawMaterialsService } from '../../../../core/services/raw-materials.service';
import { RawMaterialCategory } from '../../../../shared/models';
import { CategoryFormDialogComponent } from '../category-form-dialog/category-form-dialog.component';

@Component({
  selector: 'app-categories-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    TranslateModule,
  ],
  templateUrl: './categories-dialog.component.html',
  styleUrls: ['./categories-dialog.component.scss'],
})
export class CategoriesDialogComponent implements OnInit {
  private readonly dialogRef = inject(MatDialogRef<CategoriesDialogComponent>);
  private readonly dialog = inject(MatDialog);
  private readonly rawMaterialsService = inject(RawMaterialsService);
  private readonly toastr = inject(ToastrService);

  categories: RawMaterialCategory[] = [];
  loading = false;
  displayedColumns = ['name', 'description', 'isSystemDefault', 'actions'];

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.loading = true;
    this.rawMaterialsService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        this.toastr.error('Error al cargar categorías');
        this.loading = false;
      },
    });
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(CategoryFormDialogComponent, {
      width: '500px',
      data: { category: null },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadCategories();
      }
    });
  }

  openEditDialog(category: RawMaterialCategory): void {
    const dialogRef = this.dialog.open(CategoryFormDialogComponent, {
      width: '500px',
      data: { category },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadCategories();
      }
    });
  }

  deleteCategory(category: RawMaterialCategory): void {
    if (category.isSystemDefault) {
      this.toastr.warning('No se puede eliminar una categoría del sistema');
      return;
    }

    if (confirm(`¿Está seguro de eliminar la categoría "${category.name}"?`)) {
      this.rawMaterialsService.deleteCategory(category.id).subscribe({
        next: () => {
          this.toastr.success('Categoría eliminada exitosamente');
          this.loadCategories();
        },
        error: (error) => {
          console.error('Error deleting category:', error);
          this.toastr.error('Error al eliminar categoría');
        },
      });
    }
  }

  close(): void {
    this.dialogRef.close();
  }
}
