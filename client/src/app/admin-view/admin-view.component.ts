import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatPaginator, MatSort, MatTable } from '@angular/material';
import { AlertDialogComponent } from '../alert-dialog/alert-dialog.component';
import { Employee } from '../entity/employee';
import { AdminViewDataSource } from './admin-view-datasource';
import { AdminViewService } from './admin-view.service';
import { EmployeeDialogComponent } from './employee-dialog/employee-dialog.component';

@Component({
  selector: 'app-admin-view',
  templateUrl: './admin-view.component.html',
  styleUrls: ['./admin-view.component.less']
})
export class AdminViewComponent implements AfterViewInit, OnInit {
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;
  @ViewChild(MatTable, {static: false}) table: MatTable<Employee>;
  dataSource: AdminViewDataSource;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['id', 'name', 'level'];
  levelName = {1: 'Staff', 2: 'Admin'};

  constructor(private _adminViewService: AdminViewService,
              public dialog: MatDialog) {
  }

  addEmployee(): void {
    const dialogRef = this.dialog.open(EmployeeDialogComponent, {
      width: '750px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.dataSource.refresh();
    });
  }

  ngOnInit() {
    this.dataSource = new AdminViewDataSource(this._adminViewService);
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
  }
}
