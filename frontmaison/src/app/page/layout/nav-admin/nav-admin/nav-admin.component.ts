import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-nav-admin',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './nav-admin.component.html',
  styleUrls: ['./nav-admin.component.css']
})
export class NavAdminComponent {
  notificationCount = 3;
  userName = 'Admin User';
  userInitial = 'A';
  activeItem: string = 'overview';

  navItems = [
    { id: 'overview', label: 'Overview', icon: 'fas fa-chart-line', route: '/admin/overview' },
    { id: 'bookings', label: 'Bookings', icon: 'fas fa-calendar-alt', route: '/admin/booking' },
    { id: 'check-in', label: 'Check-In', icon: 'fas fa-user-check', route: '/admin/check-in' },
    { id: 'guests', label: 'Guests', icon: 'fas fa-users', route: '/admin/guests' },
    { id: 'bungalows', label: 'Bungalows', icon: 'fas fa-home', route: '/admin/bungalows' },
    { id: 'food', label: 'Food', icon: 'fas fa-utensils', route: '/admin/foods' },
    { id: 'services', label: 'Services', icon: 'fas fa-concierge-bell', route: '/admin/services' },
    { id: 'notifications', label: 'Notifications', icon: 'fas fa-bell', route: '/admin/notifications' }
  ];

  constructor(private router: Router) {}

  setActiveItem(itemId: string) {
    this.activeItem = itemId;
    const item = this.navItems.find(nav => nav.id === itemId);
    if (item) {
      this.router.navigate([item.route]);
    }
  }
}