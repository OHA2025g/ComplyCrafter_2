import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Form12, Form12View } from './form12.model';

@Injectable({
  providedIn: 'root'
})
export class Form12Service {
  private apiUrl = '/api/form12';

  constructor(private http: HttpClient) { }

  getForm12s(): Observable<Form12View[]> {
    return this.http.get<Form12View[]>(this.apiUrl);
  }

  getForm12(id: number): Observable<Form12View> {
    return this.http.get<Form12View>(`${this.apiUrl}/${id}`);
  }

  createForm12(form12: Form12): Observable<any> {
    return this.http.post(this.apiUrl, form12);
  }

  updateForm12(id: number, form12: Form12): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, form12);
  }

  deleteForm12(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}/Delete`);
  }

  getForm12sByCompany(companyId: number): Observable<Form12View[]> {
    return this.http.get<Form12View[]>(`${this.apiUrl}/GetByCompany/${companyId}`);
  }

  changeStatus(id: number, status: boolean): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}/Status/${status}`);
  }
}