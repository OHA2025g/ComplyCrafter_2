import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { INC24, INC24View } from './inc24.model';

@Injectable({
  providedIn: 'root'
})
export class INC24Service {
  private apiUrl = '/api/inc24';

  constructor(private http: HttpClient) { }

  getINC24s(): Observable<INC24View[]> {
    return this.http.get<INC24View[]>(this.apiUrl);
  }

  getINC24(id: number): Observable<INC24View> {
    return this.http.get<INC24View>(`${this.apiUrl}/${id}`);
  }

  createINC24(inc24: INC24): Observable<any> {
    return this.http.post(this.apiUrl, inc24);
  }

  updateINC24(id: number, inc24: INC24): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, inc24);
  }

  deleteINC24(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}/Delete`);
  }

  getINC24sByCompany(companyId: number): Observable<INC24View[]> {
    return this.http.get<INC24View[]>(`${this.apiUrl}/GetByCompany/${companyId}`);
  }

  changeStatus(id: number, status: boolean): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}/Status/${status}`);
  }
}