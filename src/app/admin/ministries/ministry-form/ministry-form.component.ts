import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Ministry } from '../../../core/services/ministry.service';

@Component({
  selector: 'app-ministry-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="modal-backdrop" (click)="onCancel()">
      <div class="modal-window" (click)="$event.stopPropagation()">
        
        <header class="modal-header">
          <h2 class="modal-title">{{ isEditMode ? 'Edit Ministry' : 'Create New Ministry' }}</h2>
          <button class="btn-close" (click)="onCancel()"><i class="fa-solid fa-xmark"></i></button>
        </header>
        
        <form [formGroup]="ministryForm" (ngSubmit)="onSubmit()" class="modal-body">
          
          <!-- Image Section -->
          <div class="form-section image-upload-section">
            <div class="image-preview" *ngIf="ministryForm.get('image_url')?.value" [style.backgroundImage]="'url(' + ministryForm.get('image_url')?.value + ')'"></div>
            <div class="image-input-group">
              <label>Ministry Image</label>
              <input type="text" formControlName="image_url" placeholder="Paste image URL">
              <small class="hint">Optional: Add a cover image for this ministry.</small>
            </div>
          </div>

          <!-- Main Info -->
          <div class="form-section">
            <div class="form-group full">
              <label>Ministry Name*</label>
              <input type="text" formControlName="name" placeholder="e.g. Youth Ministry" 
                     [class.error]="isFieldInvalid('name')">
              <span class="error-msg" *ngIf="isFieldInvalid('name')">Name is required.</span>
            </div>

            <div class="form-group full">
              <label>Description</label>
              <textarea formControlName="description" rows="4" placeholder="Describe this ministry and its purpose..."></textarea>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Leader Name</label>
                <input type="text" formControlName="leader_name" placeholder="e.g. John Smith">
              </div>

              <div class="form-group">
                <label>Contact Email</label>
                <input type="email" formControlName="contact_email" placeholder="ministry@church.com">
              </div>
            </div>

            <div class="form-group full">
              <label>Meeting Schedule</label>
              <input type="text" formControlName="meeting_schedule" placeholder="e.g. Sundays at 6 PM">
            </div>

            <div class="form-group full">
              <label class="checkbox-label">
                <input type="checkbox" formControlName="is_active">
                <span>Active (visible on public website)</span>
              </label>
            </div>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn-cancel" (click)="onCancel()">Cancel</button>
            <button type="submit" class="btn-save" [disabled]="ministryForm.invalid">
              <span *ngIf="!isSaving">{{ isEditMode ? 'Update Ministry' : 'Create Ministry' }}</span>
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
      background: rgba(17, 24, 39, 0.7);
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

    .form-section {
      margin-bottom: 24px;
    }

    .form-group {
      margin-bottom: 20px;
      flex: 1;
    }

    .form-group.full {
      width: 100%;
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

    input, textarea {
      width: 100%;
      padding: 10px 12px;
      border: 1px solid #D1D5DB;
      border-radius: 8px;
      font-family: inherit;
      font-size: 0.95rem;
      color: #111827;
      transition: border-color 0.2s, box-shadow 0.2s;
    }

    input:focus, textarea:focus {
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

    .checkbox-label {
      display: flex;
      align-items: center;
      gap: 10px;
      cursor: pointer;
      font-weight: normal;
    }

    .checkbox-label input[type="checkbox"] {
      width: auto;
      cursor: pointer;
    }

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
      background: #D4AF37;
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
export class MinistryFormComponent implements OnChanges {
  @Input() ministry: Ministry | null = null;
  @Output() save = new EventEmitter<Ministry>();
  @Output() cancel = new EventEmitter<void>();

  ministryForm: FormGroup;
  isEditMode = false;
  isSaving = false;

  constructor(private fb: FormBuilder) {
    this.ministryForm = this.fb.group({
      id: [null],
      name: ['', Validators.required],
      description: [''],
      leader_name: [''],
      contact_email: [''],
      meeting_schedule: [''],
      image_url: [''],
      is_active: [true]
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['ministry'] && this.ministry) {
      this.isEditMode = true;
      this.ministryForm.patchValue(this.ministry);
    } else {
      this.isEditMode = false;
      this.ministryForm.reset({ is_active: true });
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.ministryForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  onSubmit() {
    if (this.ministryForm.valid) {
      this.isSaving = true;
      this.save.emit(this.ministryForm.value);
      setTimeout(() => this.isSaving = false, 2000);
    } else {
      this.ministryForm.markAllAsTouched();
    }
  }

  onCancel() {
    this.cancel.emit();
  }
}
