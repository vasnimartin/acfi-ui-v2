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
  currentUserRole: string | null = null;
  isLoading = true; // Add loading state
  private authSubscription: Subscription | null = null;
  private roleSubscription: Subscription | null = null;
  private loadingSubscription: Subscription | null = null; // New subscription

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
    this.roleSubscription = this.authService.currentUserRole$.subscribe(role => {
      this.currentUserRole = role;
    });
    // Subscribe to loading state
    this.loadingSubscription = this.authService.authLoading$.subscribe(loading => {
        this.isLoading = loading;
    });
  }

  ngOnDestroy() {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
    if (this.roleSubscription) {
      this.roleSubscription.unsubscribe();
    }
    if (this.loadingSubscription) {
        this.loadingSubscription.unsubscribe();
    }
  }

  isLoggingOut = false; // New state

  login() {
    this.authService.signInWithGoogle();
  }

  async logout() {
    if (this.isLoggingOut) return;
    this.isLoggingOut = true;
    try {
        await this.authService.signOut();
    } finally {
        this.isLoggingOut = false;
    }
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
  
  getRoleLabel(): string {
    switch (this.currentUserRole) {
      case 'admin': return 'Global Admin';
      case 'pastor': return 'Pastor Portal';
      case 'media': return 'Media Suite';
      default: return 'Member Dashboard';
    }
  }

  getEmailPrefix(user: any): string {
    return user?.email?.split('@')[0] || '';
  }

  closeMenu() {
    this.menuOpen = false;
    this.activeDropdown = null;
    if (this.isBrowser) {
      this.document.body.classList.remove('menu-open');
    }
  }
}
