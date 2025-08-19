import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormArray, FormControl, FormGroup } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faTimes, faChevronLeft, faChevronRight, faUpload, faUsers, faBed, faBath, faHome, faMapPin, faPlus, faQuestion, faWifi, faCar, faCoffee, faCouch, faBinoculars } from '@fortawesome/free-solid-svg-icons';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

@Component({
  selector: 'app-bungalow-view-update',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FontAwesomeModule],
  templateUrl: './bungalow-view-update.component.html',
  styleUrls: ['./bungalow-view-update.component.css'],
})
export class BungalowViewUpdateComponent implements OnInit {
  // Font Awesome icons
  faTimes = faTimes;
  faChevronLeft = faChevronLeft;
  faChevronRight = faChevronRight;
  faUpload = faUpload;
  faUsers = faUsers;
  faBed = faBed;
  faBath = faBath;
  faHome = faHome;
  faMapPin = faMapPin;
  faPlus = faPlus;
  faQuestion = faQuestion;
  faWifi = faWifi;
  faCar = faCar;
  faCoffee = faCoffee;
  faCouch = faCouch;
  faBinoculars = faBinoculars;

  // Icon mapping for dynamic icons
  private iconMap: { [key: string]: IconDefinition } = {
    'fa-solid fa-wifi': faWifi,
    'fa-solid fa-car': faCar,
    'fa-solid fa-coffee': faCoffee,
    'fa-solid fa-bath': faBath,
    'fa-solid fa-couch': faCouch,
    'fa-solid fa-binoculars': faBinoculars,
  };

  @Input() bungalow: {
    id: number;
    name: string;
    price: string;
    capacity: string;
    beds: string;
    baths: string;
    image: string;
    features: string[];
    popular?: boolean;
  } = {
    id: 0,
    name: '',
    price: '',
    capacity: '',
    beds: '',
    baths: '',
    image: '',
    features: [],
  };
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<any>();

  bungalowForm: FormGroup;
  currentImageIndex: number = 0;
  bungalowImages: string[] = [];
  imageCategories = [
    'Main View',
    'Exterior',
    'Living Room',
    'Bedroom',
    'Bathroom',
    'Kitchen',
    'Terrace',
    'Night View',
  ];

  bungalowDetails = {
    description:
      'Experience luxury and comfort in this beautifully designed bungalow. Every detail has been carefully crafted to provide you with an unforgettable stay, featuring modern amenities while maintaining a connection with nature.',
    amenities: [
      { icon: 'fa-solid fa-wifi', name: 'Free WiFi', included: true },
      { icon: 'fa-solid fa-car', name: 'Free Parking', included: true },
      { icon: 'fa-solid fa-coffee', name: 'Coffee Maker', included: true },
      { icon: 'fa-solid fa-bath', name: 'Private Bathroom', included: true },
      { icon: 'fa-solid fa-couch', name: 'Living Area', included: false },
      { icon: 'fa-solid fa-binoculars', name: 'Scenic Views', included: true },
    ],
    roomDetails: {
      area: '85 sq m',
      checkIn: '3:00 PM',
      checkOut: '11:00 AM',
      floor: 'Ground Floor',
      balcony: 'Private Terrace',
    },
    policies: [
      'No smoking inside the bungalow',
      'Pets allowed with prior approval',
      'Maximum occupancy as specified',
      'Quiet hours: 10 PM - 8 AM',
      'Check-in requires valid ID',
    ],
    location: {
      distance: '50m from main pool',
      nearbyAttractions: [
        'Beach access - 200m',
        'Restaurant - 100m',
        'Spa center - 150m',
        'Activity center - 300m',
      ],
    },
  };

