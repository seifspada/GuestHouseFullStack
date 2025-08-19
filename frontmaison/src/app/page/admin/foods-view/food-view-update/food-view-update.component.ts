import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Food } from '../../../../Model/food.model';

@Component({
  selector: 'app-food-view-update',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule], // Include CommonModule and ReactiveFormsModule
  templateUrl: './food-view-update.component.html',
  styleUrls: ['./food-view-update.component.css']
})
export class FoodViewUpdateComponent implements OnInit {
  @Input() food: Food | null = null; // Define food input
  @Output() close = new EventEmitter<void>();
  foodForm: FormGroup;
  imagePreviews: string[] = [];
  categories: string[] = ['Breakfast', 'Dinner', 'Dessert', 'Drink'];

  constructor(private fb: FormBuilder) {
    this.foodForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      category: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      preparationTime: [''],
      spiceLevel: [0, [Validators.min(0), Validators.max(5)]],
      isAvailable: [true]
    });
  }

  ngOnInit(): void {
    if (this.food) {
      this.foodForm.patchValue({
        name: this.food.name,
        description: this.food.description || '',
        category: this.food.category,
        price: this.food.price,
        preparationTime: this.food.preparationTime || '',
        spiceLevel: this.food.spiceLevel || 0,
        isAvailable: this.food.isAvailable ?? true
      });
      this.imagePreviews = this.food.images?.length ? this.food.images : [];
    }
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.imagePreviews = [];
      Array.from(input.files).forEach(file => {
        if (file.type.match('image/jpeg|image/png|image/gif')) {
          const reader = new FileReader();
          reader.onload = () => {
            this.imagePreviews.push(reader.result as string);
            this.foodForm.updateValueAndValidity();
          };
          reader.readAsDataURL(file);
        }
      });
    }
  }

  onSubmit(): void {
    if (this.foodForm.valid) {
      const updatedFood: Food = {
        ...this.food,
        ...this.foodForm.value,
        images: this.imagePreviews
      };
      console.log('Updated Food:', updatedFood);
      this.close.emit();
    }
  }

  cancel(): void {
    this.close.emit();
  }
}