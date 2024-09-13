import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatTable } from '@angular/material/table';
import { AppServiceService } from '../app-service.service';
import { PeriodicElement } from '../type';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [MatTableModule],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css'
})
export class TableComponent implements OnInit {
  public tableData: PeriodicElement[] = [];
  public columnsNames: string[] = ['position', 'name', 'weight', 'symbol'];

  @ViewChild(MatTable) table!: MatTable<PeriodicElement> 

  constructor(private appService: AppServiceService) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.tableData = this.appService.getElementData();
      this.table.renderRows();
    }, 2000);
  }
}
