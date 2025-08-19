export interface Booking {
  _id?: string; // id MongoDB, optionnel pour les nouvelles réservations
  userId: string; // présent côté backend, utile pour affichage frontend
  description?: string;
  bungalowId: string;
  checkInDate: string;  // ISO date string
  checkOutDate: string; // ISO date string
  numberOfNights: number;
  numberOfAdults: number;
  numberOfChildren: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled';
}

export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
}

export interface CreateBookingDto {
  bungalowId: string;
  description?: string;
  checkInDate: string;
  checkOutDate: string;
  numberOfNights: number;
  numberOfAdults: number;
  numberOfChildren: number;
  totalPrice: number;
  status: BookingStatus;
}


export interface BookingRequest {
  _id?: string;

  userId: {
    _id: string;
    name: string;
  } | string;

  description?: string;

  bungalowId: {
    _id: string;
    name: string;
  } | string;

  checkInDate: string;
  checkOutDate: string;

  numberOfNights: number;
  numberOfAdults: number;
  numberOfChildren: number;
  totalPrice: number;

  status: 'pending' | 'confirmed' | 'cancelled';
}
