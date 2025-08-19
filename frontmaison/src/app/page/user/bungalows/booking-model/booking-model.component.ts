import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Bungalow } from '../../../../Model/bungalow.model';
import { BookingService } from '../../../../services/booking.service';
import { UserService } from '../../../../services/user.service'; // Adjust path
import { Booking, CreateBookingDto } from '../../../../Model/booking.model';

@Component({
  selector: 'app-booking-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './booking-model.component.html',
  styleUrls: ['./booking-model.component.css']
})
export class BookingModelComponent implements OnInit {
  @Input() bungalow?: Bungalow;
  @Input() checkInDate: string = '';
  @Input() checkOutDate: string = '';
  @Output() close = new EventEmitter<void>();
  @Output() bookingComplete = new EventEmitter<void>();

  bookingForm!: FormGroup;
  isSubmitting = false;
  errorMessage: string | null = null;
  isBookingComplete = false;

  constructor(
    private fb: FormBuilder,
    private bookingService: BookingService,
    private userService: UserService // Inject UserService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.bookingForm.patchValue({
      userId: this.userService.currentUserId || '', // Use UserService
      checkInDate: this.checkInDate,
      checkOutDate: this.checkOutDate,
      numberOfNights: this.calculateNights(),
      totalPrice: this.totalPrice,
      bungalowId: this.bungalow?._id || '',
      status: 'pending'
    });

    // Debug form validity
    this.bookingForm.statusChanges.subscribe(status => {
      console.log('Form Status:', status);
      console.log('Form Errors:', this.bookingForm.errors);
      console.log('Form Value:', this.bookingForm.value);
      if (this.bookingForm.invalid) {
        Object.keys(this.bookingForm.controls).forEach(key => {
          const control = this.bookingForm.get(key);
          if (control?.invalid) {
            console.log(`Field ${key} Errors:`, control.errors);
          }
        });
      }
    });
  }

  private initForm(): void {
    this.bookingForm = this.fb.group({
      userId: ['', Validators.required], // Require userId if backend needs it
      description: [''],
      bungalowId: ['', Validators.required],
      checkInDate: ['', Validators.required],
      checkOutDate: ['', Validators.required],
      numberOfNights: [0, [Validators.required, Validators.min(1)]],
      numberOfAdults: [1, [Validators.required, Validators.min(1), Validators.max(8)]],
      numberOfChildren: [0, [Validators.min(0), Validators.max(4)]],
      totalPrice: [0, [Validators.required, Validators.min(0)]],
status: ['pending', [Validators.required, Validators.pattern(/^(pending|cancelled|confirmed)$/)]]    });

    // Update numberOfNights and totalPrice on date changes
    this.bookingForm.get('checkInDate')?.valueChanges.subscribe(() => {
      this.updateNightsAndPrice();
    });
    this.bookingForm.get('checkOutDate')?.valueChanges.subscribe(() => {
      this.updateNightsAndPrice();
    });
  }

  private updateNightsAndPrice(): void {
    const nights = this.calculateNights();
    this.bookingForm.patchValue({
      numberOfNights: nights,
      totalPrice: nights * (this.bungalow?.price || 0)
    }, { emitEvent: false });
  }

  calculateNights(): number {
    if (!this.checkInDate || !this.checkOutDate) return 0;
    const start = new Date(this.checkInDate);
    const end = new Date(this.checkOutDate);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) return 0;
    const diffTime = end.getTime() - start.getTime();
    return Math.max(0, Math.ceil(diffTime / (1000 * 3600 * 24)));
  }

  get totalPrice(): number {
    return this.calculateNights() * (this.bungalow?.price || 0);
  }

  getBungalowImage(bungalow?: Bungalow): string {
    if (bungalow?.images && bungalow.images.length > 0) {
      return `http://localhost:3000/uploads/bungalows/${bungalow.images[0]}`;
    }
    return 'assets/default-bungalow-image.jpg';
  }

 // booking-model.component.ts - dans onSubmit()
onSubmit(): void {
  if (this.bookingForm.valid && this.bungalow && this.bungalow._id) {
    this.isSubmitting = true;
    this.errorMessage = null;

    const bookingData: CreateBookingDto = {
      bungalowId: this.bungalow._id,
      description: this.bookingForm.get('description')?.value || '',
      checkInDate: this.bookingForm.get('checkInDate')?.value || this.checkInDate,
      checkOutDate: this.bookingForm.get('checkOutDate')?.value || this.checkOutDate,
      numberOfNights: this.bookingForm.get('numberOfNights')?.value,
      numberOfAdults: this.bookingForm.get('numberOfAdults')?.value,
      numberOfChildren: this.bookingForm.get('numberOfChildren')?.value,
      totalPrice: this.bookingForm.get('totalPrice')?.value,
      status: this.bookingForm.get('status')?.value,
    };

    this.bookingService.createBooking(bookingData).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.isBookingComplete = true;
        this.bookingComplete.emit();
      },
      error: (error) => {
        this.isSubmitting = false;
        this.errorMessage = 'Failed to create booking. Please try again.';
        console.error('Booking Error:', error);
      }
    });
  } else {
    this.errorMessage = 'Please fill out all required fields correctly or ensure you are logged in.';
    this.bookingForm.markAllAsTouched();
  }
}


  resetForm(): void {
    this.bookingForm.reset({
      userId: this.userService.currentUserId || '',
      description: '',
      bungalowId: this.bungalow?._id || '',
      checkInDate: this.checkInDate,
      checkOutDate: this.checkOutDate,
      numberOfNights: this.calculateNights(),
      numberOfAdults: 1,
      numberOfChildren: 0,
      totalPrice: this.totalPrice,
      status: 'pending'
    });
    this.errorMessage = null;
    this.isBookingComplete = false;
  }
}