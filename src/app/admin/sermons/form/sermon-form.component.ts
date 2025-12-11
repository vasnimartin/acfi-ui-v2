import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Sermon } from '../../../core/services/sermon.service';

@Component({
  selector: 'app-sermon-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="modal-backdrop" (click)="onCancel()">
      <div class="modal-window" (click)="$event.stopPropagation()">
        
        <header class="modal-header">
          <h2 class="modal-title">{{ isEditMode ? 'Edit Sermon' : 'Add New Sermon' }}</h2>
          <button class="btn-close" (click)="onCancel()"><i class="fa-solid fa-xmark"></i></button>
        </header>
        
        <form [formGroup]="sermonForm" (ngSubmit)="onSubmit()" class="modal-body">
          
          <div class="form-section">
            <div class="form-group full">
              <label>Sermon Title*</label>
              <input type="text" formControlName="title" placeholder="e.g. Walking by Faith">
              <span class="error-msg" *ngIf="isFieldInvalid('title')">Title is required.</span>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Speaker</label>
                <input type="text" formControlName="speaker" placeholder="e.g. Pastor John Doe">
              </div>
              
              <div class="form-group">
                <label>Date Preached</label>
                <input type="date" formControlName="created_at">
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Scripture Reference</label>
                <input type="text" formControlName="scripture" placeholder="e.g. John 3:16-18">
              </div>
              <!-- Series removed as per schema -->
            </div>

            <div class="form-group full">
              <label>Description</label>
              <textarea formControlName="description" rows="3" placeholder="Sermon summary..."></textarea>
            </div>

          </div>

          <div class="modal-footer">
            <button type="button" class="btn-cancel" (click)="onCancel()">Cancel</button>
            <button type="submit" class="btn-save" [disabled]="sermonForm.invalid">
              <span *ngIf="!isSaving">{{ isEditMode ? 'Update Sermon' : 'Create Sermon' }}</span>
              <span *ngIf="isSaving"><i class="fa-solid fa-spinner fa-spin"></i> Saving...</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  `,
  styles: [`
    /* Reusing similar modal styles for consistency */
    .modal-backdrop {
      position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
      background: rgba(17, 24, 39, 0.7); backdrop-filter: blur(4px);
      display: flex; justify-content: center; align-items: center; z-index: 1000;
      animation: fadeIn 0.2s ease-out;
    }
    .modal-window {
      background: white; width: 90%; max-width: 600px; border-radius: 16px;
      box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1); overflow: hidden;
      animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      display: flex; flex-direction: column; max-height: 90vh;
    }
    .modal-header {
      padding: 24px 32px; border-bottom: 1px solid #E5E7EB; background: #F9FAFB;
      display: flex; justify-content: space-between; align-items: center;
    }
    .modal-title { margin: 0; font-size: 1.25rem; font-weight: 700; color: #111827; }
    .btn-close { background: none; border: none; font-size: 1.25rem; color: #9CA3AF; cursor: pointer; }
    .btn-close:hover { color: #DC2626; }
    .modal-body { padding: 32px; overflow-y: auto; }
    
    .form-group { margin-bottom: 20px; flex: 1; }
    .form-row { display: flex; gap: 20px; }
    label { display: block; font-size: 0.85rem; font-weight: 600; color: #374151; margin-bottom: 8px; }
    input { width: 100%; padding: 10px 12px; border: 1px solid #D1D5DB; border-radius: 8px; font-size: 0.95rem; }
    input:focus { outline: none; border-color: #D4AF37; box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.15); }
    input.error { border-color: #DC2626; }
    .error-msg { font-size: 0.8rem; color: #DC2626; margin-top: 4px; display: block; }
    
    .section-divider {
      margin: 24px 0 16px 0; font-size: 0.9rem; text-transform: uppercase; color: #9CA3AF; letter-spacing: 0.05em; border-bottom: 1px solid #E5E7EB; padding-bottom: 8px;
    }

    /* Switch Style */
    .checkbox-group { display: flex; align-items: center; gap: 12px; margin-top: 12px; }
    .switch { position: relative; display: inline-block; width: 44px; height: 24px; }
    .switch input { opacity: 0; width: 0; height: 0; }
    .slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #ccc; transition: .4s; }
    .slider:before { position: absolute; content: ""; height: 18px; width: 18px; left: 3px; bottom: 3px; background-color: white; transition: .4s; }
    input:checked + .slider { background-color: #D4AF37; }
    input:checked + .slider:before { transform: translateX(20px); }
    .slider.round { border-radius: 34px; }
    .slider.round:before { border-radius: 50%; }
    .checkbox-label { font-weight: 500; color: #111827; }

    .modal-footer {
      display: flex; justify-content: flex-end; gap: 12px; padding-top: 20px; border-top: 1px solid #E5E7EB; margin-top: 12px;
    }
    .btn-cancel { padding: 10px 20px; border-radius: 8px; border: 1px solid #D1D5DB; background: white; color: #374151; cursor: pointer; }
    .btn-cancel:hover { background: #F9FAFB; }
    .btn-save { padding: 10px 24px; border-radius: 8px; border: none; background: #D4AF37; color: white; font-weight: 600; cursor: pointer; box-shadow: 0 4px 6px -1px rgba(212, 175, 55, 0.4); }
    .btn-save:hover { background: #B4941F; }
    .btn-save:disabled { background: #E5E7EB; color: #9CA3AF; cursor: not-allowed; box-shadow: none; }

    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  `]
})
export class SermonFormComponent implements OnChanges {
  @Input() sermon: Sermon | null = null;
  @Output() save = new EventEmitter<Sermon>();
  @Output() cancel = new EventEmitter<void>();

  sermonForm: FormGroup;
  isEditMode = false;
  isSaving = false;

  constructor(private fb: FormBuilder) {
    this.sermonForm = this.fb.group({
      id: [null],
      title: ['', Validators.required],
      speaker: [''],
      scripture: [''],
      description: [''],
      video_url: [''],
      audio_url: [''],
      notes_url: [''],
      created_at: [new Date().toISOString().split('T')[0]] // Defaults to today
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['sermon'] && this.sermon) {
      this.isEditMode = true;
      const data = { ...this.sermon };
      if (data.created_at) data.created_at = data.created_at.split('T')[0]; // Format for date input
      this.sermonForm.patchValue(data);
    } else {
      this.isEditMode = false;
      this.sermonForm.reset({ 
        created_at: new Date().toISOString().split('T')[0]
      });
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.sermonForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  onSubmit() {
    if (this.sermonForm.valid) {
      this.isSaving = true;
      const formValue = this.sermonForm.value;
      this.save.emit(formValue);
      setTimeout(() => this.isSaving = false, 2000);
    } else {
      this.sermonForm.markAllAsTouched();
    }
  }

  onCancel() {
    this.cancel.emit();
  }
}
