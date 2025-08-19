export interface CheckIn {
  _id: string;
  userId: string;
  bookingId: Booking;
  arrivalTime: string;
  parkingAssigned: string;
  roomReady: boolean;
  keyIssued: boolean;
  notes: string;
  actualArrival: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface Booking {
  _id: string;
  userId: BookingUser;
  bungalowId: Bungalow;
  checkInDate: string;
  checkOutDate: string;
  numberOfNights: number;
  numberOfAdults: number;
  numberOfChildren: number;
  totalPrice: number;
}

export interface BookingUser {
  _id: string;
  email: string;
  name: string;
  telephone: string;
}

export interface Bungalow {
  _id: string;
  name: string;
}
