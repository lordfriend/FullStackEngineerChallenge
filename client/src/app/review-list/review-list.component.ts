import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatPaginator, MatSort, MatTable } from '@angular/material';
import { AdminViewService } from '../admin-view/admin-view.service';
import { Review } from '../entity/review';
import { ReviewDialogComponent } from './review-dialog/review-dialog.component';
import { ReviewListDataSource } from './review-list-datasource';

@Component({
  selector: 'app-review-list',
  templateUrl: './review-list.component.html',
  styleUrls: ['./review-list.component.less']
})
export class ReviewListComponent implements AfterViewInit, OnInit {
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;
  @ViewChild(MatTable, {static: false}) table: MatTable<Review>;
  dataSource: ReviewListDataSource;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['id', 'date', 'performance', 'feedback', 'status', 'reviewed_by'];

  @Input()
  employeeId: number;

  @Input()
  status: number;

  @Input()
  mode = 'admin';

  constructor(private _adminViewService: AdminViewService,
              public dialog: MatDialog) {
  }


  addReview() {
    const dialogRef = this.dialog.open(ReviewDialogComponent, {
      width: '750px',
      data: {
        review: {employee_id: this.employeeId},
        mode: this.mode
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.dataSource.refresh();
    });
  }

  handleRowClick(row: Review): void {
    const dialogRef = this.dialog.open(ReviewDialogComponent, {
      width: '750px',
      data: {
        review:row,
        mode: this.mode
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.dataSource.refresh();
    });
  }

  ngOnInit() {
    this.dataSource = new ReviewListDataSource(this._adminViewService, this.employeeId, this.status);
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
  }
}
