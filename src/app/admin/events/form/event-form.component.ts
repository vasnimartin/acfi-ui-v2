import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ChurchEvent } from '../../../core/services/event.service';

@Component({
  selector: 'app-event-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="modal-backdrop" (click)="onCancel()">
      <div class="modal-window" (click)="$event.stopPropagation()">
        
        <header class="modal-header">
          <h2 class="modal-title">{{ isEditMode ? 'Edit Event' : 'Create New Event' }}</h2>
          <button class="btn-close" (click)="onCancel()"><i class="fa-solid fa-xmark"></i></button>
        </header>
        
        <form [formGroup]="eventForm" (ngSubmit)="onSubmit()" class="modal-body">
          
          <!-- Image Section -->
          <div class="form-section image-upload-section">
            <div class="image-preview" *ngIf="eventForm.get('image_url')?.value" [style.backgroundImage]="'url(' + eventForm.get('image_url')?.value + ')'"></div>
            <div class="image-input-group">
              <label>Event Cover Image</label>
              <input type="text" formControlName="image_url" placeholder="Paste image URL (e.g. Unsplash link)">
              <small class="hint">For now, paste a direct link to an image.</small>
            </div>
          </div>

          <!-- Main Info -->
          <div class="form-section">
            <div class="form-group full">
              <label>Event Title*</label>
              <input type="text" formControlName="title" placeholder="e.g. Christmas Eve Candlelight Service" 
                     [class.error]="isFieldInvalid('title')">
              <span class="error-msg" *ngIf="isFieldInvalid('title')">Title is required.</span>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Event Type</label>
                <div class="select-wrapper">
                  <select formControlName="event_type">
                    <option value="service">Service</option>
                    <option value="prayer">Prayer Meeting</option>
                    <option value="outreach">Outreach</option>
                    <option value="bible-study">Bible Study</option>
                    <option value="fellowship">Fellowship</option>
                    <option value="children">Children's Ministry</option>
                  </select>
                  <i class="fa-solid fa-chevron-down select-icon"></i>
                </div>
              </div>

              <div class="form-group">
                <label>Location</label>
                <input type="text" formControlName="location" placeholder="e.g. Main Sanctuary">
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Start Time*</label>
                <input type="datetime-local" formControlName="start_time" [class.error]="isFieldInvalid('start_time')">
              </div>
              <div class="form-group">
                <label>End Time</label>
                <input type="datetime-local" formControlName="end_time">
              </div>
            </div>

            <div class="form-group full">
              <label>Description</label>
              <textarea formControlName="description" rows="5" placeholder="Add details about this event..."></textarea>
            </div>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn-cancel" (click)="onCancel()">Cancel</button>
            <button type="submit" class="btn-save" [disabled]="eventForm.invalid">
              <span *ngIf="!isSaving">{{ isEditMode ? 'Update Event' : 'Create Event' }}</span>
              <span *ngIf="isSaving"><i class="fa-solid fa-spinner fa-spin"></i> Saving...</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  `,
  styles: [`
    .modal-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(17, 24, 39, 0.7); /* Darker, cooler backdrop */
      backdrop-filter: blur(4px);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
      animation: fadeIn 0.2s ease-out;
    }

    .modal-window {
      background: white;
      width: 90%;
      max-width: 600px;
      border-radius: 16px;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
      overflow: hidden;
      animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      display: flex;
      flex-direction: column;
      max-height: 90vh;
    }

    .modal-header {
      padding: 24px 32px;
      border-bottom: 1px solid #E5E7EB;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #F9FAFB;
    }

    .modal-title {
      font-size: 1.25rem;
      font-weight: 700;
      color: #111827;
      margin: 0;
    }

    .btn-close {
      background: none;
      border: none;
      font-size: 1.25rem;
      color: #9CA3AF;
      cursor: pointer;
      transition: color 0.2s;
    }

    .btn-close:hover {
      color: #DC2626;
    }

    .modal-body {
      padding: 32px;
      overflow-y: auto;
    }

    /* Form Styles */
    .form-section {
      margin-bottom: 24px;
    }

    .form-group {
      margin-bottom: 20px;
      flex: 1;
    }

    .form-row {
      display: flex;
      gap: 20px;
    }

    label {
      display: block;
      font-size: 0.85rem;
      font-weight: 600;
      color: #374151;
      margin-bottom: 8px;
    }

    input, select, textarea {
      width: 100%;
      padding: 10px 12px;
      border: 1px solid #D1D5DB;
      border-radius: 8px;
      font-family: inherit;
      font-size: 0.95rem;
      color: #111827;
      transition: border-color 0.2s, box-shadow 0.2s;
    }

    input:focus, select:focus, textarea:focus {
      outline: none;
      border-color: #D4AF37;
      box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.15);
    }
    
    input.error {
      border-color: #DC2626;
    }

    .error-msg {
      font-size: 0.8rem;
      color: #DC2626;
      margin-top: 4px;
      display: block;
    }

    .hint {
      display: block;
      margin-top: 6px;
      font-size: 0.8rem;
      color: #6B7280;
    }

    /* Select Customization */
    .select-wrapper {
      position: relative;
    }

    .select-icon {
      position: absolute;
      right: 12px;
      top: 50%;
      transform: translateY(-50%);
      pointer-events: none;
      font-size: 0.8rem;
      color: #6B7280;
    }
    
    select {
      appearance: none;
      background: white;
      cursor: pointer;
    }

    /* Image Upload Section */
    .image-upload-section {
      background: #F3F4F6;
      border-radius: 8px;
      padding: 16px;
      margin-bottom: 24px;
      display: flex;
      gap: 16px;
      align-items: center;
    }

    .image-preview {
      width: 80px;
      height: 80px;
      border-radius: 8px;
      background-size: cover;
      background-position: center;
      background-color: #E5E7EB;
      flex-shrink: 0;
      border: 1px solid #D1D5DB;
    }

    .image-input-group {
      flex: 1;
    }

    .image-input-group input {
      background: white;
    }

    /* Footer */
    .modal-footer {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      padding-top: 20px;
      border-top: 1px solid #E5E7EB;
      margin-top: 12px;
    }

    .btn-cancel {
      padding: 10px 20px;
      border-radius: 8px;
      border: 1px solid #D1D5DB;
      background: white;
      color: #374151;
      font-weight: 500;
      cursor: pointer;
      transition: background 0.2s;
    }

    .btn-cancel:hover {
      background: #F9FAFB;
    }

    .btn-save {
      padding: 10px 24px;
      border-radius: 8px;
      border: none;
      background: #D4AF37; /* Mute Gold */
      color: white;
      font-weight: 600;
      cursor: pointer;
      box-shadow: 0 4px 6px -1px rgba(212, 175, 55, 0.4);
      transition: background 0.2s, box-shadow 0.2s;
    }

    .btn-save:hover {
      background: #B4941F;
      box-shadow: 0 6px 8px -1px rgba(180, 148, 31, 0.5);
    }
    
    .btn-save:disabled {
      background: #E5E7EB;
      color: #9CA3AF;
      box-shadow: none;
      cursor: not-allowed;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    
    @keyframes slideUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class EventFormComponent implements OnChanges {
  @Input() event: ChurchEvent | null = null;
  @Output() save = new EventEmitter<ChurchEvent>();
  @Output() cancel = new EventEmitter<void>();

  eventForm: FormGroup;
  isEditMode = false;
  isSaving = false;

  constructor(private fb: FormBuilder) {
    this.eventForm = this.fb.group({
      id: [null],
      title: ['', Validators.required],
      start_time: ['', Validators.required],
      end_time: [''],
      location: [''],
      event_type: ['service'],
      image_url: [''],
      description: ['']
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['event'] && this.event) {
      this.isEditMode = true;
      const data = { ...this.event };
      if (data.start_time) data.start_time = this.formatDate(data.start_time);
      if (data.end_time) data.end_time = this.formatDate(data.end_time);
      
      this.eventForm.patchValue(data);
    } else {
      this.isEditMode = false;
      this.eventForm.reset({ event_type: 'service' });
    }
  }

  private formatDate(isoString: string): string {
    if (!isoString) return '';
    return new Date(isoString).toISOString().slice(0, 16);
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.eventForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  onSubmit() {
    if (this.eventForm.valid) {
      this.isSaving = true;
      const formValue = this.eventForm.value;
      // Ensure dates are full ISO strings
      if (formValue.start_time) formValue.start_time = new Date(formValue.start_time).toISOString();
      if (formValue.end_time) formValue.end_time = new Date(formValue.end_time).toISOString();
      
      this.save.emit(formValue);
      // Reset saving state is handled by parent re-rendering or modal closing usually, 
      // but good to have a timeout just in case it stays open
      setTimeout(() => this.isSaving = false, 2000);
    } else {
      this.eventForm.markAllAsTouched();
    }
  }

  onCancel() {
    this.cancel.emit();
  }
}
