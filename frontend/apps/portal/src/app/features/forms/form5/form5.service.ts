import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Form5, Form5View } from './form5.model';

@Injectable({
  providedIn: 'root'
})
export class Form5Service {
  private apiUrl = '/api/form5';

  constructor(private http: HttpClient) { }

  getForm5s(): Observable<Form5View[]> {
    return this.http.get<Form5View[]>(this.apiUrl);
  }

  getForm5(id: number): Observable<Form5View> {
    return this.http.get<Form5View>(`${this.apiUrl}/${id}`);
  }

  createForm5(form5: Form5): Observable<any> {
    return this.http.post(this.apiUrl, form5);
  }

  updateForm5(id: number, form5: Form5): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, form5);
  }

  deleteForm5(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}/Delete`);
  }

  getForm5sByCompany(companyId: number): Observable<Form5View[]> {
    return this.http.get<Form5View[]>(`${this.apiUrl}/GetByCompany/${companyId}`);
  }

  changeStatus(id: number, status: boolean): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}/Status/${status}`);
  }
}