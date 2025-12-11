import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PrayerRequestService } from '../../core/services/prayer-request.service';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-prayer-request-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './prayer-request-form.component.html',
  styleUrls: ['./prayer-request-form.component.scss']
})
export class PrayerRequestFormComponent {
  requestText = '';
  isPrivate = false;
  submitterName = '';
  submitterEmail = '';
  submitting = false;
  isLoggedIn = false;
  userId: string | null = null;

  constructor(
    private prayerRequestService: PrayerRequestService,
    private authService: AuthService,
    private toastService: ToastService
  ) {
    this.authService.currentUser$.subscribe(user => {
      this.isLoggedIn = !!user;
      this.userId = user?.id || null;
    });
  }

  submitRequest() {
    if (!this.requestText.trim()) {
      this.toastService.error('Please enter your prayer request');
      return;
    }

    // If not logged in, require name
    if (!this.isLoggedIn && !this.submitterName.trim()) {
      this.toastService.error('Please enter your name');
      return;
    }

    this.submitting = true;

    const request = {
      request_text: this.requestText,
      is_private: this.isPrivate,
      user_id: this.userId || undefined,
      submitter_name: !this.isLoggedIn ? this.submitterName : undefined,
      submitter_email: !this.isLoggedIn ? this.submitterEmail : undefined
    };

    this.prayerRequestService.submitPrayerRequest(request).subscribe({
      next: () => {
        this.toastService.success('Your prayer request has been received. We are praying for you.');
        this.resetForm();
        this.submitting = false;
      },
      error: (error) => {
        console.error('Error submitting prayer request:', error);
        this.toastService.error('Failed to submit prayer request. Please try again.');
        this.submitting = false;
      }
    });
  }

  private resetForm() {
    this.requestText = '';
    this.isPrivate = false;
    this.submitterName = '';
    this.submitterEmail = '';
  }
}
