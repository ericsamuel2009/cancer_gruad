import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class RestService {
  private apiUrl = 'http://localhost:8082/breastcancer'; 

  constructor (private http:HttpClient) { }

  getData(): Observable<any> {
    return this.http.get(`${this.apiUrl}/default`);
  }
  postData(formData: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    const url = `${this.apiUrl}`; 

   return this.http.post(`${this.apiUrl}/consult`, formData, { headers: headers });
  }
}
