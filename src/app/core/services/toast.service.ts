import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toastsSubject = new BehaviorSubject<Toast[]>([]);
  toasts$ = this.toastsSubject.asObservable();

  show(type: 'success' | 'error' | 'warning' | 'info', message: string, duration: number = 3000) {
    const id = Math.random().toString(36).substring(2, 9);
    const toast: Toast = { id, type, message, duration };
    
    const currenttoasts = this.toastsSubject.value;
    this.toastsSubject.next([...currenttoasts, toast]);

    if (duration > 0) {
      setTimeout(() => {
        this.remove(id);
      }, duration);
    }
  }

  success(message: string, duration: number = 3000) {
    this.show('success', message, duration);
  }

  error(message: string, duration: number = 5000) {
    this.show('error', message, duration);
  }

  warning(message: string, duration: number = 4000) {
    this.show('warning', message, duration);
  }

  info(message: string, duration: number = 3000) {
    this.show('info', message, duration);
  }

  remove(id: string) {
    const currenttoasts = this.toastsSubject.value;
    this.toastsSubject.next(currenttoasts.filter(t => t.id !== id));
  }
}
