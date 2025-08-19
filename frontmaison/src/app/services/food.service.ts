import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { createFood, Food } from '../Model/food.model';

@Injectable({
  providedIn: 'root',
})
export class FoodService {
    
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

createFood(data: FormData): Observable<any> {
  return this.http.post(`${this.apiUrl}/foods`, data);
}



 fetchFoods(): Observable<Food[]> {
  return this.http.get<Food[]>(`${this.apiUrl}/foods`).pipe(
    tap((foods) => {
      console.log('Foods fetched:', foods);
      if (foods.length === 0) {
        console.warn('No active foods found in the database');
      }
    }),
    catchError((error) => {
      console.error('Error fetching foods:', error);
      return throwError(() => error);
    })
  );
}

updateFood(id: string, formData: FormData): Observable<Food> {
  const url = `${this.apiUrl}/foods/${id}`;
  console.log('Sending PATCH request to:', url);

  console.log('FormData contents:');
  formData.forEach((value, key) => {
    console.log(`${key}:`, value);
  });

  return this.http.patch<Food>(url, formData).pipe(
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



getFoods(): Observable<Food[]> {
  return this.http.get<Food[]>(`${this.apiUrl}/foods`);
}

getFoodById(id: string): Observable<Food> {
  return this.http.get<Food>(`${this.apiUrl}/foods/${id}`).pipe(
    tap((food) => {
      console.log(`Food with ID ${id} fetched:`, food);
      if (!food) {
        console.warn(`No food found with ID ${id}`);
      }
    }),
    catchError((error) => {
      console.error(`Error fetching food with ID ${id}:`, error);
      return throwError(() => error);
    })
  );
}

deleteFood(id: string): Observable<void> {
  return this.http.delete<void>(`${this.apiUrl}/foods/${id}`).pipe(
    tap(() => console.log(`Deleted food with id: ${id}`)),
    catchError((error) => {
      console.error('Error deleting food:', error);
      return throwError(() => error);
    })
  );
}
}