import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DIR12, DIR12View } from './dir12.model';

@Injectable({
  providedIn: 'root'
})
export class DIR12Service {
  private apiUrl = '/api/dir12';

  constructor(private http: HttpClient) { }

  getDIR12s(): Observable<DIR12View[]> {
    return this.http.get<DIR12View[]>(this.apiUrl);
  }

  getDIR12(id: number): Observable<DIR12View> {
    return this.http.get<DIR12View>(`${this.apiUrl}/${id}`);
  }

  createDIR12(dir12: DIR12): Observable<any> {
    return this.http.post(this.apiUrl, dir12);
  }

  updateDIR12(id: number, dir12: DIR12): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, dir12);
  }

  deleteDIR12(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}/Delete`);
  }

  getDIR12sByCompany(companyId: number): Observable<DIR12View[]> {
    return this.http.get<DIR12View[]>(`${this.apiUrl}/GetByCompany/${companyId}`);
  }

  changeStatus(id: number, status: boolean): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}/Status/${status}`);
  }
}