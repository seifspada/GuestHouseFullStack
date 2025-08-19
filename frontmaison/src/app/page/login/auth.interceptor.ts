// src/app/page/login/auth.interceptor.ts
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpHandlerFn, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const httpClient = inject(HttpClient);
    const publicUrls = ['/auth/login', '/auth/signup', '/auth/refresh'];
    const isPublicRequest = publicUrls.some(url => req.url.includes(url));

    if (isPublicRequest) {
      console.log('Public request, no token needed:', req.url);
      return next.handle(req);
    }

    const token = localStorage.getItem('accessToken');
    if (token) {
      const authReq = req.clone({
        setHeaders: { Authorization: `Bearer ${token}` }
      });
      console.log('Request with token:', authReq.headers.get('Authorization'));
      return next.handle(authReq).pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 401 && error.error.message === 'jwt expired') {
            console.log('Token expired, attempting to refresh');
            return this.refreshToken(httpClient).pipe(
              switchMap((newToken: string) => {
                localStorage.setItem('accessToken', newToken);
                const retryReq = req.clone({
                  setHeaders: { Authorization: `Bearer ${newToken}` }
                });
                return next.handle(retryReq);
              }),
              catchError((refreshError) => {
                console.error('Refresh token failed:', refreshError);
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                window.location.href = '/login';
                return throwError(() => refreshError);
              })
            );
          }
          return throwError(() => error);
        })
      );
    }

    console.log('No token found, sending request without Authorization header');
    return next.handle(req);
  }

  private refreshToken(httpClient: HttpClient): Observable<string> {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      return throwError(() => new Error('No refresh token available'));
    }
    return httpClient
      .post<{ accessToken: string; refreshToken: string }>('http://localhost:3000/auth/refresh', { refreshToken })
      .pipe(
        switchMap((response) => {
          localStorage.setItem('refreshToken', response.refreshToken); // Update refresh token
          return response.accessToken;
        })
      );
  }
}

// Adaptateur pour utiliser la classe avec `withInterceptors`
export function authInterceptor(req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> {
  const interceptor = new AuthInterceptor();
  const adaptedHandler = {
    handle: (request: HttpRequest<any>) => next(request)
  } as HttpHandler;
  return interceptor.intercept(req, adaptedHandler);
}