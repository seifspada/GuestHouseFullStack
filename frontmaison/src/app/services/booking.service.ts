import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Booking, BookingRequest, CreateBookingDto } from '../Model/booking.model';

@Injectable({
  providedIn: 'root'
})
export class BookingService {

   private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}


  // Create a booking

// booking.service.ts
// booking.service.ts
createBooking(data: CreateBookingDto): Observable<any> {
  return this.http.post(`${this.apiUrl}/bookings/sendBooking`, data);
}


  // Get bookings by user or all (adjust as needed)
  getBookings(): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${this.apiUrl}/bookings`);
  }

    confirmBooking(id: string): Observable<BookingRequest> {
    return this.http.patch<BookingRequest>(`${this.apiUrl}/bookings/${id}/confirm`, {});
  }

  // ✅ Reject (delete) a booking
  rejectBooking(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/bookings/${id}/reject`);
  }

    getTodayArrivals(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/today-arrivals`);
  }

  // Get single booking by ID
  getBookingById(id: string): Observable<Booking> {
    return this.http.get<Booking>(`${this.apiUrl}/${id}`);
  }

  // Update booking status (confirm, reject, etc.)
  updateBookingStatus(id: string, status: string): Observable<Booking> {
    return this.http.patch<Booking>(`${this.apiUrl}/${id}/status`, { status });
  }

  // Cancel/Delete booking
  cancelBooking(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }


}
