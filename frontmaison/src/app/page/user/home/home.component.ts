import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { BungalowDetailComponent } from '../bungalows/bungalow-detail/bungalow-detail.component';
import { BookingModelComponent } from '../bungalows/booking-model/booking-model.component';
import { BungalowCardComponent } from '../../../components/bungalow-card/bungalow-card.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule,FormsModule,RouterLink, BungalowDetailComponent, BookingModelComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  selectedBungalow: any = null;
  showBookingModal: boolean = false;
  checkInDate: string = '';
  checkOutDate: string = '';

  bungalows = [
    {
      id: 1,
      name: 'Deluxe Garden Bungalow',
      price: '$150',
      capacity: '2-4 guests',
      beds: '2 Queen Beds',
      baths: '2 Bathrooms',
      image: '/placeholder.svg',
      features: ['Garden View', 'Private Terrace', 'Kitchenette', 'Free WiFi'],
      popular: true,
      available: true,
    },
    {
      id: 2,
      name: 'Family Paradise Bungalow',
      price: '$220',
      capacity: '4-6 guests',
      beds: '3 Beds',
      baths: '2 Bathrooms',
      image: '/placeholder.svg',
      features: ['Ocean View', 'Living Room', 'Full Kitchen', 'Free Parking'],
      popular: false,
      available: true,
    },
    {
      id: 3,
      name: 'Romantic Sunset Bungalow',
      price: '$180',
      capacity: '2 guests',
      beds: '1 King Bed',
      baths: '1 Bathroom',
      image: '/placeholder.svg',
      features: ['Sunset View', 'Jacuzzi', 'Private Beach Access', 'Butler Service'],
      popular: true,
      available: false,
    },
    {
      id: 4,
      name: 'Executive Business Bungalow',
      price: '$200',
      capacity: '2-3 guests',
      beds: '1 King + 1 Single',
      baths: '1 Bathroom',
      image: '/placeholder.svg',
      features: ['Work Desk', 'Meeting Area', 'High-Speed Internet', 'Airport Transfer'],
      popular: false,
      available: true,
    },
  ];

  get popularBungalows() {
    return this.bungalows.filter((bungalow) => bungalow.popular).slice(0, 4);
  }

  onViewDetails(bungalow: any): void {
    this.selectedBungalow = bungalow;
  }

  onBookNow(bungalow: any): void {
    this.selectedBungalow = bungalow;
    this.showBookingModal = true;
  }

  onCloseDetails(): void {
    this.selectedBungalow = null;
  }

  onCloseBooking(): void {
    this.showBookingModal = false;
    this.selectedBungalow = null;
    this.checkInDate = '';
    this.checkOutDate = '';
  }

  onBookingComplete(): void {
    console.log('Booking completed successfully!');
    this.showBookingModal = false;
    this.selectedBungalow = null;
    this.checkInDate = '';
    this.checkOutDate = '';
  }
}