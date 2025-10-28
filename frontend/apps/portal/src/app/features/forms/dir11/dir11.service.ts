import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DIR11, DIR11View } from './dir11.model';

@Injectable({
  providedIn: 'root'
})
export class DIR11Service {
  private apiUrl = '/api/dir11';

  constructor(private http: HttpClient) { }

  getDIR11s(): Observable<DIR11View[]> {
    return this.http.get<DIR11View[]>(this.apiUrl);
  }

  getDIR11(id: number): Observable<DIR11View> {
    return this.http.get<DIR11View>(`${this.apiUrl}/${id}`);
  }

  createDIR11(dir11: DIR11): Observable<any> {
    return this.http.post(this.apiUrl, dir11);
  }

  updateDIR11(id: number, dir11: DIR11): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, dir11);
  }

  deleteDIR11(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}/Delete`);
  }

  getDIR11sByCompany(companyId: number): Observable<DIR11View[]> {
    return this.http.get<DIR11View[]>(`${this.apiUrl}/GetByCompany/${companyId}`);
  }

  changeStatus(id: number, status: boolean): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}/Status/${status}`);
  }
}