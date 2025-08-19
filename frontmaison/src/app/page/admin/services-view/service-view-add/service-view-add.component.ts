import { Component, Output, EventEmitter, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgSelectModule } from '@ng-select/ng-select';
import { faTimes, faChevronLeft, faChevronRight, faUpload, faClock, faRunning, faUsers, faMapPin, faPlus } from '@fortawesome/free-solid-svg-icons';
import { ServiceService } from '../../../../services/service.service';
import { Service, ServiceType, Location } from '../../../../Model/service.model';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-service-view-add',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FontAwesomeModule, NgSelectModule],
  templateUrl: './service-view-add.component.html',
  styleUrl: './service-view-add.component.css'
})
export class ServiceViewAddComponent implements OnInit {
  @Input() service: Service | null = null;
  @Output() close = new EventEmitter<void>();

  serviceForm!: FormGroup;
  isSubmitting = false;
  errorMessage: string | null = null;
  selectedImageFiles: File[] = [];
  submitted = false;

  // Define enums as component properties for template access
  ServiceType = ServiceType;
  Location = Location;

  constructor(
    private fb: FormBuilder,
    private serviceService: ServiceService,
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.serviceForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      type: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      duration: ['', [Validators.required]],
      minParticipants: [1, [Validators.min(1), Validators.max(30)]],
       startTime: ['', [Validators.required]],
        endTime: ['', [Validators.required]],
      location: ['', Validators.required],
      minAge: [1, [Validators.required, Validators.min(1), Validators.max(120)]],
      isActive: [true],
    });
  }

  onImagesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
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

    if (this.serviceForm.valid) {
      const formValue: Service = this.serviceForm.value;
      const dto = new FormData();
      if (formValue.name) dto.append('name', formValue.name);
      if (formValue.description) dto.append('description', formValue.description);
      if (formValue.location) dto.append('location', formValue.location);
      if (formValue.type) dto.append('type', formValue.type);
      if (formValue.startTime) dto.append('startTime', formValue.startTime);
      if (formValue.endTime) dto.append('endTime', formValue.endTime);
      dto.append('price', formValue.price != null ? String(formValue.price) : '0');
      dto.append('minAge', formValue.minAge != null ? String(formValue.minAge) : '1');
      dto.append('minParticipants', formValue.minParticipants != null ? String(formValue.minParticipants) : '1');
      dto.append('duration', formValue.duration || '');
      dto.append('isActive', formValue.isActive ? 'true' : 'false');
      if (this.selectedImageFiles.length > 0) {
        this.selectedImageFiles.forEach(file => {
          dto.append('images', file);
        });
      }

      this.serviceService.createService(dto).subscribe({
        next: () => {
          this.isSubmitting = false;
          this.close.emit();
        },
        error: (err: HttpErrorResponse) => {
          console.error('Error response:', err);
          this.errorMessage = err.status === 400
            ? err.error?.message || 'Invalid input data.'
            : 'Error occurred while creating service item.';
          this.isSubmitting = false;
        },
      });
    } else {
      console.log('Form errors:', this.serviceForm.errors);
      this.errorMessage = 'Please fill all required fields correctly.';
      this.isSubmitting = false;
    }
  }

  getLocationDisplayName(location: Location): string {
    const map: { [key in Location]: string } = {
      [Location.SEA]: 'sea',
      [Location.MOUNTAIN]: 'mountain',
      [Location.LOCAL]: 'local',
    };
    return map[location] || 'Unknown';
  }

  getServiceDisplayName(type: ServiceType): string {
    const map: { [key in ServiceType]: string } = {
      [ServiceType.WELLNESS]: 'wellness',
      [ServiceType.ACTIVITY]: 'activity',
      [ServiceType.CULINARY]: 'culinary',
      [ServiceType.TRANSPORT]: 'transport',
      [ServiceType.ENTERTAINMENT]: 'entertainment',
    };
    return map[type] || 'Unknown';
  }

  onCancel(): void {
    this.close.emit();
  }



   faTimes = faTimes;
  faChevronLeft = faChevronLeft;
  faChevronRight = faChevronRight;
  faUpload = faUpload;
  faClock = faClock;
  faRunning = faRunning;
  faUsers = faUsers;
  faMapPin = faMapPin;
  faPlus = faPlus;

  // Available icons for selection
 
}
/* // Font Awesome icons
  faTimes = faTimes;
  faChevronLeft = faChevronLeft;
  faChevronRight = faChevronRight;
  faUpload = faUpload;
  faClock = faClock;
  faRunning = faRunning;
  faUsers = faUsers;
  faMapPin = faMapPin;
  faPlus = faPlus;

  // Available icons for selection
  availableIcons: { name: string; icon: IconDefinition }[] = [
    { name: 'Clock', icon: faClock },
    { name: 'Running', icon: faRunning },
    { name: 'Users', icon: faUsers },
    { name: 'Map Pin', icon: faMapPin },
  ];
 */
