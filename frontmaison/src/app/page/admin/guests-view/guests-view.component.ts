import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Guest {
  id: number;
  name: string;
  email: string;
  phone: string;
  country: string;
  avatar?: string;
  isCurrentGuest: boolean;
  totalBookings: number;
  totalSpent: number;
  averageRating: number;
  lastVisit: string;
  joinDate: string;
  preferences: {
    roomType: string;
    dietary: string[];
    activities: string[];
    specialRequests: string;
  };
  bookingHistory: Array<{
    id: number;
    bungalow: string;
    checkIn: string;
    checkOut: string;
    amount: number;
    status: string;
    rating?: number;
    review?: string;
  }>;
}

interface Responsable {
  id: number;
  name: string;
  email: string;
  phone: string;
  serviceName: string;
  serviceBookings: Array<{
    guestName: string;
    duration: number;
    price: number;
    date: string;
    time: string;
  }>;
}

interface NewResponsable {
  name: string;
  email: string;
  phone: string;
  serviceName: string;
}

interface NewGuest {
  name: string;
  email: string;
  phone: string;
  country: string;
  isCurrentGuest: boolean;
}

type GuestFilter = 'all' | 'current' | 'specific';

@Component({
  selector: 'app-guests-view',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './guests-view.component.html',
  styleUrls: ['./guests-view.component.css']
})
export class GuestsViewComponent {
  selectedGuest: Guest | null = null;
  searchTerm: string = '';
  guestFilter: GuestFilter = 'all';
  filterOptions: GuestFilter[] = ['all', 'current', 'specific'];
  showAddGuest: boolean = false;
  showAddResponsable: boolean = false;
  activeTab: 'guests' | 'responsables' = 'guests';
  specificGuestName: string = '';
  newGuest: NewGuest = {
    name: '',
    email: '',
    phone: '',
    country: '',
    isCurrentGuest: false
  };
  newResponsable: NewResponsable = {
    name: '',
    email: '',
    phone: '',
    serviceName: ''
  };

