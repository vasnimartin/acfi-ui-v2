import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { SupabaseClient, User, Session } from '@supabase/supabase-js';
import { BehaviorSubject, Observable } from 'rxjs';
import { SupabaseService } from './supabase.service';
import { ToastService } from './toast.service';

export interface UserProfile {
  id: string;
  email: string;
  role: string;
  full_name?: string;
  phone?: string;
  address?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private supabase: SupabaseClient;
  private isBrowser: boolean;
  private _currentUser = new BehaviorSubject<User | null>(null);
  private _currentUserRole = new BehaviorSubject<string | null>(null);
  private _currentUserProfile = new BehaviorSubject<UserProfile | null>(null);
  private _authLoading = new BehaviorSubject<boolean>(true);

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router,
    private supabaseService: SupabaseService,
    private toastService: ToastService
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.supabase = this.supabaseService.client; // Singleton instance

    if (this.isBrowser) {
      this.supabase.auth.getSession().then(({ data }) => {
        const user = data.session?.user ?? null;
        this._currentUser.next(user);
        if (user) {
          this.loadUserProfile(user.id);
        } else {
          this.clearUserState();
          this._authLoading.next(false);
        }
      });

      this.supabase.auth.onAuthStateChange((_event, session) => {
        const user = session?.user ?? null;
        this._currentUser.next(user);
        
        if (_event === 'SIGNED_OUT') {
           this.clearUserState();
           this._authLoading.next(false);
        } else if (user) {
           if (this._currentUserProfile.value?.id !== user.id) {
               this._authLoading.next(true); 
               this.loadUserProfile(user.id);
           }
        }
      });
    } else {
        this._authLoading.next(false);
    }
  }

  private clearUserState() {
    this._currentUserRole.next(null);
    this._currentUserProfile.next(null);
  }

  get authLoading$(): Observable<boolean> {
    return this._authLoading.asObservable();
  }

  get currentUser$(): Observable<User | null> {
    return this._currentUser.asObservable();
  }

  get currentUserRole$(): Observable<string | null> {
    return this._currentUserRole.asObservable();
  }

  get currentUserProfile$(): Observable<UserProfile | null> {
    return this._currentUserProfile.asObservable();
  }

  get currentUserValue(): User | null {
    return this._currentUser.value;
  }

  private async loadUserProfile(userId: string) {
    // 406 Error Fix: Select * is usually fine, but .single() throws if row missing.
    // 'maybeSingle()' suppresses error if 0 rows, returns null data.
    const { data: profile, error } = await this.supabase
      .from('profiles')
      .select('id, email, full_name, role, phone, address')
      .eq('id', userId)
      .maybeSingle(); 

    if (error) {
      console.error('[AuthService] DB Error fetching profile:', error);
      this._authLoading.next(false);
      return; 
    }

    if (!profile) {
      console.warn('[AuthService] Profile missing (not 406), attempting creation...');
      await this.createProfile(userId);
      return;
    }

    // Success
    const rawRole = profile.role || 'member';
    const normalizedRole = rawRole.toLowerCase();

    const userProfile: UserProfile = {
      id: profile.id,
      email: this._currentUser.value?.email || profile.email || '',
      role: normalizedRole,
      full_name: profile.full_name,
      phone: profile.phone,
      address: profile.address
    };
    
    this._currentUserRole.next(userProfile.role);
    this._currentUserProfile.next(userProfile);
    this._authLoading.next(false);
  }

  private async createProfile(userId: string) {
    const user = this._currentUser.value;
    if (!user) {
        this._authLoading.next(false);
        return;
    }

    const newProfile = {
      id: userId,
      email: user.email,
      full_name: user.user_metadata?.['full_name'] || user.email?.split('@')[0] || 'Member',
      role: 'member',
      updated_at: new Date()
    };

    // Use upsert to handle race conditions where the trigger might have already created it
    const { error } = await this.supabase.from('profiles').upsert(newProfile);

    if (error) {
      console.error('Failed to auto-create (upsert) profile:', error);
      // If error is 409 (Conflict), we can safely ignore it and reload, as it means it exists.
      if (error.code === '23505' || error.message.includes('duplicate key')) {
         console.warn('Profile existed (race condition), reloading...');
         this.loadUserProfile(userId);
         return;
      }

      this.toastService.error('Failed to create user profile. Please contact support.');
      this._currentUserRole.next('member'); // Temporary fallback
      this._authLoading.next(false);
    } else {
      console.log('Profile auto-created/updated successfully. Reloading...');
      this.loadUserProfile(userId);
    }
  }

  async updateProfile(profile: Partial<UserProfile>): Promise<void> {
    const user = this._currentUser.value;
    if (!user) throw new Error('No user logged in');

    const updates = {
      id: user.id,
      updated_at: new Date(),
      email: user.email,
      full_name: profile.full_name,
      phone: profile.phone,
      address: profile.address,
    };

    const { error } = await this.supabase.from('profiles').upsert(updates);

    if (error) {
      throw error;
    }

    await this.loadUserProfile(user.id);
  }

  async signInWithGoogle() {
    const redirectUrl = window.location.origin;
    const { error } = await this.supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl
      }
    });

    if (error) {
      console.error('Error signing in with Google:', error);
      throw error;
    }
  }

  async signOut() {
    const { error } = await this.supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error);
    }
    this.clearUserState();
    this.router.navigate(['/']);
  }
}
