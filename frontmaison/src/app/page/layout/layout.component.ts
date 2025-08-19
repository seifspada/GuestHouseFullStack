import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NotificationsComponent } from '../user/notifications/notifications.component';
import { ProfilComponent } from '../user/profil/profil.component';


@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterModule,NotificationsComponent,ProfilComponent],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
})
export class LayoutComponent {
  notificationToggleSignal: boolean | null = null;
  profileToggleSignal: boolean | null = null;

  onNotificationClick(event: Event): void {
    event.preventDefault();
    this.notificationToggleSignal = !this.notificationToggleSignal;
  }

  onProfileClick(event: Event): void {
    event.preventDefault();
    this.profileToggleSignal = !this.profileToggleSignal;
  }
}