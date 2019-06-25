import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/index';
import { map } from 'rxjs/internal/operators';
import { Employee } from '../entity/employee';
import { Review } from '../entity/review';

@Injectable()
export class AdminViewService {
  private _baesUrl = '/api';
  constructor(private _httpClient: HttpClient) { }

  getAllEmployees(): Observable<Employee[]> {
    return this._httpClient.get<any>(`${this._baesUrl}/employee`)
      .pipe(map(res => res.data));
  }

  addEmployee(employee: Partial<Employee>): Observable<any> {
    return this._httpClient.post<any>(`${this._baesUrl}/employee`, {employee: employee})
      .pipe(map(res => res.data));
  }

  getEmployee(id: number): Observable<Employee> {
    return this._httpClient.get<any>(`${this._baesUrl}/employee/${id}`)
      .pipe(map(res => res.data));
  }
  removeEmployee(id: number): Observable<Employee> {
    return this._httpClient.delete<any>(`${this._baesUrl}/employee/${id}`)
      .pipe(map(res => res.data));
  }

  getReviewsOfEmployee(employeeId: number): Observable<Review[]> {
    return this._httpClient.get<any>(`${this._baesUrl}/review/employee/${employeeId}`)
      .pipe(map(res => res.data));
  }

  addReview(review: Review): Observable<any> {
    return this._httpClient.post<any>(`${this._baesUrl}/review`, {review: review})
      .pipe(map(res => res.data));
  }

  updateReview(review: Review): Observable<any> {
    return this._httpClient.put<any>(`${this._baesUrl}/review/${review.id}`, {review: review})
      .pipe(map(res => res.data));
  }
}
