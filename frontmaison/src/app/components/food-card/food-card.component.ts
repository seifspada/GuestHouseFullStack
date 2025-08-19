import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

interface FoodItem {
  name: string;
  price: string;
  description: string;
  image: string;
  popular?: boolean;
  category: string;
  time: string;
}

@Component({
  selector: 'app-food-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './food-card.component.html',
  styleUrls: ['./food-card.component.css']
})
export class FoodCardComponent {
  @Input() food!: FoodItem; // Input for the food item
  @Output() viewDetails = new EventEmitter<FoodItem>(); // Event for View Details click

  onViewDetails(): void {
    this.viewDetails.emit(this.food);
  }
}