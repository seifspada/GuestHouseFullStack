import { CommonModule } from '@angular/common';
import { Component, HostListener, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Observable } from 'rxjs';
import { NotificationService } from '../../../services/notification.service';
import { AppNotification } from '../../../Model/notification.model';



@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.css',
})
export class NotificationsComponent implements OnInit, OnChanges {
  @Input() triggerToggle: boolean | null = null;
  isDropdownOpen = false;
notifications: AppNotification[] = [];
myNotifications: AppNotification[] = [];

  loading = true;
  error: string | null = null;

  constructor(private notificationService: NotificationService) {} // Inject service

  ngOnInit(): void {
    this.loadNotifications();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['triggerToggle'] && changes['triggerToggle'].currentValue !== null) {
      this.toggleDropdown();
    }
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    // Add null check for closest() and refine selector
    if (
      !target.closest('.notification-container') &&
      !target.closest('.overlay') &&
      !target.closest('.fa-bell') // Prevent closing when clicking bell icon
    ) {
      this.isDropdownOpen = false;
    }
  }



  loadNotifications(): void {
  this.loading = true;
  this.error = null;

  this.notificationService.getRecentNotifications().subscribe({
    next: (notifications) => {
      this.notifications = notifications;
        this.loading = false;
    },
    error: (err) => {
      this.error = 'Failed to load recent notifications.';
      this.loading = false;
      console.error('Error fetching recent notifications:', err);
    },
  });

  this.notificationService.getMyNotifications().subscribe({
    next: (mine) => {
      this.myNotifications = mine;
    },
    error: (err) => {
      console.error('Error fetching my notifications:', err);
    },
  });
}

}


/*  loadNotifications(): void {
    this.loading = true;
    this.error = null;
    this.notificationService.getRecentNotifications().subscribe({
      next: (notifications) => {
        this.notifications = notifications;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load notifications.';
        this.loading = false;
        console.error('Error fetching notifications:', err);
      },
    });
  }
 */