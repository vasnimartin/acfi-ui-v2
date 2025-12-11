import { Injectable } from '@angular/core';
import { SupabaseClient } from '@supabase/supabase-js';
import { SupabaseService } from './supabase.service';
import { from, Observable, map } from 'rxjs';

export interface Ministry {
  id?: number;
  name: string;
  description?: string;
  leader_name?: string;
  contact_email?: string;
  meeting_schedule?: string;
  image_url?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

@Injectable({
  providedIn: 'root'
})
export class MinistryService {
  private supabase: SupabaseClient;

  constructor(private supabaseService: SupabaseService) {
    this.supabase = this.supabaseService.client;
  }

  // Get all ministries (admin)
  getMinistries(): Observable<Ministry[]> {
    return from(
      this.supabase
        .from('ministries')
        .select('*')
        .order('name', { ascending: true })
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return data as Ministry[];
      })
    );
  }

  // Get active ministries (public)
  getActiveMinistries(): Observable<Ministry[]> {
    return from(
      this.supabase
        .from('ministries')
        .select('*')
        .eq('is_active', true)
        .order('name', { ascending: true })
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return data as Ministry[];
      })
    );
  }

  // Get single ministry
  getMinistry(id: number): Observable<Ministry> {
    return from(
      this.supabase
        .from('ministries')
        .select('*')
        .eq('id', id)
        .single()
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return data as Ministry;
      })
    );
  }

  // Create ministry
  createMinistry(ministry: Ministry): Observable<Ministry> {
    return from(
      this.supabase
        .from('ministries')
        .insert(ministry)
        .select()
        .single()
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return data as Ministry;
      })
    );
  }

  // Update ministry
  updateMinistry(id: number, ministry: Partial<Ministry>): Observable<Ministry> {
    return from(
      this.supabase
        .from('ministries')
        .update({ ...ministry, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single()
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return data as Ministry;
      })
    );
  }

  // Delete ministry
  deleteMinistry(id: number): Observable<void> {
    return from(
      this.supabase
        .from('ministries')
        .delete()
        .eq('id', id)
    ).pipe(
      map(({ error }) => {
        if (error) throw error;
      })
    );
  }
}
