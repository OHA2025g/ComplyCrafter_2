import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { INC4, INC4View } from './inc4.model';

@Injectable({
  providedIn: 'root'
})
export class INC4Service {
  private apiUrl = '/api/inc4';

  constructor(private http: HttpClient) { }

  getINC4s(): Observable<INC4View[]> {
    return this.http.get<INC4View[]>(this.apiUrl);
  }

  getINC4(id: number): Observable<INC4View> {
    return this.http.get<INC4View>(`${this.apiUrl}/${id}`);
  }

  createINC4(inc4: INC4): Observable<any> {
    return this.http.post(this.apiUrl, inc4);
  }

  updateINC4(id: number, inc4: INC4): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, inc4);
  }

  deleteINC4(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}/Delete`);
  }

  getINC4sByCompany(companyId: number): Observable<INC4View[]> {
    return this.http.get<INC4View[]>(`${this.apiUrl}/GetByCompany/${companyId}`);
  }

  changeStatus(id: number, status: boolean): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}/Status/${status}`);
  }
}