  guests: Guest[] = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@email.com',
      phone: '+1-555-123-4567',
      country: 'United States',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      isCurrentGuest: true,
      totalBookings: 8,
      totalSpent: 3240,
      averageRating: 4.9,
      lastVisit: '2024-01-12',
      joinDate: '2022-03-15',
      preferences: {
        roomType: 'Deluxe Garden Bungalow',
        dietary: ['Vegetarian', 'Gluten-Free'],
        activities: ['Hiking', 'Photography'],
        specialRequests: 'Late check-out preferred, quiet room'
      },
      bookingHistory: [
        {
          id: 101,
          bungalow: 'Deluxe Garden Bungalow',
          checkIn: '2024-01-10',
          checkOut: '2024-01-12',
          amount: 450,
          status: 'completed',
          rating: 5,
          review: 'Absolutely perfect stay! Will definitely return.'
        }
      ]
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      email: 'sarah.j@email.com',
      phone: '+1-555-987-6543',
      country: 'Canada',
      isCurrentGuest: true,
      totalBookings: 5,
      totalSpent: 1950,
      averageRating: 4.7,
      lastVisit: '2024-01-08',
      joinDate: '2023-01-20',
      preferences: {
        roomType: 'Family Paradise Bungalow',
        dietary: ['No restrictions'],
        activities: ['Swimming', 'Family games'],
        specialRequests: 'Extra towels, crib if available'
      },
      bookingHistory: [
        {
          id: 201,
          bungalow: 'Family Paradise Bungalow',
          checkIn: '2024-01-05',
          checkOut: '2024-01-08',
          amount: 660,
          status: 'completed',
          rating: 5
        }
      ]
    },
    {
      id: 3,
      name: 'Mike Chen',
      email: 'mike.chen@email.com',
      phone: '+1-555-456-7890',
      country: 'Australia',
      isCurrentGuest: false,
      totalBookings: 2,
      totalSpent: 890,
      averageRating: 4.5,
      lastVisit: '2023-11-15',
      joinDate: '2023-08-10',
      preferences: {
        roomType: 'Cozy Lake View Bungalow',
        dietary: ['Pescatarian'],
        activities: ['Photography', 'Nature walks'],
        specialRequests: 'Early check-in if possible'
      },
      bookingHistory: [
        {
          id: 301,
          bungalow: 'Cozy Lake View Bungalow',
          checkIn: '2023-11-12',
          checkOut: '2023-11-15',
          amount: 440,
          status: 'completed',
          rating: 4
        }
      ]
    }
  ];

  responsables: Responsable[] = [
    {
      id: 1,
      name: 'Maria Rodriguez',
      email: 'maria.r@igloo.com',
      phone: '+1-555-100-1001',
      serviceName: 'Spa & Wellness Session',
      serviceBookings: [
        {
          guestName: 'Emma Wilson',
          duration: 90,
          price: 97.5,
          date: '2024-01-16',
          time: '10:30 AM'
        },
        {
          guestName: 'Sarah Johnson',
          duration: 60,
          price: 65,
          date: '2024-01-16',
          time: '02:00 PM'
        }
      ]
    },
    {
      id: 2,
      name: 'Carlos Mendez',
      email: 'carlos.m@igloo.com',
      phone: '+1-555-100-1002',
      serviceName: 'Mountain Hiking Tour',
      serviceBookings: [
        {
          guestName: 'John Doe',
          duration: 240,
          price: 65,
          date: '2024-01-16',
          time: '09:00 AM'
        }
      ]
    }
  ];

  get filteredGuests(): Guest[] {
    if (!this.guests) return [];
    return this.guests.filter(guest => {
      const search = (this.searchTerm ?? '').toLowerCase();
      const guestName = (guest.name ?? '').toLowerCase();
      const guestEmail = (guest.email ?? '').toLowerCase();
      const matchesSearch = guestName.includes(search) || guestEmail.includes(search);

      let matchesFilter = true;
      if (this.guestFilter === 'current') {
        matchesFilter = guest.isCurrentGuest;
      } else if (this.guestFilter === 'specific') {
        const specificName = (this.specificGuestName ?? '').toLowerCase();
        matchesFilter = guestName.includes(specificName);
      }

      return matchesSearch && matchesFilter;
    });
  }

  get currentGuestsCount(): number {
    return this.guests.filter(g => g.isCurrentGuest).length;
  }

  selectGuest(guest: Guest): void {
    this.selectedGuest = guest;
  }

  setActiveTab(tab: 'guests' | 'responsables'): void {
    this.activeTab = tab;
  }

  toggleAddGuestModal(show: boolean): void {
    this.showAddGuest = show;
    if (!show) {
      this.newGuest = { name: '', email: '', phone: '', country: '', isCurrentGuest: false };
    }
  }

  toggleAddResponsableModal(show: boolean): void {
    this.showAddResponsable = show;
    if (!show) {
      this.newResponsable = { name: '', email: '', phone: '', serviceName: '' };
    }
  }

  setGuestFilter(filter: GuestFilter): void {
    this.guestFilter = filter;
    if (filter !== 'specific') {
      this.specificGuestName = '';
    }
  }

  handleAddGuest(): void {
    if (!this.newGuest.name || !this.newGuest.email) {
      alert('Please fill in all required fields.');
      return;
    }
    const guest: Guest = {
      id: Date.now(),
      name: this.newGuest.name,
      email: this.newGuest.email,
      phone: this.newGuest.phone,
      country: this.newGuest.country,
      isCurrentGuest: this.newGuest.isCurrentGuest,
      totalBookings: 0,
      totalSpent: 0,
      averageRating: 0,
      lastVisit: '',
      joinDate: new Date().toISOString().split('T')[0],
      preferences: { roomType: '', dietary: [], activities: [], specialRequests: '' },
      bookingHistory: []
    };
    this.guests = [...this.guests, guest];
    this.newGuest = { name: '', email: '', phone: '', country: '', isCurrentGuest: false };
    this.showAddGuest = false;
  }

  handleAddResponsable(): void {
    if (!this.newResponsable.name || !this.newResponsable.email || !this.newResponsable.serviceName) {
      alert('Please fill in all required fields.');
      return;
    }
    const responsable: Responsable = {
      id: Date.now(),
      name: this.newResponsable.name,
      email: this.newResponsable.email,
      phone: this.newResponsable.phone,
      serviceName: this.newResponsable.serviceName,
      serviceBookings: []
    };
    this.responsables = [...this.responsables, responsable];
    this.newResponsable = { name: '', email: '', phone: '', serviceName: '' };
    this.showAddResponsable = false;
  }

  getTotalRevenue(responsable: Responsable): number {
    return responsable.serviceBookings.reduce((sum, booking) => sum + booking.price, 0);
  }
}