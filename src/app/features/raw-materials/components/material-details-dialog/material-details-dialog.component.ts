import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { RawMaterial } from '../../../../shared/models';

@Component({
  selector: 'app-material-details-dialog',
  standalone: true,
  imports: [ CommonModule, RouterModule, MatDialogModule, MatButtonModule, MatIconModule, MatDividerModule, MatChipsModule,],
  templateUrl: './material-details-dialog.component.html',
  styleUrl: './material-details-dialog.component.scss',
})
export class MaterialDetailsDialogComponent {
  dialogRef = inject<MatDialogRef<MaterialDetailsDialogComponent>>(MatDialogRef);
  material = inject<RawMaterial>(MAT_DIALOG_DATA);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}

  isLowStock(): boolean {
    return this.material.currentStock <= this.material.minimumStock;
  }

  getStockStatus(): string {
    if (this.material.currentStock === 0) return 'Sin stock';
    if (this.isLowStock()) return 'Stock bajo';
    return 'Stock normal';
  }

  getStockColor(): string {
    if (this.material.currentStock === 0) return 'warn';
    if (this.isLowStock()) return 'accent';
    return 'primary';
  }

  close(): void {
    this.dialogRef.close();
  }
}
