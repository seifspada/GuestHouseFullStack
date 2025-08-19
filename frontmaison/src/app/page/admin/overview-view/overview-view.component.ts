import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterByStatusPipe } from './filter-by-status.pipe';

interface DashboardMetric {
  title: string;
  value: number | string;
  icon: string;
  color: string;
}

interface Booking {
  id: number;
  guest: string;
  bungalow: string;
  checkIn: string;
  checkOut: string;
  status: string;
  total: number;
  persons: number;
}

interface Notification {
  id: number;
  type: string;
  message: string;
  time: string;
  urgent: boolean;
}

@Component({
  selector: 'app-overview-view',
  standalone: true,
  imports: [CommonModule,FilterByStatusPipe],
  templateUrl: './overview-view.component.html',
  styleUrls: ['./overview-view.component.css']
})
export class OverviewViewComponent {
  metrics: DashboardMetric[] = [
    { title: 'Total Guests', value: 156, icon: 'fas fa-users', color: '#3b82f6' },
    { title: 'Active Bookings', value: 23, icon: 'fas fa-calendar-alt', color: '#4ade80' },
    { title: 'Revenue (Month)', value: '$12,450', icon: 'fas fa-dollar-sign', color: '#f59e0b' },
    { title: 'Occupancy Rate', value: '78%', icon: 'fas fa-home', color: '#a855f7' }
  ];

  pendingBookings: Booking[] = [
    {
      id: 1,
      guest: 'John Doe',
      bungalow: 'Deluxe Garden Bungalow',
      checkIn: '2025-07-22',
      checkOut: '2025-07-25',
      status: 'pending',
      total: 450,
      persons: 2
    },
    {
      id: 2,
      guest: 'Sarah Johnson',
      bungalow: 'Family Paradise Bungalow',
      checkIn: '2025-07-23',
      checkOut: '2025-07-26',
      status: 'pending',
      total: 660,
      persons: 4
    }
  ];

  notifications: Notification[] = [
    {
      id: 1,
      type: 'booking',
      message: 'New booking request from John Doe',
      time: '5 minutes ago',
      urgent: true
    },
    {
      id: 2,
      type: 'maintenance',
      message: 'Pool maintenance scheduled for tomorrow',
      time: '1 hour ago',
      urgent: false
    },
    {
      id: 3,
      type: 'review',
      message: 'New 5-star review received',
      time: '2 hours ago',
      urgent: false
    }
  ];

  handleBookingAction(bookingId: number, action: 'approve' | 'reject') {
    console.log(`${action} booking ${bookingId}`);
    if (action === 'approve') {
      const booking = this.pendingBookings.find(b => b.id === bookingId);
      if (booking) {
        booking.status = 'confirmed';
      }
    } else if (action === 'reject') {
      this.pendingBookings = this.pendingBookings.filter(b => b.id !== bookingId);
    }
  }
}