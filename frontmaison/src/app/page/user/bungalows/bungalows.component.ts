import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookingModelComponent } from './booking-model/booking-model.component';
import { BungalowDetailComponent } from './bungalow-detail/bungalow-detail.component';
import { Bungalow } from '../../../Model/bungalow.model';
import { BungalowService } from '../../../services/bungalow.service';
import { UserService } from '../../../services/user.service'; // Adjust path

@Component({
  selector: 'app-bungalows',
  standalone: true,
  imports: [CommonModule, FormsModule, BookingModelComponent, BungalowDetailComponent],
  templateUrl: './bungalows.component.html',
  styleUrls: ['./bungalows.component.css'],
})
export class BungalowsComponent implements OnInit {
  bungalows: Bungalow[] = [];
  checkInDate: string = '';
  checkOutDate: string = '';
  filteredBungalows: Bungalow[] = [];
  selectedBungalow: Bungalow | null = null;
  selectedBungalowDetail: Bungalow | null = null;
  error: string | null = null;

  amenities = [
    { icon: 'fas fa-wifi', name: 'Free WiFi' },
    { icon: 'fas fa-car', name: 'Free Parking' },
    { icon: 'fas fa-coffee', name: 'Coffee Maker' },
    { icon: 'fas fa-bath', name: 'Private Bathroom' },
  ];

  constructor(
    private bungalowService: BungalowService,
    public userService: UserService // Inject UserService
  ) {}

  ngOnInit(): void {
    this.loadBungalows();
  }

  get isInvalidDateRange(): boolean {
    if (!this.checkInDate || !this.checkOutDate) {
      return true;
    }
    return new Date(this.checkOutDate) <= new Date(this.checkInDate);
  }

  loadBungalows(): void {
    this.bungalowService.getBungalows().subscribe({
      next: (bungalows) => {
        this.bungalows = bungalows;
        this.filteredBungalows = bungalows;
        this.error = null;
      },
      error: (error) => {
        this.error = 'Failed to load bungalow items. Please try again later.';
        console.error('Error loading bungalows:', error);
      },
    });
  }

  getBungalowImage(bungalow: Bungalow): string {
    return bungalow.images?.length
      ? `http://localhost:3000/uploads/bungalows/${bungalow.images[0]}`
      : 'assets/default-bungalow-image.jpg';
  }

  handleSearch(): void {
    if (!this.checkInDate || !this.checkOutDate) {
      this.filteredBungalows = this.bungalows;
    } else {
      const checkIn = new Date(this.checkInDate);
      const checkOut = new Date(this.checkOutDate);
      if (checkOut <= checkIn) {
        this.error = 'Check-out date must be after check-in date.';
        return;
      }
      this.error = null;
      this.filteredBungalows = this.bungalows.filter(b => b.isAvailable);
    }
  }

  openBookingModal(bungalow: Bungalow): void {
    if (!this.userService.currentUserId) {
      this.error = 'You must be logged in to book a bungalow. <a href="/login">Log in here</a>.';
      return;
    }
    this.selectedBungalow = bungalow;
  }

  closeBookingModal(): void {
    this.selectedBungalow = null;
  }

  handleBookingComplete(): void {
    console.log('Booking completed successfully!');
    this.closeBookingModal();
  }

  openDetailModal(bungalow: Bungalow): void {
    this.selectedBungalowDetail = bungalow;
  }

  closeDetailModal(): void {
    this.selectedBungalowDetail = null;
  }
}