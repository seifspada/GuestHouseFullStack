import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { BungalowDetailComponent } from '../../user/bungalows/bungalow-detail/bungalow-detail.component';
import { BungalowViewUpdateComponent } from './bungalow-view-update/bungalow-view-update.component';
import { BungalowViewAddComponent } from './bungalow-view-add/bungalow-view-add.component';
import { Bungalow } from '../../../Model/bungalow.model';
import { BungalowService } from '../../../services/bungalow.service';
import { BungalowCardComponent } from '../../../components/bungalow-card/bungalow-card.component';

@Component({
  selector: 'app-bungalow-view',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, BungalowViewAddComponent,BungalowCardComponent,BungalowDetailComponent],
  templateUrl: './bungalows-view.component.html',
  styleUrls: ['./bungalows-view.component.css'],
})
export class BungalowViewComponent {
    bungalows: Bungalow[] = [];
     selectedBungalow: Bungalow | null = null;
     selectedAddBungalow: boolean = false;
     showBungalowDetails: boolean = false;
     isUpdateMode: boolean = false; // Flag to track add vs. update mode
     error: string | null = null;
   
     constructor(private bungalowService: BungalowService) {}
   
     ngOnInit(): void {
       this.loadBungalows();
     }
   
     loadBungalows(): void {
       this.bungalowService.getBungalows().subscribe({
         next: (bungalows) => {
           this.bungalows = bungalows;
           this.error = null;
         },
         error: (error) => {
           this.error = 'Failed to load bungalow items. Please try again later.';
           console.error('Error loading bungalows:', error);
         },
       });
     }
   
    deleteBungalow(id: string): void {
  if (confirm('Are you sure you want to delete this Bungalow item?')) {
    this.bungalowService.deleteBungalow(id).subscribe({
      next: () => {
        this.bungalows = this.bungalows.filter(f => f._id !== id);
        alert('Bungalow item deleted successfully!');
      },
      error: (error) => {
        this.error = 'Failed to delete Bungalow item. Please try again.';
        console.error('Error deleting Bungalow:', error);
      },
    });
  }
}
   
     transformBungalow(bungalow: Bungalow | null): Bungalow | null {
       if (!bungalow) {
         return null;
       }
       return {
         ...bungalow,
         isAvailable: bungalow.isAvailable ?? true,
         images: bungalow.images?.length ? bungalow.images : ['assets/default-bungalow-image.jpg'],
         description: bungalow.description ?? '',
       };
     }
   
     getBungalowImage(bungalow: Bungalow): string {
       if (bungalow.images && bungalow.images.length > 0) {
         return `http://localhost:3000/uploads/bungalows/${bungalow.images[0]}`;
       }
       return 'assets/default-bungalow-image.jpg';
     }
   
 
   
   
  
   
     openBungalowDetail(bungalow: Bungalow): void {
       this.selectedBungalow = bungalow;
       this.selectedAddBungalow = false;
       this.isUpdateMode = false;
       this.showBungalowDetails = true;
     }
   
     closeBungalowDetail(): void {
       this.selectedBungalow = null;
       this.showBungalowDetails = false;
     }
   
     openAddBungalow(): void {
       this.selectedAddBungalow = true;
       this.selectedBungalow = null;
       this.isUpdateMode = false;
       this.showBungalowDetails = false;
     }
   
     openUpdateBungalow(bungalow: Bungalow): void {
       this.selectedBungalow = bungalow;
       this.selectedAddBungalow = true;
       this.isUpdateMode = true;
       this.showBungalowDetails = false;
     }
   
     closeAddFood(): void {
       this.selectedAddBungalow = false;
       this.selectedBungalow = null;
       this.isUpdateMode = false;
       this.loadBungalows();
     }
}