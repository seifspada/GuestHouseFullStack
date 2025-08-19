import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { CheckInService } from '../../../services/check-in.service';
import { ServiceUsageService } from '../../../services/service-usage.service';
import { CreateServiceUsageDto } from '../../../Model/service-usage';


interface User {
  _id: string;
  name: string;
  email: string;
  status: string;
  role: string;
}

interface ServiceUsage {
  _id: string;
  user: User;
  responsable: string;
  service: string;
  duration: number;
  price: number;
  notes?: string;
  usageTime: string;
}

@Component({
  standalone: true,
  selector: 'app-responsable-dashboard',
  templateUrl: './responsable-dashboard.component.html',
  styleUrls: ['./responsable-dashboard.component.css'],
  imports: [CommonModule, FormsModule, MatButtonModule, MatFormFieldModule, MatSelectModule, MatInputModule],
})
export class ResponsableDashboardComponent implements OnInit {
  currentDate!: string;
  currentTime!: string;

  currentGuests: User[] = [];
  durations = ['30', '60', '90', '120']; // Strings for display, parsed to numbers in DTO
  selectedGuest: User | null = null;
  selectedDuration: string = '60';
  bookingNotes: string = '';
  pricePerHour = 65;
  todaysBookings: ServiceUsage[] = [];

  private serviceId = 'YOUR_SERVICE_ID'; // Replace with actual service ID
  private responsableId = 'YOUR_RESPONSABLE_ID'; // Replace with actual responsable ID (e.g., from auth)

  constructor(
    private checkInService: CheckInService,
    private serviceUsageService: ServiceUsageService
  ) {}

  ngOnInit(): void {
    this.updateDateTime();
    setInterval(() => this.updateDateTime(), 1000);
    this.loadPresentUsers();
  }

  updateDateTime() {
    const now = new Date();
    this.currentDate = now.toLocaleDateString();
    this.currentTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  loadPresentUsers() {
    this.checkInService.getAllPresentUsers().subscribe({
      next: (users) => {
        this.currentGuests = users as unknown as User[]; // Cast to User[] assuming API returns User data
      },
      error: (error) => {
        console.error('Error fetching present users:', error);
      }
    });
  }

  calculatePrice(): number {
    const durationInHours = parseInt(this.selectedDuration) / 60;
    return parseFloat((durationInHours * this.pricePerHour).toFixed(2));
  }

  addBooking() {
    if (!this.selectedGuest || !this.selectedDuration) {
      return;
    }

    const serviceUsage: CreateServiceUsageDto = {
      user: this.selectedGuest._id,
      responsable: this.responsableId,
      service: this.serviceId,
      duration: parseInt(this.selectedDuration),
      price: this.calculatePrice(),
      notes: this.bookingNotes || undefined,
      usageTime: new Date(),
    };

    this.serviceUsageService.createServiceUsage(serviceUsage).subscribe({
      next: (newBooking: ServiceUsage) => {
        this.todaysBookings.push({
          ...newBooking,
          user: this.selectedGuest!, // Use selectedGuest for display
        });
        this.bookingNotes = '';
        this.selectedGuest = null;
        this.selectedDuration = '60';
      },
      error: (error) => {
        console.error('Error creating service usage:', error);
      }
    });
  }
}