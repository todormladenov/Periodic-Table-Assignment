import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatTable } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AppServiceService } from '../app-service.service';
import { PeriodicElement } from '../type';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SeachIconComponent } from "../seach-icon/seach-icon.component";
import { ProgressSpinnerComponent } from "../progress-spinner/progress-spinner.component";

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, FormsModule, MatFormFieldModule, MatInputModule, SeachIconComponent, ProgressSpinnerComponent],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css'
})
export class TableComponent implements OnInit {
  public tableData: PeriodicElement[] = [];
  public tableDataCopy: PeriodicElement[] = [];
  public dataSource!: MatTableDataSource<PeriodicElement>
  public columnsNames: string[] = ['position', 'name', 'weight', 'symbol', 'actions'];
  public isLoading: boolean = true;

  @ViewChild(MatTable) table: MatTable<PeriodicElement> | undefined

  constructor(private appService: AppServiceService) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.tableData = this.appService.getElementData();
      this.tableDataCopy = this.tableData.map(e => ({ ...e }));
      this.dataSource = new MatTableDataSource(this.tableDataCopy);
      if (this.table) {
        this.table.renderRows();
      }
      this.isLoading = false;
    }, 2000);
  }

  editRow(element: PeriodicElement): void {
    element.editing = true;
  }

  saveRow(element: PeriodicElement): void {
    if (element.name.trim() === '' || element.symbol.trim() === '' || !element.weight || element.weight < 0) {
      return
    }

    this.tableData = this.tableData.map((e, i) => {
      if (e.position === element.position) {
        this.dataSource.data[i] = { ...element, editing: false };
        return { ...element, editing: false }
      }
      return e
    });
    element.editing = false;
    this.table?.renderRows();
  }

  cancelEdit(element: PeriodicElement): void {
    const foundElement = this.tableData.find((e, i) => {
      if (e.position === element.position) {
        this.dataSource.data[i] = { ...e, editing: false };
        return e
      }
      return undefined
    });
    const index = this.tableDataCopy.findIndex(e => e.position === element.position);

    if (foundElement) {
      this.tableDataCopy[index] = { ...foundElement, editing: false };
    }
    this.table?.renderRows();
  }

  onFilter(filterValue: string) {
    this.isLoading = true;
    setTimeout(() => {
      this.dataSource.filter = filterValue.trim().toLocaleLowerCase();
      this.tableDataCopy = [...this.dataSource.filteredData];
      this.isLoading = false;
    }, 2000)
  }
}