import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, Subject, throwError } from 'rxjs/index';
import { Employee } from './entity/employee';

/**
 * TODO: this service should implement the real world authentication strategy.
 * But here we just mock a fake login
 */
@Injectable()
export class AccountService {
  private _baseUrl = '/api';
  private employees: Employee[] = [];
  public currentUser = null;
  private userSub = new Subject<Employee>();
  public get userObservable(): Observable<Employee> {
    return this.userSub.asObservable();
  }
  constructor(private httpClient: HttpClient) {
    this.httpClient.get<any>(`${this._baseUrl}/employee`)
      .subscribe(res => {
         this.employees = res.data;
         console.log(this.employees);
      });
  }

  login(name: string, password: string): Observable<Employee> {
    // this.httpClient.post<any>(`${this._baseUrl}`, {name: name, password: password})
    //   .pipe(map(res => res.data));
    this.currentUser = this.employees.find(e => {
      return e.name === name;
    });
    if (this.currentUser) {
      this.userSub.next(this.currentUser);
      return of(this.currentUser);
    } else {
      return throwError({status: 400, data: 'name or password invalid'})
    }
  }

  logout(): Observable<any> {
    this.userSub.next(null);
    this.currentUser = null;
    return of(null);
  }

}
