import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';
import { from, Observable, map } from 'rxjs';

export interface Sermon {
  id?: number; // BigInt in SQL becomes number in JS
  title: string;
  speaker?: string;
  scripture?: string;
  description?: string;
  video_url?: string;
  audio_url?: string;
  notes_url?: string;
  created_at?: string; // Serves as date preached
}

@Injectable({
  providedIn: 'root'
})
export class SermonService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  }

  // GET All Sermons
  getSermons(): Observable<Sermon[]> {
    return from(
      this.supabase
        .from('sermons')
        .select('*')
        .order('created_at', { ascending: false })
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return data as Sermon[];
      })
    );
  }

  // GET Single Sermon
  getSermon(id: number): Observable<Sermon | undefined> {
    return from(
      this.supabase
        .from('sermons')
        .select('*')
        .eq('id', id)
        .single()
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return data as Sermon;
      })
    );
  }

  // CREATE Sermon
  createSermon(sermon: Sermon): Observable<Sermon> {
    // Exclude id for creation
    const { id, ...newSermon } = sermon;
    return from(
      this.supabase
        .from('sermons')
        .insert(newSermon)
        .select()
        .single()
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return data as Sermon;
      })
    );
  }

  // UPDATE Sermon
  updateSermon(id: number, updates: Partial<Sermon>): Observable<Sermon> {
    return from(
      this.supabase
        .from('sermons')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return data as Sermon;
      })
    );
  }

  // DELETE Sermon
  deleteSermon(id: number): Observable<void> {
    return from(
      this.supabase
        .from('sermons')
        .delete()
        .eq('id', id)
    ).pipe(
      map(({ error }) => {
        if (error) throw error;
      })
    );
  }
}
