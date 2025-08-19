import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Bungalow } from '../../../../Model/bungalow.model';

@Component({
  selector: 'app-bungalow-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bungalow-detail.component.html',
  styleUrls: ['./bungalow-detail.component.css'],
})
export class BungalowDetailComponent implements OnChanges {
  @Input() bungalow: Bungalow | null = null;
  @Output() close = new EventEmitter<void>();

  currentImageIndex = 0;
  bungalowImages: string[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['bungalow'] && this.bungalow) {
      const images = this.bungalow.images || [];
      this.bungalowImages = images.length > 0 
        ? images.map(img => this.getImageUrl(img)) 
        : ['assets/default-bungalow-image.jpg'];
    }
  }

  closeDetails(): void {
    this.close.emit();
  }

  getImageUrl(image: string): string {
    return `http://localhost:3000/uploads/bungalows/${image}`;
  }

  nextImage(): void {
    this.currentImageIndex = (this.currentImageIndex + 1) % this.bungalowImages.length;
  }

  prevImage(): void {
    this.currentImageIndex = (this.currentImageIndex - 1 + this.bungalowImages.length) % this.bungalowImages.length;
  }

  setImageIndex(index: number): void {
    this.currentImageIndex = index;
  }
}