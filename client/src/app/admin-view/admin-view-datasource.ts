import { DataSource } from '@angular/cdk/collections';
import { MatPaginator, MatSort } from '@angular/material';
import { switchMap, tap } from 'rxjs/internal/operators';
import { map } from 'rxjs/operators';
import { Observable, merge, BehaviorSubject } from 'rxjs';
import { Employee } from '../entity/employee';
import { AdminViewService } from './admin-view.service';

/**
 * Data source for the AdminView view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class AdminViewDataSource extends DataSource<Employee> {
  data: Employee[] = [];
  paginator: MatPaginator;
  sort: MatSort;
  private _refreshSubject = new BehaviorSubject<any>(1);

  constructor(private _adminViewService: AdminViewService) {
    super();
  }

  /**
   * Refresh the datasource manually
   */
  refresh() {
    this._refreshSubject.next(1);
  }

  /**
   * Connect this data source to the table. The table will only update when
   * the returned stream emits new items.
   * @returns A stream of the items to be rendered.
   */
  connect(): Observable<Employee[]> {
    // Combine everything that affects the rendered data into one update
    // stream for the data-table to consume.
    const dataMutations = [
      this._refreshSubject.pipe(switchMap(() => {
        return this._adminViewService.getAllEmployees().pipe(tap((employees) => {
          this.data = employees;
        }));
      })),
      this.paginator.page,
      this.sort.sortChange
    ];

    return merge(...dataMutations).pipe(map(() => {
      return this.getPagedData(this.getSortedData([...this.data]));
    }));
  }

  /**
   *  Called when the table is being destroyed. Use this function, to clean up
   * any open connections or free any held resources that were set up during connect.
   */
  disconnect() {}

  /**
   * Paginate the data (client-side). If you're using server-side pagination,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getPagedData(data: Employee[]) {
    const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
    return data.splice(startIndex, this.paginator.pageSize);
  }

  /**
   * Sort the data (client-side). If you're using server-side sorting,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getSortedData(data: Employee[]) {
    if (!this.sort.active || this.sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      const isAsc = this.sort.direction === 'asc';
      switch (this.sort.active) {
        case 'name': return compare(a.name, b.name, isAsc);
        case 'id': return compare(+a.id, +b.id, isAsc);
        default: return 0;
      }
    });
  }
}

/** Simple sort comparator for example ID/Name columns (for client-side sorting). */
function compare(a, b, isAsc) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
