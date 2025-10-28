import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { INC22, INC22View } from './inc22.model';

@Injectable({
  providedIn: 'root'
})
export class INC22Service {
  private apiUrl = '/api/inc22';

  constructor(private http: HttpClient) { }

  getINC22s(): Observable<INC22View[]> {
    return this.http.get<INC22View[]>(this.apiUrl);
  }

  getINC22(id: number): Observable<INC22View> {
    return this.http.get<INC22View>(`${this.apiUrl}/${id}`);
  }

  createINC22(inc22: INC22): Observable<any> {
    return this.http.post(this.apiUrl, inc22);
  }

  updateINC22(id: number, inc22: INC22): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, inc22);
  }

  deleteINC22(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}/Delete`);
  }

  getINC22sByCompany(companyId: number): Observable<INC22View[]> {
    return this.http.get<INC22View[]>(`${this.apiUrl}/GetByCompany/${companyId}`);
  }

  changeStatus(id: number, status: boolean): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}/Status/${status}`);
  }
}