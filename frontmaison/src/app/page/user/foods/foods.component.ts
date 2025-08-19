import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FoodCardComponent } from '../../../components/food-card/food-card.component';
import { Food } from '../../../Model/food.model';
import { FoodService } from '../../../services/food.service';
import { FoodDetailsComponent } from './food-details/food-details.component';

@Component({
  selector: 'app-food-menu',
  standalone: true,
  imports: [CommonModule,FoodDetailsComponent],
  templateUrl: './foods.component.html',
  styleUrl: './foods.component.css',
})
export class FoodMenuComponent {
   foods: Food[] = [];
  selectedFood: Food | null = null;
  selectedAddFood: boolean = false;
  showFoodDetails: boolean = false;
  isUpdateMode: boolean = false; // Flag to track add vs. update mode
  error: string | null = null;

  constructor(private foodService: FoodService) {}

  ngOnInit(): void {
    this.loadFoods();
  }

  loadFoods(): void {
    this.foodService.getFoods().subscribe({
      next: (foods) => {
        this.foods = foods;
        this.error = null;
      },
      error: (error) => {
        this.error = 'Failed to load food items. Please try again later.';
        console.error('Error loading foods:', error);
      },
    });
  }

  deleteFood(food: Food): void {
    if (food._id) {
      if (confirm('Are you sure you want to delete this food item?')) {
        this.foodService.deleteFood(food._id).subscribe({
          next: () => {
            this.foods = this.foods.filter(f => f._id !== food._id);
            alert('Food item deleted successfully!');
          },
          error: (error) => {
            this.error = 'Failed to delete food item. Please try again.';
            console.error('Error deleting food:', error);
          },
        });
      }
    }
  }

  transformFood(food: Food | null): Food | null {
    if (!food) {
      return null;
    }
    return {
      ...food,
      spiceLevel: food.spiceLevel ?? 0,
      isAvailable: food.isAvailable ?? true,
      images: food.images?.length ? food.images : ['assets/default-food-image.jpg'],
      preparationTime: food.preparationTime ?? '',
      description: food.description ?? '',
    };
  }

  getFoodImage(food: Food): string {
    if (food.images && food.images.length > 0) {
      return `http://localhost:3000/uploads/foods/${food.images[0]}`;
    }
    return 'assets/default-food-image.jpg';
  }

  getCategories(): string[] {
    return [...new Set(this.foods.map(food => food.category))];
  }

  getFoodsByCategory(category: string): Food[] {
    return this.foods.filter(food => food.category === category);
  }

  getCategoryIcon(category: string): string {
    const icons: { [key: string]: string } = {
      Breakfast: '🍤',
      Dinner: '🍽️',
      Dessert: '🍰',
      Drink: '🥤',
    };
    return icons[category] || '🍴';
  }

  getCategoryDescription(category: string): string {
    const descriptions: { [key: string]: string } = {
      Appetizers: 'Start your meal with these delicious starters',
      'Main Course': 'Hearty and satisfying main dishes',
      Desserts: 'Sweet treats to end your meal',
      Beverages: 'Refreshing drinks to complement your meal',
    };
    return descriptions[category] || 'Delicious food items';
  }

  getCategoryTime(category: string): string {
    const times: { [key: string]: string } = {
      Appetizers: '10-15 min',
      'Main Course': '20-30 min',
      Desserts: '5-10 min',
      Beverages: '2-5 min',
    };
    return times[category] || 'Varies';
  }

  openFoodDetail(food: Food): void {
    this.selectedFood = food;
    this.selectedAddFood = false;
    this.isUpdateMode = false;
    this.showFoodDetails = true;
  }

  closeFoodDetail(): void {
    this.selectedFood = null;
    this.showFoodDetails = false;
  }

  
}