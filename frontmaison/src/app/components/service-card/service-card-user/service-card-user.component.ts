import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Service } from '../../../Model/service.model';
import { faClock } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-service-card-user',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './service-card-user.component.html',
  styleUrl: './service-card-user.component.css'
})
export class ServiceCardUserComponent {

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


  openServiceDetail(service: Service): void {
    this.viewDetails.emit(service); // Emit the entire service object
  }
}