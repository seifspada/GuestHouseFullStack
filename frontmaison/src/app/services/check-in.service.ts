import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CheckIn } from '../Model/check-in.model';

@Injectable({
  providedIn: 'root'
})
export class CheckInService {

   private apiUrl = 'http://localhost:3000/check-in';

  constructor(private http: HttpClient) {}


     getAllPresentUsers(): Observable<CheckIn[]> {
    return this.http.get<CheckIn[]>(`${this.apiUrl}/present`);
  }
  // Create a booking

// booking.service.ts
// booking.service.ts
  createCheckIn(data: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, data);
  }


  // Get bookings by user or all (adjust as needed)
  getCheckIn(): Observable<CheckIn[]> {
    return this.http.get<CheckIn[]>(`${this.apiUrl}`);
  }


    getAllCheckIns(): Observable<CheckIn[]> {
    return this.http.get<CheckIn[]>(`${this.apiUrl}/all`);
  }



}