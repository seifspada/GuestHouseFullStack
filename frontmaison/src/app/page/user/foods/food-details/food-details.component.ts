import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Food } from '../../../../Model/food.model';

@Component({
  selector: 'app-food-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './food-details.component.html',
  styleUrls: ['./food-details.component.css'],
})
export class FoodDetailsComponent implements OnChanges {
  @Input() foodId: string | null = null;
  @Input() food: Food | null = null;
  @Output() close = new EventEmitter<void>();

  isOpen = false;
  currentImageIndex = 0;
  foodImages: string[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['food'] && this.food) {
      this.isOpen = true;
      const images = this.food.images || [];
      this.foodImages = images.length > 0 
        ? images.map(img => this.getImageUrl(img)) 
        : ['assets/default-food-image.jpg'];
    }
  }

  closeDetails(): void {
    this.isOpen = false;
    this.close.emit();
  }

  getImageUrl(image: string): string {
    return `http://localhost:3000/uploads/foods/${image}`;
  }

  nextImage(): void {
    this.currentImageIndex = (this.currentImageIndex + 1) % this.foodImages.length;
  }

  prevImage(): void {
    this.currentImageIndex = (this.currentImageIndex - 1 + this.foodImages.length) % this.foodImages.length;
  }

  setImageIndex(index: number): void {
    this.currentImageIndex = index;
  }

  getSpiceText(level: number): string {
    if (level === 0) return 'None';
    if (level <= 2) return 'Mild';
    if (level === 3) return 'Medium';
    if (level === 4) return 'Hot';
    return 'Very Hot';
  }
}