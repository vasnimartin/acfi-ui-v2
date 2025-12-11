import { Injectable } from '@angular/core';
import { SupabaseClient } from '@supabase/supabase-js';
import { SupabaseService } from './supabase.service';
import { from, Observable, map } from 'rxjs';

export interface PrayerRequest {
  id?: number;
  user_id?: string;
  request_text: string;
  is_private: boolean;
  status?: 'pending' | 'prayed' | 'archived';
  submitter_name?: string;
  submitter_email?: string;
  created_at?: string;
  user_full_name?: string; // From profiles join
  user_email?: string; // From profiles join
}

@Injectable({
  providedIn: 'root'
})
export class PrayerRequestService {
  private supabase: SupabaseClient;

  constructor(private supabaseService: SupabaseService) {
    this.supabase = this.supabaseService.client;
  }

  // Submit a prayer request (public or authenticated)
  submitPrayerRequest(request: PrayerRequest): Observable<PrayerRequest> {
    return from(
      this.supabase
        .from('prayer_requests')
        .insert({
          user_id: request.user_id || null,
          request_text: request.request_text,
          is_private: request.is_private,
          submitter_name: request.submitter_name || null,
          submitter_email: request.submitter_email || null
        })
        .select()
        .single()
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return data as PrayerRequest;
      })
    );
  }

  // Get all prayer requests (admin only)
  getAllPrayerRequests(): Observable<PrayerRequest[]> {
    return from(
      this.supabase
        .from('prayer_requests')
        .select(`
          *,
          profiles:user_id (
            full_name,
            email
          )
        `)
        .order('created_at', { ascending: false })
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        // Transform the data to include profile info
        return (data as any[]).map(item => ({
          ...item,
          user_full_name: item.profiles?.full_name,
          user_email: item.profiles?.email
        })) as PrayerRequest[];
      })
    );
  }

  // Update request status (admin only)
  updateRequestStatus(id: number, status: 'pending' | 'prayed' | 'archived'): Observable<PrayerRequest> {
    return from(
      this.supabase
        .from('prayer_requests')
        .update({ status })
        .eq('id', id)
        .select()
        .single()
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return data as PrayerRequest;
      })
    );
  }

  // Delete prayer request (admin only)
  deletePrayerRequest(id: number): Observable<void> {
    return from(
      this.supabase
        .from('prayer_requests')
        .delete()
        .eq('id', id)
    ).pipe(
      map(({ error }) => {
        if (error) throw error;
      })
    );
  }
}
