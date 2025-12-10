import { Injectable } from '@angular/core';
import { createClient, SupabaseClient, User, Session } from '@supabase/supabase-js';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface UserProfile {
  id: string;
  email: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private supabase: SupabaseClient;
  private _currentUser = new BehaviorSubject<User | null>(null);
  private _currentUserRole = new BehaviorSubject<string | null>(null);

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);

    // Initialize session
    this.supabase.auth.getSession().then(({ data }) => {
      const user = data.session?.user ?? null;
      this._currentUser.next(user);
      if (user) {
        this.loadUserRole(user.id);
      } else {
        this._currentUserRole.next(null);
      }
    });

    // Listen for auth changes
    this.supabase.auth.onAuthStateChange((_event, session) => {
      const user = session?.user ?? null;
      this._currentUser.next(user);
      if (user) {
        this.loadUserRole(user.id);
      } else {
        this._currentUserRole.next(null);
      }
    });
  }

  get currentUser$(): Observable<User | null> {
    return this._currentUser.asObservable();
  }

  get currentUserRole$(): Observable<string | null> {
    return this._currentUserRole.asObservable();
  }

  get currentUserValue(): User | null {
    return this._currentUser.value;
  }

  private async loadUserRole(userId: string) {
    const { data, error } = await this.supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error loading user role:', error);
      this._currentUserRole.next('member'); // Default fallback
    } else {
      this._currentUserRole.next(data?.role ?? 'member');
    }
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
      throw error;
    }
    this._currentUserRole.next(null);
  }
}
