import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable} from 'rxjs';

export interface Director {
  srNo: number;
  din: string;
  directorName: string;
  designation: string;
  appointmentDate: string;
  status: string;
  nationality: string;
  pan: string;
  email: string;
  phone: string;
  companyCin: string;
}

@Injectable({
  providedIn: 'root'
})
export class DirectorsService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8100/directors';

  getAll(companyId?: number, companyCin?: string, status?: string): Observable<Director[]> {
    let url = this.apiUrl;
    const params: string[] = [];
    
    if (companyId) params.push(`company_id=${companyId}`);
    if (companyCin) params.push(`company_cin=${companyCin}`);
    if (status) params.push(`status=${status}`);
    
    if (params.length > 0) {
      url += '?' + params.join('&');
    }
    
    return this.http.get<Director[]>(url);
  }

  create(director: any): Observable<any> {
    return this.http.post(this.apiUrl, director);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}

