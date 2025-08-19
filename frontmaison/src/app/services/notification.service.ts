import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { CreateNotificationDto } from '../Model/notification.model';
import { AppNotification } from '../Model/notification.model';


@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private apiUrl = 'http://localhost:3000/notifications';

  constructor(private http: HttpClient) {}

  createNotification(dto: CreateNotificationDto): Observable<any> {
    return this.http.post(this.apiUrl, dto);
  }

 getRecentNotifications(): Observable<AppNotification[]> {
    return this.http.get<any[]>(`${this.apiUrl}/recent`).pipe(
      map((response) =>
        response.map((item) => ({
          title: item.title,
          message: item.message || item.content,
          timeAgo: item.timeAgo || item.time,
        }))
      )
    );
  }

   getMyNotifications(): Observable<AppNotification[]> {
    return this.http.get<any[]>(`${this.apiUrl}/my`).pipe(
      map((response) =>
        response.map((item) => ({
          title: item.title,
          message: item.message || item.content,
          timeAgo: item.timeAgo || item.time,
        }))
      )
    );
  }
}