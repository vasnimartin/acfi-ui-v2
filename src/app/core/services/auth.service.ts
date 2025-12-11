import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { createClient, SupabaseClient, User, Session } from '@supabase/supabase-js';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

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
  private _authLoading = new BehaviorSubject<boolean>(true); // Initial loading state

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    // Hack to bypass NavigatorLock issues in some browser environments
    // The lock option expects a function matching LockFunc signature
    const dummyLock = async (_name: string, _acquireTimeout: number, fn: () => Promise<any>) => fn();

    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        lock: dummyLock
      }
    });

    if (this.isBrowser) {
      // Initialize session
      this.supabase.auth.getSession().then(({ data }) => {
        const user = data.session?.user ?? null;
        this._currentUser.next(user);
        if (user) {
          this.loadUserProfile(user.id);
        } else {
          this._currentUserRole.next(null);
          this._currentUserProfile.next(null);
          this._authLoading.next(false); // Auth finished
        }
      });

      // Listen for auth changes
      this.supabase.auth.onAuthStateChange((_event, session) => {
        const user = session?.user ?? null;
        this._currentUser.next(user);
        
        if (_event === 'SIGNED_OUT') {
           this._currentUserRole.next(null);
           this._currentUserProfile.next(null);
           this._authLoading.next(false);
        } else if (user) {
           // If we have a user, ensure we load profile. 
           // If we ALREADY have a profile and user ID matches, maybe skip? 
           // For safety, reload or check.
           if (this._currentUserProfile.value?.id !== user.id) {
               this._authLoading.next(true); // Loading profile
               this.loadUserProfile(user.id);
           }
        }
      });
    } else {
        this._authLoading.next(false); // Not browser, done
    }
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

  private _currentUserProfile = new BehaviorSubject<UserProfile | null>(null);

  get currentUserValue(): User | null {
    return this._currentUser.value;
  }

  private async loadUserProfile(userId: string) {
    const data = await this.supabase
      .from('profiles')
      .select('*') // Select all to get profile fields
      .eq('id', userId)
      .single();

    if (data.error) {
      // If error is PGRST116 (JSON object returned 0 results) or 406, it means row is missing.
      // We should try to create it here as a failsafe.
      if (data.error.code === 'PGRST116' || data.error.code === '406' || data.error.message.includes('0 rows')) {
         console.warn('Profile missing, attempting auto-creation...');
         await this.createProfile(userId);
         return;
      }
      
      console.error('Error loading user profile:', data.error);
      this._currentUserRole.next('member'); // Fallback to member
      this._currentUserProfile.next(null);
      this._authLoading.next(false); // Done loading (with error)
    } else {
      const profileData = data.data;
      // Handle potential case sensitivity or mapping
      const userProfile: UserProfile = {
        id: profileData.id,
        email: this._currentUser.value?.email || profileData.email || '',
        role: (profileData.Role || profileData.role || 'member').toLowerCase(),
        full_name: profileData.full_name,
        phone: profileData.phone,
        address: profileData.address
      };
      
      this._currentUserRole.next(userProfile.role);
      this._currentUserProfile.next(userProfile);
      this._authLoading.next(false); // Done loading success
    }
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
      Role: 'member', // Default role
      updated_at: new Date()
    };

    const { error } = await this.supabase.from('profiles').insert(newProfile);

    if (error) {
      console.error('Failed to auto-create profile:', error);
      // Fallback
      this._currentUserRole.next('member');
      this._authLoading.next(false);
    } else {
      console.log('Profile auto-created successfully. Reloading...');
      this.loadUserProfile(userId); // Retry load, loading state stays true
    }
  }

  async updateProfile(profile: Partial<UserProfile>): Promise<void> {
    const user = this._currentUser.value;
    if (!user) throw new Error('No user logged in');

    const updates = {
      id: user.id,
      updated_at: new Date(),
      email: user.email, // Ensure email is synced to profile
      full_name: profile.full_name,
      phone: profile.phone,
      address: profile.address,
      // Don't update Role here for security, usually admin only
    };

    const { error } = await this.supabase.from('profiles').upsert(updates);

    if (error) {
      throw error;
    }

    // Refresh profile
    await this.loadUserProfile(user.id);
  }

  hasAnyRole(allowedRoles: string[]): boolean {
    const currentRole = this._currentUserRole.value;
    if (!currentRole) return false;
    return allowedRoles.includes(currentRole);
  }

  async signInWithGoogle() {
    const redirectUrl = window.location.origin;
    console.log('--- SUPABASE LOGIN DEBUG ---');
    console.log('App URL (Origin):', redirectUrl);
    console.log('Sending redirectTo:', redirectUrl);
    console.log('----------------------------');

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
    this._currentUserRole.next(null);
    this._currentUserProfile.next(null);
    this.router.navigate(['/']);
  }
}
