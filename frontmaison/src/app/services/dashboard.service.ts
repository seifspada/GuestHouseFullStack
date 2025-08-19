import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private services = [
    {
      id: 1,
      name: 'Mountain Hiking Tour',
      type: 'activity',
      maxCapacity: 12,
      duration: '4 hours',
      price: '$65',
      description: 'Guided mountain hiking with scenic views',
      currentBookings: [
        {
          id: 1,
          guestName: 'John Doe',
          email: 'john.doe@email.com',
          phone: '+1-555-123-4567',
          bookingTime: '09:00 AM',
          status: 'confirmed',
          specialRequests: 'Vegetarian lunch',
          room: 'Deluxe Garden Bungalow'
        },
        {
          id: 2,
          guestName: 'Sarah Johnson',
          email: 'sarah.j@email.com',
          phone: '+1-555-987-6543',
          bookingTime: '09:00 AM',
          status: 'pending',
          specialRequests: 'Photography equipment needed',
          room: 'Family Paradise Bungalow'
        },
        {
          id: 3,
          guestName: 'Mike Chen',
          email: 'mike.chen@email.com',
          phone: '+1-555-456-7890',
          bookingTime: '09:00 AM',
          status: 'confirmed',
          specialRequests: 'None',
          room: 'Cozy Lake View Bungalow'
        }
      ],
      availableSlots: [
        { time: '09:00 AM', available: 9, booked: 3 },
        { time: '02:00 PM', available: 12, booked: 0 }
      ],
      nextScheduled: '2024-01-16 09:00 AM'
    },
    {
      id: 2,
      name: 'Spa & Wellness Session',
      type: 'wellness',
      maxCapacity: 4,
      duration: '90 minutes',
      price: '$85',
      description: 'Relaxing spa treatment and wellness therapy',
      currentBookings: [
        {
          id: 4,
          guestName: 'Emma Wilson',
          email: 'emma.w@email.com',
          phone: '+44-7123-456789',
          bookingTime: '10:00 AM',
          status: 'confirmed',
          specialRequests: 'Aromatherapy oils preferred',
          room: 'Romantic Sunset Bungalow'
        }
      ],
      availableSlots: [
        { time: '10:00 AM', available: 3, booked: 1 },
        { time: '02:00 PM', available: 4, booked: 0 },
        { time: '04:00 PM', available: 4, booked: 0 }
      ],
      nextScheduled: '2024-01-16 10:00 AM'
    },
    {
      id: 3,
      name: 'Cooking Class Experience',
      type: 'culinary',
      maxCapacity: 8,
      duration: '2 hours',
      price: '$55',
      description: 'Learn traditional local cooking techniques',
      currentBookings: [
        {
          id: 5,
          guestName: 'David Kim',
          email: 'david.k@email.com',
          phone: '+82-10-1234-5678',
          bookingTime: '03:00 PM',
          status: 'confirmed',
          specialRequests: 'Dietary restrictions: No seafood',
          room: 'Premium Suite'
        },
        {
          id: 6,
          guestName: 'Lisa Brown',
          email: 'lisa.brown@email.com',
          phone: '+1-555-789-0123',
          bookingTime: '03:00 PM',
          status: 'pending',
          specialRequests: 'Vegetarian recipes preferred',
          room: 'Garden View Room'
        }
      ],
      availableSlots: [
        { time: '03:00 PM', available: 6, booked: 2 },
        { time: '06:00 PM', available: 8, booked: 0 }
      ],
      nextScheduled: '2024-01-16 03:00 PM'
    }
  ];

  private currentGuests = [
    {
      id: 1,
      name: 'John Doe',
      room: 'Deluxe Garden Bungalow',
      checkIn: '2024-01-15',
      checkOut: '2024-01-18',
      email: 'john.doe@email.com',
      phone: '+1-555-123-4567'
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      room: 'Family Paradise Bungalow',
      checkIn: '2024-01-14',
      checkOut: '2024-01-17',
      email: 'sarah.j@email.com',
      phone: '+1-555-987-6543'
    },
    {
      id: 3,
      name: 'Mike Chen',
      room: 'Cozy Lake View Bungalow',
      checkIn: '2024-01-16',
      checkOut: '2024-01-19',
      email: 'mike.chen@email.com',
      phone: '+1-555-456-7890'
    },
    {
      id: 4,
      name: 'Emma Wilson',
      room: 'Romantic Sunset Bungalow',
      checkIn: '2024-01-15',
      checkOut: '2024-01-20',
      email: 'emma.w@email.com',
      phone: '+44-7123-456789'
    },
    {
      id: 5,
      name: 'David Kim',
      room: 'Premium Suite',
      checkIn: '2024-01-13',
      checkOut: '2024-01-18',
      email: 'david.k@email.com',
      phone: '+82-10-1234-5678'
    }
  ];

  getServices() {
    return this.services;
  }

  getCurrentGuests() {
    return this.currentGuests;
  }

  getStats() {
    return {
      totalServices: this.services.length,
      todayBookings: this.services.reduce((sum, service) => sum + service.currentBookings.length, 0),
      availableSlots: this.services.reduce((sum, service) => sum + service.availableSlots.reduce((slotSum, slot) => slotSum + slot.available, 0), 0),
      pendingApprovals: this.services.reduce((sum, service) => sum + service.currentBookings.filter(b => b.status === 'pending').length, 0)
    };
  }
}