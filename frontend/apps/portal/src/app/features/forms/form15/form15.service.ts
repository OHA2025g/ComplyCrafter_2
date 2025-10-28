import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Form15, Form15View } from './form15.model';

@Injectable({
  providedIn: 'root'
})
export class Form15Service {
  private apiUrl = '/api/form15';

  constructor(private http: HttpClient) { }

  getForm15s(): Observable<Form15View[]> {
    return this.http.get<Form15View[]>(this.apiUrl);
  }

  getForm15(id: number): Observable<Form15View> {
    return this.http.get<Form15View>(`${this.apiUrl}/${id}`);
  }

  createForm15(form15: Form15): Observable<any> {
    return this.http.post(this.apiUrl, form15);
  }

  updateForm15(id: number, form15: Form15): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, form15);
  }

  deleteForm15(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}/Delete`);
  }

  getForm15sByCompany(companyId: number): Observable<Form15View[]> {
    return this.http.get<Form15View[]>(`${this.apiUrl}/GetByCompany/${companyId}`);
  }

  changeStatus(id: number, status: boolean): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}/Status/${status}`);
  }
}