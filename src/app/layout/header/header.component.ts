import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { RouterModule } from '@angular/router';
import { isPlatformBrowser, DOCUMENT, CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  menuOpen = false;
  activeDropdown: string | null = null;
  private isBrowser: boolean;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
    this.activeDropdown = null; // Reset dropdown when toggling menu
    
    if (this.isBrowser) {
      if (this.menuOpen) {
        this.document.body.classList.add('menu-open');
      } else {
        this.document.body.classList.remove('menu-open');
      }
    }
  }
  
  toggleDropdown(name: string, event: Event) {
    event.preventDefault();
    event.stopPropagation();
    
    if (this.activeDropdown === name) {
      this.activeDropdown = null;
    } else {
      this.activeDropdown = name;
    }
  }
  
  closeMenu() {
    this.menuOpen = false;
    this.activeDropdown = null;
    if (this.isBrowser) {
      this.document.body.classList.remove('menu-open');
    }
  }
}
