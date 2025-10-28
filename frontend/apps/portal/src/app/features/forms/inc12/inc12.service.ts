import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { INC12, INC12View } from './inc12.model';

@Injectable({
  providedIn: 'root'
})
export class INC12Service {
  private apiUrl = '/api/inc12';

  constructor(private http: HttpClient) { }

  getINC12s(): Observable<INC12View[]> {
    return this.http.get<INC12View[]>(this.apiUrl);
  }

  getINC12(id: number): Observable<INC12View> {
    return this.http.get<INC12View>(`${this.apiUrl}/${id}`);
  }

  createINC12(inc12: INC12): Observable<any> {
    return this.http.post(this.apiUrl, inc12);
  }

  updateINC12(id: number, inc12: INC12): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, inc12);
  }

  deleteINC12(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}/Delete`);
  }

  getINC12sByCompany(companyId: number): Observable<INC12View[]> {
    return this.http.get<INC12View[]>(`${this.apiUrl}/GetByCompany/${companyId}`);
  }

  changeStatus(id: number, status: boolean): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}/Status/${status}`);
  }
}