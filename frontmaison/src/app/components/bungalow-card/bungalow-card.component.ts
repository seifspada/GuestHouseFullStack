import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Bungalow } from '../../Model/bungalow.model';



@Component({
  selector: 'app-bungalow-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bungalow-card.component.html',
  styleUrls: ['./bungalow-card.component.css']
})
export class BungalowCardComponent {
  @Input() bungalow!: Bungalow;
 
   @Output() viewDetails = new EventEmitter<Bungalow>();
   @Output() update = new EventEmitter<Bungalow>();
   @Output() delete = new EventEmitter<string>();
 
    
 
   getBungalowImage(bungalow: Bungalow): string {
     if (bungalow.images && bungalow.images.length > 0) {
       return `http://localhost:3000/uploads/bungalows/${bungalow.images[0]}`;
     }
     return 'assets/default-bungalow-image.jpg';
   }
 
   deleteBungalow(bungalow: Bungalow): void {
     if (bungalow._id && confirm('Are you sure you want to delete this bungalow item?')) {
       this.delete.emit(bungalow._id); // Let parent handle actual deletion
     }
   }
 
   openUpdateBungalow(bungalow: Bungalow): void {
     this.update.emit(bungalow); // Let parent handle update UI
   }
 
   openBungalowDetail(bungalow: Bungalow): void {
     this.viewDetails.emit(bungalow); // Emit the entire bungalow object
   }
}