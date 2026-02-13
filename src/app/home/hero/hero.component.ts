import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ContentService } from '../../core/services/content.service';
import { AdminToolsService } from '../../core/services/admin-tools.service';
import { Observable, take } from 'rxjs';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss'
})
export class HeroComponent {
  heroContent$: Observable<any>;
  isEditMode$: Observable<boolean>;
  
  editing = false;
  editedContent = {
    title: 'Join us this Sunday!',
    button1_text: 'LOCATIONS & TIMES',
    button2_text: 'WHAT TO EXPECT'
  };

  constructor(
    private contentService: ContentService,
    private adminTools: AdminToolsService
  ) {
    this.heroContent$ = this.contentService.getContent('home.hero');
    this.isEditMode$ = this.adminTools.isEditMode$;
  }

  startEdit(currentContent: any) {
    this.editedContent = { ...currentContent || this.editedContent };
    this.editing = true;
  }

  saveEdit() {
    this.contentService.updateContent('home.hero', 'home', this.editedContent).pipe(take(1)).subscribe({
      next: () => {
        this.editing = false;
      },
      error: (err) => console.error('Error saving hero content', err)
    });
  }

  cancelEdit() {
    this.editing = false;
  }
}
