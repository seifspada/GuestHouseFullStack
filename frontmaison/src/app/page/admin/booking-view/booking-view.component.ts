import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingService } from '../../../services/booking.service';
import { BookingRequest } from '../../../Model/booking.model';


interface BookingView {
  _id: string; // ✅ Add this so we can use it in requests
  guestName: string;
  bungalowName: string;
  checkInDate: string;
  checkOutDate: string;
  status: 'pending' | 'confirmed' | 'cancelled';
}


@Component({
  selector: 'app-bookings-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './booking-view.component.html',
  styleUrls: ['./booking-view.component.css']
})
export class BookingViewComponent implements OnInit {
  bookings: BookingView[] = [];
  

  constructor(private bookingService: BookingService) {}

  ngOnInit() {
    this.bookingService.getBookings().subscribe((data: BookingRequest[]) => {
     this.bookings = data.map(b => ({
  _id: b._id!, // keep backend ID
  guestName: typeof b.userId === 'string' ? b.userId : b.userId.name,
  bungalowName: typeof b.bungalowId === 'string' ? b.bungalowId : b.bungalowId.name,
  checkInDate: b.checkInDate,
  checkOutDate: b.checkOutDate,
  status: b.status
}));

    });
  }

  

  updateStatusToConfirmed(booking: BookingView) {
  this.bookingService.confirmBooking(booking._id!).subscribe({
    next: () => booking.status = 'confirmed',
    error: (err) => console.error('Error confirming booking', err)
  });
}

rejectBooking(booking: BookingView) {
  this.bookingService.rejectBooking(booking._id!).subscribe({
    next: () => {
      // Remove from list after deletion
      this.bookings = this.bookings.filter(b => b._id !== booking._id);
    },
    error: (err) => console.error('Error rejecting booking', err)
  });
}

}

