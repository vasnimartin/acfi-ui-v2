import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ChurchEvent } from '../../../core/services/event.service';

@Component({
  selector: 'app-event-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="modal-overlay">
      <div class="modal-content">
        <h2>{{ isEditMode ? 'Edit Event' : 'Add New Event' }}</h2>
        
        <form [formGroup]="eventForm" (ngSubmit)="onSubmit()">
          
          <div class="form-group">
            <label>Title*</label>
            <input type="text" formControlName="title" placeholder="e.g. Christmas Eve Service">
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Start Time*</label>
              <input type="datetime-local" formControlName="start_time">
            </div>
            <div class="form-group">
              <label>End Time</label>
              <input type="datetime-local" formControlName="end_time">
            </div>
          </div>

          <div class="form-group">
            <label>Location</label>
            <input type="text" formControlName="location" placeholder="e.g. Main Sanctuary">
          </div>

          <div class="form-group">
            <label>Event Type</label>
            <select formControlName="event_type">
              <option value="service">Service</option>
              <option value="fellowship">Fellowship</option>
              <option value="bible-study">Bible Study</option>
              <option value="outreach">Outreach</option>
              <option value="christmas">Christmas</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div class="form-group">
            <label>Image URL</label>
            <input type="text" formControlName="image_url" placeholder="https://...">
            <small>Paste a link to an image for now.</small>
          </div>

          <div class="form-group">
            <label>Description</label>
            <textarea formControlName="description" rows="4"></textarea>
          </div>

          <div class="actions">
            <button type="button" class="btn-cancel" (click)="onCancel()">Cancel</button>
            <button type="submit" class="btn-save" [disabled]="eventForm.invalid">
              {{ isEditMode ? 'Update' : 'Create' }}
            </button>
          </div>

        </form>
      </div>
    </div>
  `,
  styles: [`
    .modal-overlay {
      position: fixed; top: 0; left: 0; width: 100%; height: 100%;
      background: rgba(0,0,0,0.5);
      display: flex; justify-content: center; align-items: center;
      z-index: 1000;
    }
    .modal-content {
      background: white; padding: 2rem; border-radius: 8px; width: 90%; max-width: 500px;
      max-height: 90vh; overflow-y: auto;
    }
    h2 { margin-top: 0; margin-bottom: 1.5rem; color: #333; }
    .form-group { margin-bottom: 1rem; }
    .form-row { display: flex; gap: 1rem; }
    .form-row .form-group { flex: 1; }
    label { display: block; margin-bottom: 0.5rem; font-weight: 500; font-size: 0.9rem; }
    input, select, textarea {
      width: 100%; padding: 0.75rem; border: 1px solid #ddd; border-radius: 4px; font-family: inherit;
    }
    .actions { display: flex; justify-content: flex-end; gap: 1rem; margin-top: 1.5rem; }
    button { padding: 0.75rem 1.5rem; border: none; border-radius: 4px; cursor: pointer; font-weight: 600; }
    .btn-cancel { background: #eee; color: #333; }
    .btn-save { background: #007bff; color: white; }
    .btn-save:disabled { background: #ccc; cursor: not-allowed; }
  `]
})
export class EventFormComponent implements OnChanges {
  @Input() event: ChurchEvent | null = null;
  @Output() save = new EventEmitter<ChurchEvent>();
  @Output() cancel = new EventEmitter<void>();

  eventForm: FormGroup;
  isEditMode = false;

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
      // Format dates for datetime-local input (YYYY-MM-DDTHH:mm)
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

  onSubmit() {
    if (this.eventForm.valid) {
      const formValue = this.eventForm.value;
      // Ensure dates are full ISO strings
      if (formValue.start_time) formValue.start_time = new Date(formValue.start_time).toISOString();
      if (formValue.end_time) formValue.end_time = new Date(formValue.end_time).toISOString();
      
      this.save.emit(formValue);
    }
  }

  onCancel() {
    this.cancel.emit();
  }
}
