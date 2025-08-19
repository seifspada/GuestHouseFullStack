
import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profil',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profil.component.html',
  styleUrl: './profil.component.css',
})
export class ProfilComponent implements OnChanges {
  @Input() triggerToggle: boolean | null = null;
  isOpen = false;
  activeTab: 'profile' | 'bookings' | 'reviews' | 'settings' = 'profile';
  isEditing = false;
  showWriteReview = false;

  profileData = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@email.com',
    phone: '+1 (555) 123-4567',
    address: '123 Main Street, New York, NY 10001',
    dateOfBirth: '1990-05-15',
    preferences: {
      notifications: true,
      newsletter: true,
      smsUpdates: false,
    },
    bio: 'Travel enthusiast who loves exploring new places and experiencing different cultures.',
  };

  bookingHistory = [
    {
      id: 1,
      bungalow: 'Deluxe Garden Bungalow',
      checkIn: '2024-01-15',
      checkOut: '2024-01-18',
      status: 'Completed',
      total: '$450',
      rating: 5,
    },
    {
      id: 2,
      bungalow: 'Family Paradise Bungalow',
      checkIn: '2024-02-20',
      checkOut: '2024-02-23',
      status: 'Completed',
      total: '$660',
      rating: 4,
    },
    {
      id: 3,
      bungalow: 'Romantic Sunset Bungalow',
      checkIn: '2024-12-15',
      checkOut: '2024-12-18',
      status: 'Upcoming',
      total: '$540',
      rating: null,
    },
  ];

  myReviews = [
    {
      id: 1,
      serviceType: 'accommodation',
      serviceName: 'Deluxe Garden Bungalow',
      rating: 5,
      title: 'Perfect stay!',
      comment: 'Amazing bungalow with beautiful garden view. Staff was very helpful and the facilities were excellent.',
      date: '2024-01-20',
      categories: { quality: 5, service: 5, value: 4, ambiance: 5 },
    },
    {
      id: 2,
      serviceType: 'dining',
      serviceName: 'Restaurant Experience',
      rating: 4,
      title: 'Great food quality',
      comment: 'The local cuisine was delicious and authentic. Breakfast was especially good. Would recommend to other guests.',
      date: '2024-01-18',
      categories: { quality: 5, service: 4, value: 4, ambiance: 4 },
    },
  ];

  newReview = {
    serviceType: 'accommodation',
    serviceName: '',
    rating: 0,
    title: '',
    comment: '',
    categories: {
      quality: 0,
      service: 0,
      value: 0,
      ambiance: 0,
    },
  };

  ngOnChanges(): void {
    if (this.triggerToggle !== null) {
      this.isOpen = !this.isOpen;
    }
  }

  setActiveTab(tab: 'profile' | 'bookings' | 'reviews' | 'settings'): void {
    this.activeTab = tab;
  }

  toggleEdit(): void {
    if (this.isEditing) {
      console.log('Profile saved:', this.profileData);
    }
    this.isEditing = !this.isEditing;
  }

  toggleWriteReview(): void {
    this.showWriteReview = !this.showWriteReview;
  }

  handleStarClick(rating: number, category?: string): void {
    if (category) {
      this.newReview = {
        ...this.newReview,
        categories: {
          ...this.newReview.categories,
          [category]: rating,
        },
      };
    } else {
      this.newReview = { ...this.newReview, rating };
    }
  }

  handleSubmitReview(): void {
    if (
      this.newReview.rating === 0 ||
      !this.newReview.title.trim() ||
      !this.newReview.comment.trim() ||
      !this.newReview.serviceName.trim()
    ) {
      alert('Please fill in all required fields and provide a rating.');
      return;
    }

    const review = {
      id: Date.now(),
      serviceType: this.newReview.serviceType,
      serviceName: this.newReview.serviceName,
      rating: this.newReview.rating,
      title: this.newReview.title,
      comment: this.newReview.comment,
      date: new Date().toISOString().split('T')[0],
      categories: { ...this.newReview.categories },
    };

    this.myReviews = [review, ...this.myReviews];
    this.newReview = {
      serviceType: 'accommodation',
      serviceName: '',
      rating: 0,
      title: '',
      comment: '',
      categories: { quality: 0, service: 0, value: 0, ambiance: 0 },
    };
    this.showWriteReview = false;
  }

  handlePreferenceChange(field: string, value: boolean): void {
    this.profileData = {
      ...this.profileData,
      preferences: {
        ...this.profileData.preferences,
        [field]: value,
      },
    };
  }
}
