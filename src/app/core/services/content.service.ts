import { Injectable } from '@angular/core';
import { SupabaseClient } from '@supabase/supabase-js';
import { SupabaseService } from './supabase.service';
import { from, Observable, map, of, tap, BehaviorSubject, take, Subject, merge, switchMap, shareReplay, filter } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContentService {
  private supabase: SupabaseClient;
  private contentCache: Map<string, any> = new Map();
  private contentUpdate$ = new Subject<string>(); // Stream of keys that have been updated
  
  private themeSubject = new BehaviorSubject<string>('christmas');
  currentTheme$ = this.themeSubject.asObservable();

  constructor(private supabaseService: SupabaseService) {
    this.supabase = this.supabaseService.client;
    this.refreshTheme();
  }

  refreshTheme() {
    this.getContent('site.theme').pipe(take(1)).subscribe(theme => {
      if (theme) this.themeSubject.next(theme);
    });
  }

  /**
   * Fetch a specific content block by key.
   * Returns a reactive observable that emits whenever that key is updated.
   */
  getContent(key: string): Observable<any> {
    // Initial fetch trigger + updates trigger
    return merge(of(key), this.contentUpdate$).pipe(
      filter(updatedKey => updatedKey === key),
      switchMap(() => {
        if (this.contentCache.has(key)) {
          return of(this.contentCache.get(key));
        }

        return from(
          this.supabase
            .from('site_content')
            .select('content')
            .eq('key', key)
            .maybeSingle()
        ).pipe(
          map(({ data, error }) => {
            if (error) {
              if (error.code === 'PGRST116') return null;
              throw error;
            }
            return data?.content;
          }),
          tap(content => {
            if (content) this.contentCache.set(key, content);
          })
        );
      }),
      shareReplay(1)
    );
  }

  /**
   * Update or create a content block (Admin/Pastor only).
   */
  updateContent(key: string, section: string, content: any): Observable<any> {
    return from(
      this.supabase
        .from('site_content')
        .upsert({
          key,
          section,
          content,
          updated_at: new Date().toISOString()
        })
        .select()
        .maybeSingle()
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        
        // Update local cache and notify listeners
        this.contentCache.set(key, content);
        this.contentUpdate$.next(key);

        if (key === 'site.theme') {
          this.themeSubject.next(content);
        }
        return data;
      })
    );
  }

  /**
   * Fetch all active announcements.
   */
  getAnnouncements(): Observable<any[]> {
    return from(
      this.supabase
        .from('announcements')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return data || [];
      })
    );
  }

  /**
   * Create or update an announcement (Admin only).
   */
  saveAnnouncement(announcement: any): Observable<any> {
    return from(
      this.supabase
        .from('announcements')
        .upsert({
          ...announcement,
          updated_at: new Date().toISOString()
        })
        .select()
        .maybeSingle()
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return data;
      })
    );
  }

  /**
   * Delete an announcement (Admin only).
   */
  deleteAnnouncement(id: string): Observable<any> {
    return from(
      this.supabase
        .from('announcements')
        .delete()
        .eq('id', id)
    ).pipe(
      map(({ error }) => {
        if (error) throw error;
        return true;
      })
    );
  }
}

