import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Food } from '../../../Model/food.model';

@Component({
  selector: 'app-food-card',
  templateUrl: './food-card-user.component.html',
  styleUrls: ['./food-card-user.component.css']
})
export class FoodCardUserComponent {
  @Input() food!: Food;
  @Output() view = new EventEmitter<Food>();
  @Output() update = new EventEmitter<Food>();
  @Output() delete = new EventEmitter<Food>();

  getFoodImage(food: Food): string {
    if (food.images && food.images.length > 0) {
      return `http://localhost:3000/uploads/foods/${food.images[0]}`;
    }
    return 'assets/default-food-image.jpg';
  }

  onView(food: Food) {
    this.view.emit(food);
  }

  onUpdate(food: Food) {
    this.update.emit(food);
  }

  onDelete(food: Food) {
    this.delete.emit(food);
  }
}
