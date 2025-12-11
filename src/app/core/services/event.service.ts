import { Injectable } from '@angular/core';
import { SupabaseClient } from '@supabase/supabase-js';
import { SupabaseService } from './supabase.service';
import { from, Observable, map } from 'rxjs';

export interface ChurchEvent {
  id?: number; // Optional because new events don't have IDs yet
  title: string;
  description?: string;
  location?: string;
  start_time: string; // ISO string
  end_time?: string;
  image_url?: string;
  event_type?: string;
  created_at?: string;
}

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private supabase: SupabaseClient;

  constructor(private supabaseService: SupabaseService) {
    this.supabase = this.supabaseService.client;
  }

  // GET All Events
  getEvents(): Observable<ChurchEvent[]> {
    return from(
      this.supabase
        .from('events')
        .select('*')
        .order('start_time', { ascending: true })
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return data as ChurchEvent[];
      })
    );
  }

  // CREATE Event
  createEvent(event: ChurchEvent): Observable<ChurchEvent> {
    // Remove id if it exists (shouldn't for create, but safe to remove)
    const { id, created_at, ...newEvent } = event; 
    
    return from(
      this.supabase
        .from('events')
        .insert(newEvent)
        .select()
        .single()
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return data as ChurchEvent;
      })
    );
  }

  // UPDATE Event
  updateEvent(id: number, event: Partial<ChurchEvent>): Observable<ChurchEvent> {
    return from(
      this.supabase
        .from('events')
        .update(event)
        .eq('id', id)
        .select()
        .single()
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return data as ChurchEvent;
      })
    );
  }

  // DELETE Event
  deleteEvent(id: number): Observable<void> {
    return from(
      this.supabase
        .from('events')
        .delete()
        .eq('id', id)
    ).pipe(
      map(({ error }) => {
        if (error) throw error;
      })
    );
  }
}
