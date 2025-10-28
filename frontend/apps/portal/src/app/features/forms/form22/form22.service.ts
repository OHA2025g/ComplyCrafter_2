import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Form22, Form22View } from './form22.model';

@Injectable({
  providedIn: 'root'
})
export class Form22Service {
  private apiUrl = '/api/form22';

  constructor(private http: HttpClient) { }

  getForm22s(): Observable<Form22View[]> {
    return this.http.get<Form22View[]>(this.apiUrl);
  }

  getForm22(id: number): Observable<Form22View> {
    return this.http.get<Form22View>(`${this.apiUrl}/${id}`);
  }

  createForm22(form22: Form22): Observable<any> {
    return this.http.post(this.apiUrl, form22);
  }

  updateForm22(id: number, form22: Form22): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, form22);
  }

  deleteForm22(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}/Delete`);
  }

  getForm22sByCompany(companyId: number): Observable<Form22View[]> {
    return this.http.get<Form22View[]>(`${this.apiUrl}/GetByCompany/${companyId}`);
  }

  changeStatus(id: number, status: boolean): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}/Status/${status}`);
  }
}