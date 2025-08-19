import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IconDefinition, faMapMarkedAlt, faBuilding, faClock, faSwimmingPool, faSpa, faHiking, faEdit } from '@fortawesome/free-solid-svg-icons';
import { ServiceCardComponent } from '../../../components/service-card/service-card.component';
import { ServiceDetailComponent } from '../../user/service/service-detail/service-detail.component';
import { ServiceViewUpdateComponent } from './service-view-update/service-view-update.component';
import { ServiceViewAddComponent } from './service-view-add/service-view-add.component';
import { Service } from '../../../Model/service.model';
import { ServiceService } from '../../../services/service.service';

@Component({
  selector: 'app-services-view',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, ServiceCardComponent,ServiceViewAddComponent,ServiceDetailComponent],
  templateUrl: './services-view.component.html',
  styleUrls: ['./services-view.component.css']
})
export class ServicesViewComponent implements OnInit {

  @Output() delete = new EventEmitter<Service>();
  @Output() viewDetails = new EventEmitter<Service>();


services: Service[] = [];
  selectedService: Service | null = null;
  selectedAddService: boolean = false;
  showServiceDetails: boolean = false;
  isUpdateMode: boolean = false; // Flag to track add vs. update mode
  error: string | null = null;
    selectedServiceId: string | null = null;


  constructor(private serviceService: ServiceService) {}
  

  ngOnInit(): void {
    this.loadServices();
  }

  loadServices(): void {
    this.serviceService.getServices().subscribe({
      next: (services) => {
        this.services = services;
        this.error = null;
      },
      error: (error) => {
        this.error = 'Failed to load service items. Please try again later.';
        console.error('Error loading services:', error);
      },
    });
  }


 openViewDetail(): void {
  if (this.selectedService) {
    this.viewDetails.emit(this.selectedService);
  }
}

deleteService(id: string): void {
  if (confirm('Are you sure you want to delete this service item?')) {
    this.serviceService.deleteService(id).subscribe({
      next: () => {
        this.services = this.services.filter(f => f._id !== id);
        alert('Service item deleted successfully!');
      },
      error: (error) => {
        this.error = 'Failed to delete Service item. Please try again.';
        console.error('Error deleting Service:', error);
      },
    });
  }
}


  transformService(service: Service | null): Service | null {
    if (!service) {
      return null;
    }
    return {
      ...service,
     
      images: service.images?.length ? service.images : ['assets/default-service-image.jpg'],
      description: service.description ?? '',
    };
  }

  getServiceImage(service: Service): string {
    if (service.images && service.images.length > 0) {
      return `http://localhost:3000/uploads/services/${service.images[0]}`;
    }
    return 'assets/default-service-image.jpg';
  }

    // Called when clicking "View"
  viewServiceDetails(serviceId: string): void {
    const found = this.services.find(s => s._id === serviceId);
    if (found) {
      this.selectedServiceId = serviceId;
      this.selectedService = found;
    }
  }

  closeServiceDetail(): void {
    this.selectedServiceId = null;
    this.selectedService = null;
  }


  openServiceDetail(service: Service): void {
    this.selectedService = service;
    this.selectedAddService = false;
    this.isUpdateMode = false;
    this.showServiceDetails = true;
  }


  

  openAddService(): void {
    this.selectedAddService = true;
    this.selectedService = null;
    this.isUpdateMode = false;
    this.showServiceDetails = false;
  }

  openUpdateService(service: Service): void {
    this.selectedService = service;
    this.selectedAddService = true;
    this.isUpdateMode = true;
    this.showServiceDetails = false;
  }

  closeAddService(): void {
    this.selectedAddService = false;
    this.selectedService = null;
    this.isUpdateMode = false;
    this.loadServices();
  }
 
}