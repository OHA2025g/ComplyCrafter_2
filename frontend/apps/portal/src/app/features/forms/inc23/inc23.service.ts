import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { INC23, INC23View } from './inc23.model';

@Injectable({
  providedIn: 'root'
})
export class INC23Service {
  private apiUrl = '/api/inc23';

  constructor(private http: HttpClient) { }

  getINC23s(): Observable<INC23View[]> {
    return this.http.get<INC23View[]>(this.apiUrl);
  }

  getINC23(id: number): Observable<INC23View> {
    return this.http.get<INC23View>(`${this.apiUrl}/${id}`);
  }

  createINC23(inc23: INC23): Observable<any> {
    return this.http.post(this.apiUrl, inc23);
  }

  updateINC23(id: number, inc23: INC23): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, inc23);
  }

  deleteINC23(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}/Delete`);
  }

  getINC23sByCompany(companyId: number): Observable<INC23View[]> {
    return this.http.get<INC23View[]>(`${this.apiUrl}/GetByCompany/${companyId}`);
  }

  changeStatus(id: number, status: boolean): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}/Status/${status}`);
  }
}