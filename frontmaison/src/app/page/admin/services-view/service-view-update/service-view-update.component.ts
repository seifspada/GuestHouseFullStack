import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';

@Component({
  selector: 'app-service-view-update',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './service-view-update.component.html',
  styleUrls: ['./service-view-update.component.css'],
})
export class ServiceViewUpdateComponent implements OnInit {
  @Input() service: any;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<any>();

  serviceForm: FormGroup;
  currentImageIndex: number = 0;
  serviceImages: string[] = [];

  serviceDetails = {
    equipment: [
      'Professional safety equipment',
      'High-quality gear provided',
      'Weather-appropriate clothing recommended',
      'Comfortable shoes required',
      'Sun protection advised',
      'Water bottle recommended',
    ],
    safetyInfo: [
      'Certified professional guides',
      'Emergency communication equipment',
      'First aid certified staff',
      'Weather monitoring protocols',
      'Safety briefing before activity',
      'Insurance coverage included',
    ],
    meetingPoint: 'Activity Center - Main Reception',
    ageRequirements: 'Minimum age 12 years (with adult supervision)',
    fitnessLevel: '',
    groupSize: 'Maximum 12 participants per group',
    cancellationPolicy: [
      'Free cancellation up to 24 hours before',
      '50% refund 12-24 hours before',
      'No refund within 12 hours',
      'Weather cancellations - full refund',
    ],
    whatToBring: [
      'Comfortable clothing',
      'Closed-toe shoes',
      'Sun hat and sunglasses',
      'Personal water bottle',
      'Camera (optional)',
      'Small backpack',
    ],
  };

  constructor(private fb: FormBuilder) {
    this.serviceForm = this.fb.group({
      title: ['', Validators.required],
      price: ['', [Validators.required, Validators.pattern(/^\$?\d+(\.\d{1,2})?$/)]],
      type: ['', Validators.required],
      difficulty: ['', Validators.required],
      hours: ['', Validators.required],
      duration: ['', Validators.required],
      environment: ['', Validators.required],
      fullDescription: ['', Validators.required],
      groupSize: ['', Validators.required],
      meetingPoint: ['', Validators.required],
      included: this.fb.array([], Validators.required),
      equipment: this.fb.array([], Validators.required),
      safetyInfo: this.fb.array([], Validators.required),
      cancellationPolicy: this.fb.array([], Validators.required),
      whatToBring: this.fb.array([], Validators.required),
      ageRequirements: ['', Validators.required],
      fitnessLevel: ['', Validators.required],
      images: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    this.serviceImages = [
      this.service?.image || '/placeholder.svg',
      '/placeholder.svg',
      '/placeholder.svg',
      '/placeholder.svg',
      '/placeholder.svg',
      '/placeholder.svg',
      '/placeholder.svg',
      '/placeholder.svg',
    ];

    if (this.service) {
      this.serviceForm.patchValue({
        title: this.service.title,
        price: this.service.price,
        type: this.service.type,
        difficulty: this.service.difficulty,
        hours: this.service.hours,
        duration: this.service.duration,
        environment: this.service.environment,
        fullDescription: `${this.service.description} Our experienced guides ensure a safe and memorable experience for all skill levels. This activity takes place in ${this.service.environment} and offers breathtaking views and unique photo opportunities.`,
        groupSize: this.serviceDetails.groupSize,
        meetingPoint: this.serviceDetails.meetingPoint,
        ageRequirements: this.serviceDetails.ageRequirements,
        fitnessLevel: this.service.difficulty || '',
      });

      this.setFormArray('included', this.service.included);
      this.setFormArray('equipment', this.serviceDetails.equipment);
      this.setFormArray('safetyInfo', this.serviceDetails.safetyInfo);
      this.setFormArray('cancellationPolicy', this.serviceDetails.cancellationPolicy);
      this.setFormArray('whatToBring', this.serviceDetails.whatToBring);
      this.setFormArray('images', this.serviceImages);
    }
  }

  getFormArray(controlName: string): FormArray {
    return this.serviceForm.get(controlName) as FormArray;
  }

  getFormControl(controlName: string, index: number): FormControl {
    return this.getFormArray(controlName).at(index) as FormControl;
  }

  private setFormArray(controlName: string, items: string[]): void {
    const formArray = this.getFormArray(controlName);
    formArray.clear();
    items.forEach(item => formArray.push(this.fb.control(item, Validators.required)));
  }

  addFormArrayItem(controlName: string): void {
    const formArray = this.getFormArray(controlName);
    formArray.push(this.fb.control('', Validators.required));
  }

  removeFormArrayItem(controlName: string, index: number): void {
    const formArray = this.getFormArray(controlName);
    formArray.removeAt(index);
  }

  handleImageUpload(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        const imageUrl = reader.result as string;
        this.serviceImages[this.currentImageIndex] = imageUrl;
        this.setFormArray('images', this.serviceImages);
      };
      reader.readAsDataURL(file);
    }
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

  onClose(): void {
    this.close.emit();
  }

  onSave(): void {
    if (this.serviceForm.valid) {
      this.save.emit({
        ...this.serviceForm.value,
        images: this.serviceImages,
      });
      this.close.emit();
    } else {
      console.log('Form is invalid:', this.serviceForm.errors);
    }
  }
}