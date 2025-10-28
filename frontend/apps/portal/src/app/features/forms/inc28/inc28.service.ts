import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { INC28, INC28View } from './inc28.model';

@Injectable({
  providedIn: 'root'
})
export class INC28Service {
  private apiUrl = '/api/inc28';

  constructor(private http: HttpClient) { }

  getINC28s(): Observable<INC28View[]> {
    return this.http.get<INC28View[]>(this.apiUrl);
  }

  getINC28(id: number): Observable<INC28View> {
    return this.http.get<INC28View>(`${this.apiUrl}/${id}`);
  }

  createINC28(inc28: INC28): Observable<any> {
    return this.http.post(this.apiUrl, inc28);
  }

  updateINC28(id: number, inc28: INC28): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, inc28);
  }

  deleteINC28(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}/Delete`);
  }

  getINC28sByCompany(companyId: number): Observable<INC28View[]> {
    return this.http.get<INC28View[]>(`${this.apiUrl}/GetByCompany/${companyId}`);
  }

  changeStatus(id: number, status: boolean): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}/Status/${status}`);
  }
}