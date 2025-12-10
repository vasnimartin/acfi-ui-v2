import { Component, Inject, PLATFORM_ID, OnInit, OnDestroy } from '@angular/core';
import { RouterModule } from '@angular/router';
import { isPlatformBrowser, DOCUMENT, CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { Subscription } from 'rxjs';
import { User } from '@supabase/supabase-js';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit, OnDestroy {
  menuOpen = false;
  activeDropdown: string | null = null;
  private isBrowser: boolean;
  
  currentUser: User | null = null;
  private authSubscription: Subscription | null = null;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) platformId: Object,
    private authService: AuthService
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit() {
    this.authSubscription = this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  ngOnDestroy() {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  login() {
    this.authService.signInWithGoogle();
  }

  logout() {
    this.authService.signOut();
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
