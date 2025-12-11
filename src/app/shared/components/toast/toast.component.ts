import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, Toast } from '../../../core/services/toast.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container">
      <div *ngFor="let toast of toasts$ | async" 
           class="toast {{ toast.type }}" 
           (click)="remove(toast.id)">
        <div class="toast-icon">
          <i class="fa-solid fa-circle-check" *ngIf="toast.type === 'success'"></i>
          <i class="fa-solid fa-circle-exclamation" *ngIf="toast.type === 'error'"></i>
          <i class="fa-solid fa-triangle-exclamation" *ngIf="toast.type === 'warning'"></i>
          <i class="fa-solid fa-circle-info" *ngIf="toast.type === 'info'"></i>
        </div>
        <div class="toast-message">{{ toast.message }}</div>
        <button class="toast-close" (click)="remove(toast.id); $event.stopPropagation()">
            <i class="fa-solid fa-xmark"></i>
        </button>
      </div>
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed;
      top: 24px;
      right: 24px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 12px;
      pointer-events: none; /* Let clicks pass through container */
    }

    .toast {
      background: white;
      min-width: 300px;
      max-width: 450px;
      padding: 16px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      display: flex;
      align-items: flex-start;
      gap: 12px;
      animation: slideIn 0.3s ease-out;
      pointer-events: auto; /* Catch clicks on toasts */
      cursor: pointer;
      border-left: 4px solid transparent;
    }

    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }

    .toast.success { border-left-color: #10B981; }
    .toast.success .toast-icon { color: #10B981; }
    
    .toast.error { border-left-color: #EF4444; }
    .toast.error .toast-icon { color: #EF4444; }

    .toast.warning { border-left-color: #F59E0B; }
    .toast.warning .toast-icon { color: #F59E0B; }

    .toast.info { border-left-color: #3B82F6; }
    .toast.info .toast-icon { color: #3B82F6; }

    .toast-icon {
      font-size: 1.25rem;
      margin-top: 2px;
    }

    .toast-message {
      flex: 1;
      font-size: 0.95rem;
      color: #1F2937;
      line-height: 1.4;
    }
    
    .toast-close {
        background: none;
        border: none;
        color: #9CA3AF;
        cursor: pointer;
        padding: 0;
        font-size: 1rem;
        transition: color 0.2s;
        margin-top: 2px;
    }
    .toast-close:hover { color: #4B5563; }
  `]
})
export class ToastComponent {
  toasts$: Observable<Toast[]>;

  constructor(private toastService: ToastService) {
    this.toasts$ = this.toastService.toasts$;
  }

  remove(id: string) {
    this.toastService.remove(id);
  }
}
