import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServiceUsageService {

     private apiUrl = 'http://localhost:3000/services-usage';

  constructor(private http: HttpClient) {}


  // Create a booking

// booking.service.ts
// booking.service.ts
  createServiceUsage(data: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, data);
  }

}
