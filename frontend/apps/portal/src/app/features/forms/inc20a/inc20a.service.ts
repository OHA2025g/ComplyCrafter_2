import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { INC20A, INC20AView } from './inc20a.model';

@Injectable({
  providedIn: 'root'
})
export class INC20AService {
  private apiUrl = '/api/inc20a';

  constructor(private http: HttpClient) { }

  getINC20As(): Observable<INC20AView[]> {
    return this.http.get<INC20AView[]>(this.apiUrl);
  }

  getINC20A(id: number): Observable<INC20AView> {
    return this.http.get<INC20AView>(`${this.apiUrl}/${id}`);
  }

  createINC20A(inc20a: INC20A): Observable<any> {
    return this.http.post(this.apiUrl, inc20a);
  }

  updateINC20A(id: number, inc20a: INC20A): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, inc20a);
  }

  deleteINC20A(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}/Delete`);
  }

  getINC20AsByCompany(companyId: number): Observable<INC20AView[]> {
    return this.http.get<INC20AView[]>(`${this.apiUrl}/GetByCompany/${companyId}`);
  }

  changeStatus(id: number, status: boolean): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}/Status/${status}`);
  }
}