import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserRegister, LoginModel, UserRole, JwtPayload } from '../Model/user.model';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:3000/auth';
  private currentUserSubject = new BehaviorSubject<UserRegister | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadUserFromStorage();
  }

  get currentUserId(): string | null {
    return this.currentUserSubject.value?.userId || null;
  }

  getCurrentUser(): UserRegister | null {
    return this.currentUserSubject.value;
  }

  hasRole(role: UserRole): boolean {
    const user = this.currentUserSubject.value;
    return user?.role === role;
  }

  registerUser(user: UserRegister): Observable<any> {
    return this.http.post(`${this.apiUrl}/signup`, user);
  }

  onLogin(user: LoginModel): Observable<any> {
    return this.http.post<{ accessToken: string; refreshToken: string }>(`${this.apiUrl}/login`, user).pipe(
      tap((response) => {
        console.log('Token received:', response.accessToken);
        const token = response.accessToken;
        if (token) {
          const decoded: JwtPayload = jwtDecode(token);
          const currentUser: UserRegister = {
            userId: decoded.id, // Map id to userId
            email: decoded.email,
            name: decoded.name || '',
            role: decoded.role as UserRole,
            dateNaissance: decoded.dateNaissance ? new Date(decoded.dateNaissance) : undefined,
            address: decoded.address || '',
            telephone: decoded.telephone || '',
            password: ''
          };

          this.currentUserSubject.next(currentUser);
          localStorage.setItem('accessToken', response.accessToken);
          localStorage.setItem('refreshToken', response.refreshToken);
          localStorage.setItem('currentUser', JSON.stringify(currentUser));
        }
      }),
      catchError((error) => {
        console.error('Login failed', error);
        return throwError(() => error);
      })
    );
  }

  logout(): void {
    this.currentUserSubject.next(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('currentUser');
  }

  private loadUserFromStorage(): void {
    const user = localStorage.getItem('currentUser');
    if (user) {
      const parsedUser = JSON.parse(user);
      if (parsedUser.dateNaissance) {
        parsedUser.dateNaissance = new Date(parsedUser.dateNaissance);
      }
      this.currentUserSubject.next(parsedUser);
    }
  }
}


  /*

  onLogin(user: LoginModel): Observable<any> {
    return this.http.post<{ token: string }>(`${this.apiUrl}/login`, user).pipe(
      tap((response) => {
        const decoded: any = jwtDecode(response.token);

        const currentUser: UserRegister = {
          email: decoded.email,
          name: decoded.name,
          role: decoded.role as UserRole,
          dateNaissance: decoded.dateNaissance ? new Date(decoded.dateNaissance) : undefined,
          address: decoded.address || '',
          telephone: decoded.telephone || '',
          password: '' // mot de passe jamais dans le token
        };

        this.currentUserSubject.next(currentUser);
        localStorage.setItem('token', response.token);
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
      })
    );
  }



onLogin(user: LoginModel): Observable<any> {
  const loginPayload = {
    email: user.email,
    password: user.password
  };

  return this.http.post<{ token: string }>(`${this.apiUrl}/login`, loginPayload)
    .pipe(
      tap((response) => {
        const decoded: any = jwtDecode(response.token);
        const user: UserRegister = {
          email: decoded.email,
          name: decoded.name,
          role: decoded.role as UserRole,
          dateNaissance: decoded.dateNaissance ? new Date(decoded.dateNaissance) : undefined,
          address: decoded.address || '',
          telephone: decoded.telephone || '',
          password: '' // pas dans le token
        };
        this.currentUserSubject.next(user);
        localStorage.setItem('token', response.token);
        localStorage.setItem('currentUser', JSON.stringify(user));
      })
    );
}




onLogin(user: LoginModel): Observable<any> {
  return this.http.post(`${this.apiUrl}/login`, user);
}
*/
