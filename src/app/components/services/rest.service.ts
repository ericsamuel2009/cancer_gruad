import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class RestService {
  private apiUrl = 'http://localhost:8082';
  public headers:any;
  constructor (private http:HttpClient) { 
     this.headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
  }
  
  postData(formData: any): Observable<any> {
   return this.http.post(`${this.apiUrl}/breastcancer/consult`, formData, { headers: this.headers });
  }

  chatgptService(message: any) {
    return this.http.post(`${this.apiUrl}/chatgpt/chat`, message, { headers: this.headers });
  }
}
