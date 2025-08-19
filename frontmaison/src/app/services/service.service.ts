import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { Service } from '../Model/service.model';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {

 private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}



createService(data: FormData): Observable<Service> {
    return this.http.post<Service>(`${this.apiUrl}/services`, data);
  }

  
  getServices(): Observable<Service[]> {
    return this.http.get<Service[]>(`${this.apiUrl}/services`);
  }
  
  getServiceById(id: string): Observable<Service> {
    return this.http.get<Service>(`${this.apiUrl}/services/${id}`).pipe(
      tap((service) => {
        console.log(`Service with ID ${id} fetched:`, service);
        if (!service) {
          console.warn(`No service found with ID ${id}`);
        }
      }),
      catchError((error) => {
        console.error(`Error fetching service with ID ${id}:`, error);
        return throwError(() => error);
      })
    );
  }
  
  deleteService(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/services/${id}`).pipe(
      tap(() => console.log(`Deleted service with id: ${id}`)),
      catchError((error) => {
        console.error('Error deleting service:', error);
        return throwError(() => error);
      })
    );
  }

}
