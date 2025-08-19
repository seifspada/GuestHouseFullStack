import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { Bungalow } from '../Model/bungalow.model';

@Injectable({
  providedIn: 'root'
})
export class BungalowService {

    
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

createBungalow(data: FormData): Observable<any> {
  return this.http.post(`${this.apiUrl}/bungalows`, data);
}

getBungalows(): Observable<Bungalow[]> {
  return this.http.get<Bungalow[]>(`${this.apiUrl}/bungalows`);
}



updateBungalow(id: string, formData: FormData): Observable<Bungalow> {
  const url = `${this.apiUrl}/bungalows/${id}`;
  console.log('Sending PATCH request to:', url);

  console.log('FormData contents:');
  formData.forEach((value, key) => {
    console.log(`${key}:`, value);
  });

  return this.http.patch<Bungalow>(url, formData).pipe(
    catchError(this.handleError)
  );
}

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An error occurred';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Client-side error: ${error.error.message}`;
    } else {
      errorMessage = `Server error: ${error.status} - ${error.message}`;
      if (error.error && error.error.message) {
        errorMessage += `; Details: ${error.error.message}`;
      }
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }





getBungalowById(id: string): Observable<Bungalow> {
  return this.http.get<Bungalow>(`${this.apiUrl}/bungalows/${id}`).pipe(
    tap((bungalow) => {
      console.log(`Bungalow with ID ${id} fetched:`, bungalow);
      if (!bungalow) {
        console.warn(`No bungalow found with ID ${id}`);
      }
    }),
    catchError((error) => {
      console.error(`Error fetching bungalow with ID ${id}:`, error);
      return throwError(() => error);
    })
  );
}

deleteBungalow(id: string): Observable<void> {
  return this.http.delete<void>(`${this.apiUrl}/bungalows/${id}`).pipe(
    tap(() => console.log(`Deleted bungalow with id: ${id}`)),
    catchError((error) => {
      console.error('Error deleting bungalow:', error);
      return throwError(() => error);
    })
  );
}

  getAvailableBungalows(checkIn: string, checkOut: string): Observable<Bungalow[]> {
    let params = new HttpParams();
    if (checkIn) params = params.set('checkIn', checkIn);
    if (checkOut) params = params.set('checkOut', checkOut);

    return this.http.get<Bungalow[]>(`${this.apiUrl}/available`, { params });
  }

}
