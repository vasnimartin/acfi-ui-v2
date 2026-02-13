import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminToolsService {
  private isEditMode = new BehaviorSubject<boolean>(false);
  isEditMode$ = this.isEditMode.asObservable();

  toggleEditMode() {
    this.isEditMode.next(!this.isEditMode.value);
  }

  setEditMode(active: boolean) {
    this.isEditMode.next(active);
  }

  get currentEditMode(): boolean {
    return this.isEditMode.value;
  }
}
