import {
  Component,
  Output,
  EventEmitter,
  OnInit,
  Input
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  FormGroup
} from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgSelectModule } from '@ng-select/ng-select';
import {
  faTimes, faChevronLeft, faChevronRight, faUpload, faUsers, faBed, faBath,
  faHome, faMapPin, faPlus, faQuestion, faWifi, faCar, faCoffee, faCouch, faBinoculars
} from '@fortawesome/free-solid-svg-icons';
import { BungalowService } from '../../../../services/bungalow.service';
import { Bungalow } from '../../../../Model/bungalow.model';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-bungalow-view-add',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FontAwesomeModule, NgSelectModule],
  templateUrl: './bungalow-view-add.component.html',
  styleUrls: ['./bungalow-view-add.component.css'],
})
export class BungalowViewAddComponent implements OnInit {
  @Input() bungalow: Bungalow | null = null;
  @Output() close = new EventEmitter<void>();

  bungalowForm!: FormGroup;
  isSubmitting = false;
  errorMessage: string | null = null;
  selectedImageFiles: File[] = [];
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private bungalowService: BungalowService,
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.bungalowForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      price: [0, [Validators.required, Validators.min(0)]],
      maxOccupancy: [0, [Validators.required, Validators.min(1)]],
      baths: [1, [Validators.required, Validators.min(1)]],
      beds: [1, [Validators.required, Validators.min(1)]],
      area: ['', Validators.required],
      popular: [true],
      isAvailable: [true],
      images: [[]] // Optional: for reference / completeness
    });
  }

  onImagesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const validImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
      const maxSize = 5 * 1024 * 1024; // 5MB
      let invalidFile = false;

      Array.from(input.files).forEach(file => {
        const isValidType = validImageTypes.includes(file.type);
        const isValidSize = file.size <= maxSize;
        const isDuplicate = this.selectedImageFiles.some(f => f.name === file.name && f.size === file.size);

        if (isValidType && isValidSize && !isDuplicate) {
          this.selectedImageFiles.push(file);
        } else {
          invalidFile = true;
        }
      });

      this.errorMessage = invalidFile
        ? 'Some files were not valid (type, size, or duplicate).'
        : null;
    }
  }

  onSubmit(): void {
    this.submitted = true;
    this.isSubmitting = true;
    this.errorMessage = null;

    if (this.bungalowForm.valid) {
      const formValue = this.bungalowForm.value;
      const dto = new FormData();

      dto.append('name', formValue.name);
      dto.append('description', formValue.description);
      dto.append('area', formValue.area);
      dto.append('price', String(formValue.price));
      dto.append('maxOccupancy', String(formValue.maxOccupancy));
      dto.append('baths', String(formValue.baths));
      dto.append('beds', String(formValue.beds));
      dto.append('popular', formValue.popular ? 'true' : 'false');
      dto.append('isAvailable', formValue.isAvailable ? 'true' : 'false');

      this.selectedImageFiles.forEach(file => {
        dto.append('images', file);
      });

      this.bungalowService.createBungalow(dto).subscribe({
        next: () => {
          this.isSubmitting = false;
          this.close.emit();
        },
        error: (err: HttpErrorResponse) => {
          console.error('Error response:', err);
          this.errorMessage = err.status === 400
            ? err.error?.message || 'Invalid input data.'
            : 'An error occurred while creating bungalow.';
          this.isSubmitting = false;
        },
      });
    } else {
      console.warn('Form invalid:', this.bungalowForm.errors);
      this.errorMessage = 'Please correct the highlighted errors.';
      this.isSubmitting = false;
    }
  }

  onCancel(): void {
    this.close.emit();
  }
}