  constructor(private fb: FormBuilder) {
    this.bungalowForm = this.fb.group({
      id: [0],
      name: ['', Validators.required],
      price: ['', [Validators.required, Validators.pattern(/^\$?\d+(\.\d{1,2})?$/)]],
      capacity: ['', Validators.required],
      beds: ['', Validators.required],
      baths: ['', Validators.required],
      rating: ['', Validators.required],
      popular: [false],
      description: ['', Validators.required],
      area: ['', Validators.required],
      checkIn: ['', Validators.required],
      checkOut: ['', Validators.required],
      floor: [''],
      balcony: [''],
      features: this.fb.array([], Validators.required),
      amenities: this.fb.array([], Validators.required),
      policies: this.fb.array([], Validators.required),
      nearbyAttractions: this.fb.array([], Validators.required),
      distance: ['', Validators.required],
      images: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    this.bungalowImages = [
      this.bungalow.image || '/placeholder.svg',
      '/placeholder.svg',
      '/placeholder.svg',
      '/placeholder.svg',
      '/placeholder.svg',
      '/placeholder.svg',
      '/placeholder.svg',
      '/placeholder.svg',
    ];

    if (this.bungalow) {
      this.bungalowForm.patchValue({
        id: this.bungalow.id,
        name: this.bungalow.name,
        price: this.bungalow.price,
        capacity: this.bungalow.capacity,
        beds: this.bungalow.beds,
        baths: this.bungalow.baths,
        rating: '4.9/5',
        popular: this.bungalow.popular || false,
        description: this.bungalowDetails.description,
        area: this.bungalowDetails.roomDetails.area,
        checkIn: this.bungalowDetails.roomDetails.checkIn,
        checkOut: this.bungalowDetails.roomDetails.checkOut,
        floor: this.bungalowDetails.roomDetails.floor,
        balcony: this.bungalowDetails.roomDetails.balcony,
        distance: this.bungalowDetails.location.distance,
      });

      this.setFormArray('features', this.bungalow.features);
      this.setFormArray('policies', this.bungalowDetails.policies);
      this.setFormArray('nearbyAttractions', this.bungalowDetails.location.nearbyAttractions);
      this.setFormArray('images', this.bungalowImages);
      this.setAmenitiesFormArray(this.bungalowDetails.amenities);
    }
  }

  getFormArray(controlName: string): FormArray {
    return this.bungalowForm.get(controlName) as FormArray;
  }

  getTypedFormArrayControl(controlName: string, index: number): FormControl {
    return this.getFormArray(controlName).at(index) as FormControl;
  }

  getAmenityControl(index: number, controlName: string): FormControl {
    return (this.getFormArray('amenities').at(index) as FormGroup).get(controlName) as FormControl;
  }

  getIcon(iconClass: string): IconDefinition | null {
    return this.iconMap[iconClass] || null;
  }

  private setFormArray(controlName: string, items: string[]): void {
    const formArray = this.getFormArray(controlName);
    formArray.clear();
    items.forEach(item => formArray.push(this.fb.control(item, Validators.required)));
  }

  private setAmenitiesFormArray(amenities: { icon: string; name: string; included: boolean }[]): void {
    const formArray = this.getFormArray('amenities');
    formArray.clear();
    amenities.forEach(amenity =>
      formArray.push(
        this.fb.group({
          icon: [amenity.icon, Validators.required],
          name: [amenity.name, Validators.required],
          included: [amenity.included],
        })
      )
    );
  }

  addFormArrayItem(controlName: string): void {
    const formArray = this.getFormArray(controlName);
    if (controlName === 'amenities') {
      formArray.push(
        this.fb.group({
          icon: ['', Validators.required],
          name: ['', Validators.required],
          included: [false],
        })
      );
    } else {
      formArray.push(this.fb.control('', Validators.required));
    }
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
        this.bungalowImages[this.currentImageIndex] = imageUrl;
        this.setFormArray('images', this.bungalowImages);
      };
      reader.readAsDataURL(file);
    }
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

  onClose(): void {
    this.close.emit();
  }

  onSave(): void {
    if (this.bungalowForm.valid) {
      this.save.emit({
        ...this.bungalowForm.value,
        images: this.bungalowImages,
      });
      this.close.emit();
    } else {
      console.log('Form is invalid:', this.bungalowForm.errors);
    }
  }
}