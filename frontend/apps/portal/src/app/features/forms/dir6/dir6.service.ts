import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DIR6, DIR6View } from './dir6.model';

@Injectable({
  providedIn: 'root'
})
export class DIR6Service {
  private apiUrl = '/api/dir6';

  constructor(private http: HttpClient) { }

  getDIR6s(): Observable<DIR6View[]> {
    return this.http.get<DIR6View[]>(this.apiUrl);
  }

  getDIR6(id: number): Observable<DIR6View> {
    return this.http.get<DIR6View>(`${this.apiUrl}/${id}`);
  }

  createDIR6(dir6: DIR6): Observable<any> {
    return this.http.post(this.apiUrl, dir6);
  }

  updateDIR6(id: number, dir6: DIR6): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, dir6);
  }

  deleteDIR6(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}/Delete`);
  }

  getDIR6sByCompany(companyId: number): Observable<DIR6View[]> {
    return this.http.get<DIR6View[]>(`${this.apiUrl}/GetByCompany/${companyId}`);
  }

  changeStatus(id: number, status: boolean): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}/Status/${status}`);
  }
}