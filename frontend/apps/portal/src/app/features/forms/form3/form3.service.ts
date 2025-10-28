import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Form3, Form3View } from './form3.model';

@Injectable({
  providedIn: 'root'
})
export class Form3Service {
  private apiUrl = '/api/form3';

  constructor(private http: HttpClient) { }

  getForm3s(): Observable<Form3View[]> {
    return this.http.get<Form3View[]>(this.apiUrl);
  }

  getForm3(id: number): Observable<Form3View> {
    return this.http.get<Form3View>(`${this.apiUrl}/${id}`);
  }

  createForm3(form3: Form3): Observable<any> {
    return this.http.post(this.apiUrl, form3);
  }

  updateForm3(id: number, form3: Form3): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, form3);
  }

  deleteForm3(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}/Delete`);
  }

  getForm3sByCompany(companyId: number): Observable<Form3View[]> {
    return this.http.get<Form3View[]>(`${this.apiUrl}/GetByCompany/${companyId}`);
  }

  changeStatus(id: number, status: boolean): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}/Status/${status}`);
  }
}