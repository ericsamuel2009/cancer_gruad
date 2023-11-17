import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class RestService {
  private apiUrl = 'urlapi'; 

  constructor (private http:HttpClient) { }

  getData(): Observable<any> {
    return this.http.get(`${this.apiUrl}`);
  }
  postData(formData: any): Observable<any> {
    const url = `${this.apiUrl}`; 

   return this.http.post(url, formData);
  }
}
