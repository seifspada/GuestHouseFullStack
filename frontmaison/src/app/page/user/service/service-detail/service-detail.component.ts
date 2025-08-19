import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { Service } from '../../../../Model/service.model';

@Component({
  selector: 'app-service-detail',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './service-detail.component.html',
  styleUrls: ['./service-detail.component.css'],
})
export class ServiceDetailComponent implements OnChanges {
  @Input() service: Service | null = null;
  @Output() close = new EventEmitter<void>();

  faTimes = faTimes;

  currentImageIndex = 0;
  serviceImages: string[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['service'] && this.service) {
      const images = this.service.images || [];
      this.serviceImages = images.length > 0 
        ? images.map(img => this.getImageUrl(img)) 
        : ['assets/default-service-image.jpg'];
    }
  }

  closeDetails(): void {
    this.close.emit();
  }

  getImageUrl(image: string): string {
    return `http://localhost:3000/uploads/services/${image}`;
  }

  nextImage(): void {
    this.currentImageIndex = (this.currentImageIndex + 1) % this.serviceImages.length;
  }

  prevImage(): void {
    this.currentImageIndex = (this.currentImageIndex - 1 + this.serviceImages.length) % this.serviceImages.length;
  }

  setImageIndex(index: number): void {
    this.currentImageIndex = index;
  }
}