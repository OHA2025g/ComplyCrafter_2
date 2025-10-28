import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Form23, Form23View } from './form23.model';

@Injectable({
  providedIn: 'root'
})
export class Form23Service {
  private apiUrl = '/api/form23';

  constructor(private http: HttpClient) { }

  getForm23s(): Observable<Form23View[]> {
    return this.http.get<Form23View[]>(this.apiUrl);
  }

  getForm23(id: number): Observable<Form23View> {
    return this.http.get<Form23View>(`${this.apiUrl}/${id}`);
  }

  createForm23(form23: Form23): Observable<any> {
    return this.http.post(this.apiUrl, form23);
  }

  updateForm23(id: number, form23: Form23): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, form23);
  }

  deleteForm23(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}/Delete`);
  }

  getForm23sByCompany(companyId: number): Observable<Form23View[]> {
    return this.http.get<Form23View[]>(`${this.apiUrl}/GetByCompany/${companyId}`);
  }

  changeStatus(id: number, status: boolean): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}/Status/${status}`);
  }
}