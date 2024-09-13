import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatTable } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AppServiceService } from '../app-service.service';
import { PeriodicElement } from '../type';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, FormsModule, MatFormFieldModule, MatInputModule],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css'
})
export class TableComponent implements OnInit {
  public tableData: PeriodicElement[] = [];
  public tableDataCopy: PeriodicElement[] = [];
  public columnsNames: string[] = ['position', 'name', 'weight', 'symbol', 'actions'];

  @ViewChild(MatTable) table: MatTable<PeriodicElement> | undefined


  constructor(private appService: AppServiceService) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.tableData = this.appService.getElementData();
      this.tableDataCopy = this.tableData.map(e => ({ ...e }));
      if (this.table) {
        this.table.renderRows();
      }
    }, 2000);
  }

  editRow(element: PeriodicElement): void {
    element.editing = true;
  }

  saveRow(element: PeriodicElement): void {
    const index = this.tableDataCopy.findIndex(el => el.position === element.position);

    this.tableData = this.appService.editElement(element);
    this.tableDataCopy[index] = { ...this.tableData[index] };
    this.table?.renderRows();
  }

  cancelEdit(element: PeriodicElement): void {
    const index = this.tableDataCopy.findIndex(e => e.position === element.position);

    this.tableDataCopy[index] = { ...this.tableData[index] };
    this.table?.renderRows();
  }
}