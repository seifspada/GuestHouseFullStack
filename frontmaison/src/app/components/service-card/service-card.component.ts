import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faClock } from '@fortawesome/free-solid-svg-icons';
import { Service } from '../../Model/service.model';
import { ServiceDetailComponent } from '../../page/user/service/service-detail/service-detail.component';

@Component({
  selector: 'app-service-card',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './service-card.component.html',
  styleUrls: ['./service-card.component.css']
})
export class ServiceCardComponent {
  @Input() service!: Service;

  @Output() viewDetails = new EventEmitter<Service>();
  @Output() update = new EventEmitter<Service>();
  @Output() delete = new EventEmitter<string>();

  faClock = faClock;

  formatHours(start: string, end: string): string {
    return `${start} - ${end}`;
  }

  getServiceImage(service: Service): string {
    if (service.images && service.images.length > 0) {
      return `http://localhost:3000/uploads/services/${service.images[0]}`;
    }
    return 'assets/default-service-image.jpg';
  }

  deleteService(service: Service): void {
    if (service._id && confirm('Are you sure you want to delete this service item?')) {
      this.delete.emit(service._id); // Let parent handle actual deletion
    }
  }

  openUpdateService(service: Service): void {
    this.update.emit(service); // Let parent handle update UI
  }

  openServiceDetail(service: Service): void {
    this.viewDetails.emit(service); // Emit the entire service object
  }
}