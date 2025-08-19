import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importez CommonModule
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NotificationType, RecipientGroup } from '../../../Model/notification.model';
import { NotificationService } from '../../../services/notification.service';


@Component({
  selector: 'app-notifications-view',
  standalone: true, // Confirmez que le composant est standalone
  imports: [
    CommonModule, // Ajoutez ceci pour le pipe titlecase
    ReactiveFormsModule // Si vous utilisez des formulaires réactifs
  ],
  templateUrl: './notifications-view.component.html',
  styleUrls: ['./notifications-view.component.css']
})
export class NotificationsViewComponent implements OnInit {
  notificationForm!: FormGroup;
  notificationTypes = Object.values(NotificationType);
  recipientGroups = Object.values(RecipientGroup);
  isSubmitting = false;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.notificationForm = this.fb.group({
      type: ['', Validators.required],
      recipientGroup: ['', Validators.required],
      specificGuestId: [''],
      title: ['', [Validators.required, Validators.minLength(3)]],
      message: ['', [Validators.required, Validators.minLength(10)]],
      isUrgent: [false]
    });

    this.notificationForm.get('recipientGroup')?.valueChanges.subscribe(value => {
      const specificGuestIdControl = this.notificationForm.get('specificGuestId');
      if (value === RecipientGroup.SPECIFIC_GUEST) {
        specificGuestIdControl?.setValidators([Validators.required]);
      } else {
        specificGuestIdControl?.clearValidators();
      }
      specificGuestIdControl?.updateValueAndValidity();
    });
  }

  onSubmit(): void {
    if (this.notificationForm.valid) {
      this.isSubmitting = true;
      this.errorMessage = null;

      this.notificationService.createNotification(this.notificationForm.value)
        .subscribe({
          next: () => {
            this.isSubmitting = false;
            this.notificationForm.reset();
            alert('Notification créée avec succès !');
          },
          error: (error) => {
            this.isSubmitting = false;
            this.errorMessage = 'Erreur lors de la création de la notification';
            console.error(error);
          }
        });
    }
  }
}