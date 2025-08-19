import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Category, Food } from '../../../../Model/food.model';
import { FoodService } from '../../../../services/food.service';

@Component({
  selector: 'app-food-view-add',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './food-view-add.component.html',
  styleUrls: ['./food-view-add.component.css'],
})
export class FoodViewAddComponent implements OnInit {
  @Input() food: Food | null = null;
  @Output() close = new EventEmitter<void>();

  foodForm!: FormGroup;
  categories: Category[] = Object.values(Category);
  isSubmitting = false;
  errorMessage: string | null = null;
selectedImageFiles: File[] = [];
  submitted = false;


  constructor(
    private fb: FormBuilder,
    private foodService: FoodService,
  ) {}

  ngOnInit(): void {
    this.initForm();
    if (this.food) {
      this.foodForm.patchValue({
        ...this.food,
        price: this.food.price ?? 0,
        spiceLevel: this.food.spiceLevel ?? 0,
        isAvailable: this.food.isAvailable ?? true,
      });
    }
  }

  private initForm(): void {
    this.foodForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      category: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      preparationTime: [''],
      spiceLevel: [0, [Validators.min(0), Validators.max(5)]],
      isAvailable: [true],
    });
  }

  getCategoryDisplayName(category: Category): string {
    const map: { [key in Category]: string } = {
      [Category.BREAKFAST]: 'Breakfast',
      [Category.DINNER]: 'Dinner',
      [Category.DESSERT]: 'Dessert',
      [Category.DRINK]: 'Drink',
    };
    return map[category];
  }

onImagesSelected(event: Event): void {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    this.selectedImageFiles = [];
    const validImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
    const maxSize = 5 * 1024 * 1024; // 5MB
    let invalidFile = false;

    for (let i = 0; i < input.files.length; i++) {
      const file = input.files[i];
      if (validImageTypes.includes(file.type) && file.size <= maxSize) {
        this.selectedImageFiles.push(file);
      } else {
        invalidFile = true;
      }
    }

    this.errorMessage = invalidFile
      ? 'Some files were not valid (type or size).'
      : null;
  }
}


onSubmit(): void {
  this.submitted = true;
  this.isSubmitting = true;
  this.errorMessage = null;

  if (this.foodForm.valid) {
    const formValue = this.foodForm.value;
    const dto = new FormData();
    dto.append('name', formValue.name);
    dto.append('description', formValue.description);
    dto.append('category', formValue.category);
    dto.append('price', String(formValue.price)); // Ensure string
    dto.append('spiceLevel', String(formValue.spiceLevel));
    dto.append('preparationTime', formValue.preparationTime || '');
    dto.append('isAvailable', String(formValue.isAvailable));
if (this.selectedImageFiles.length > 0) {
  this.selectedImageFiles.forEach(file => {
    dto.append('images', file); // backend should use @UploadedFiles('images')
  });

}


    for (const pair of dto.entries()) {
      console.log(`${pair[0]}: ${pair[1]}`);
    }

    this.foodService.createFood(dto).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.close.emit();
      },
      error: (err) => {
        console.error('Error response:', err);
        this.errorMessage = err.error?.message || 'Error occurred while creating food item.';
        this.isSubmitting = false;
      },
    });
  } else {
    console.log('Form errors:', this.foodForm.errors);
    this.errorMessage = 'Please fill all required fields correctly.';
    this.isSubmitting = false;
  }
}

  onCancel(): void {
    this.close.emit();
  }
}
