import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CheckIn } from '../../../Model/check-in.model';
import { CheckInService } from '../../../services/check-in.service';


interface CheckInData {
  arrivalTime: string;
  roomReady: boolean;
  keyIssued: boolean;
  notes: string;
  parkingAssigned: string;
}

@Component({
  selector: 'app-check-in-view',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './check-in-view.component.html',
  styleUrls: ['./check-in-view.component.css'],
})
export class CheckInViewComponent implements OnInit {
  activeTab: 'arriving' | 'checked-in' = 'arriving';
  searchTerm: string = '';
  checkInData: CheckInData = {
    arrivalTime: '',
    roomReady: true,
    keyIssued: false,
    notes: '',
    parkingAssigned: '',
  };

  checkIns: CheckIn[] = [];

  constructor(private checkInService: CheckInService) {}

  ngOnInit() {
    this.loadCheckIns();
  }

  loadCheckIns() {
    this.checkInService.getCheckIn().subscribe({
      next: (data) => {
        this.checkIns = data;
      },
      error: (err) => {
        console.error('Failed to load check-ins', err);
      },
    });
  }

  setActiveTab(tab: 'arriving' | 'checked-in'): void {
    this.activeTab = tab;
  }

handleCheckIn(checkInId: string): void {
  const currentTime = new Date().toISOString();
  const checkIn = this.checkIns.find(c => c._id === checkInId);
  if (!checkIn) return;

  const payload = {
    arrivalTime: this.checkInData.arrivalTime || currentTime,
    roomReady: this.checkInData.roomReady,
    keyIssued: this.checkInData.keyIssued,
    notes: this.checkInData.notes,
    parkingAssigned: this.checkInData.parkingAssigned,
    bookingId: checkIn.bookingId._id,
    // userId souvent injecté côté backend par le JWT, donc pas besoin ici
  };

  this.checkInService.createCheckIn(payload).subscribe({
    next: updatedCheckIn => {
      const index = this.checkIns.findIndex(c => c._id === updatedCheckIn._id);
      if (index !== -1) this.checkIns[index] = updatedCheckIn;
      alert('User checked in successfully!');
      this.checkInData = {
        arrivalTime: '',
        roomReady: true,
        keyIssued: false,
        notes: '',
        parkingAssigned: '',
      };
    },
    error: err => {
      console.error('Check-in failed', err);
    }
  });
}


  get filteredCheckIns(): CheckIn[] {
    return this.checkIns.filter(checkIn => {
      const name = checkIn.bookingId.userId.name.toLowerCase();
      const matchesSearch = name.includes(this.searchTerm.toLowerCase());
      const matchesTab =
        this.activeTab === 'arriving'
          ? !checkIn.actualArrival // or other logic to define expected vs arrived
          : this.activeTab === 'checked-in'
            ? !!checkIn.actualArrival
            : true;

      return matchesSearch && matchesTab;
    });
  }

  get arrivingCount(): number {
    return this.filteredCheckIns.filter(c => !c.actualArrival).length;
  }

  get checkedInCount(): number {
    return this.filteredCheckIns.filter(c => !!c.actualArrival).length;
  }
}
