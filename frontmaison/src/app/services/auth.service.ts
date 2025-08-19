import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/auth/login'; // Adjust to your login endpoint
  private tokenKey = 'auth_token';
  private _user: any; // Replace with your user type, e.g., { id: string }

  constructor(private http: HttpClient) {}

  login(credentials: { username: string; password: string }): Observable<any> {
    return this.http.post(this.apiUrl, credentials).pipe(
      tap((response: any) => {
        if (response && response.access_token) {
          localStorage.setItem(this.tokenKey, response.access_token);
          console.log('Token stored:', response.access_token); // Debug
        }
      })
    );
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
  }


  get currentUserId(): string | null {
    return this._user?.id || null; // Or retrieve from localStorage/JWT/etc.
  }
}