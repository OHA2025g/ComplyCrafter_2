import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DIR3, DIR3View } from './dir3.model';

@Injectable({
  providedIn: 'root'
})
export class DIR3Service {
  private apiUrl = '/api/dir3';

  constructor(private http: HttpClient) { }

  getDIR3s(): Observable<DIR3View[]> {
    return this.http.get<DIR3View[]>(this.apiUrl);
  }

  getDIR3(id: number): Observable<DIR3View> {
    return this.http.get<DIR3View>(`${this.apiUrl}/${id}`);
  }

  createDIR3(dir3: DIR3): Observable<any> {
    return this.http.post(this.apiUrl, dir3);
  }

  updateDIR3(id: number, dir3: DIR3): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, dir3);
  }

  deleteDIR3(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}/Delete`);
  }

  getDIR3sByCompany(companyId: number): Observable<DIR3View[]> {
    return this.http.get<DIR3View[]>(`${this.apiUrl}/GetByCompany/${companyId}`);
  }

  changeStatus(id: number, status: boolean): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}/Status/${status}`);
  }
}