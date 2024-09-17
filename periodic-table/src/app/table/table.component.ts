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
import { SeachIconComponent } from "../seach-icon/seach-icon.component";
import { ProgressSpinnerComponent } from "../progress-spinner/progress-spinner.component";
import { RxState } from '@rx-angular/state';
import { Observable } from 'rxjs';

interface PeriodicTableState {
  elements: PeriodicElement[],
  tableData: PeriodicElement[],
  isLoading: boolean
}

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule,
    MatTableModule,
    MatButtonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    SeachIconComponent,
    ProgressSpinnerComponent
  ],

  templateUrl: './table.component.html',
  styleUrl: './table.component.css',
  providers: [RxState]
})

export class TableComponent implements OnInit {
  public tableData$!: Observable<PeriodicElement[]>;
  public isLoading$!: Observable<boolean>;
  public editedRows: { [key: number]: PeriodicElement } = {};
  public columnsNames: string[] = ['position', 'name', 'weight', 'symbol', 'actions'];

  @ViewChild(MatTable) table: MatTable<PeriodicElement> | undefined

  constructor(private appService: AppServiceService, private _state: RxState<PeriodicTableState>) {
    this._state.set({
      elements: [],
      tableData: [],
      isLoading: true
    });
  }

  ngOnInit(): void {
    this.isLoading$ = this._state.select('isLoading');
    this.tableData$ = this._state.select('tableData');

    this._state.connect('elements', this.appService.getElementData());
    
    setTimeout(() => {
      this._state.set({
        tableData: this._state.get('elements'),
        isLoading: false
      });
      
    }, 2000);
  }

  editRow(element: PeriodicElement): void {
    this.editedRows[element.position] = { ...element }
    this._state.set({
      elements: this._state.get('elements').map(e => e.position === element.position ? { ...e, editing: true } : e),
      tableData: this._state.get('tableData').map(e => e.position === element.position ? { ...e, editing: true } : e),
    });
  }

  saveRow(element: PeriodicElement): void {
    const editedElement = this.editedRows[element.position];

    if (editedElement.name.trim() === '' || editedElement.symbol.trim() === '' || !editedElement.weight || editedElement.weight < 0) {
      return;
    }

    this._state.set({
      elements: this._state.get('elements').map(e => e.position === editedElement.position ? { ...editedElement, editing: false } : e),
      tableData: this._state.get('tableData').map(e => e.position === editedElement.position ? { ...editedElement, editing: false } : e),
    });
    
    this.table?.renderRows();
  }

  cancelEdit(element: PeriodicElement): void {
    this._state.set({
      elements: this._state.get('elements').map(e => e.position === element.position ? { ...e, editing: false } : e),
      tableData: this._state.get('tableData').map(e => e.position === element.position ? { ...e, editing: false } : e)
    });
    this.table?.renderRows();
  }

  onFilter(filterValue: string) {
    this._state.set({ isLoading: true });

    setTimeout(() => {
      const filter = filterValue.trim().toLowerCase();
      const filteredElements = this._state.get('elements').filter(data =>
        data.name.toLowerCase().includes(filter) ||
        data.symbol.toLowerCase().includes(filter) ||
        data.weight.toString().includes(filter)
      );

      this._state.set({
        tableData: [...filteredElements],
        isLoading: false
      });

    }, 2000);
  }
}