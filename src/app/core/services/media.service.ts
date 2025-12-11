import { Injectable } from '@angular/core';
import { SupabaseClient } from '@supabase/supabase-js';
import { SupabaseService } from './supabase.service';
import { from, Observable, map } from 'rxjs';

export interface MediaItem {
  id?: number;
  file_url: string;
  file_type?: string;     // 'image' | 'video'
  tags?: string[];
  uploaded_by?: string;   // uuid
  created_at?: string;
  title?: string;         // Optional specific title if needed, or derive from filename
}

@Injectable({
  providedIn: 'root'
})
export class MediaService {
  private supabase: SupabaseClient;

  constructor(private supabaseService: SupabaseService) {
    this.supabase = this.supabaseService.client;
  }

  getMedia(): Observable<MediaItem[]> {
    return from(
      this.supabase
        .from('media_library')
        .select('*')
        .order('created_at', { ascending: false })
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return data as MediaItem[];
      })
    );
  }

  uploadMediaRecord(media: MediaItem): Observable<MediaItem> {
    const { id, ...newMedia } = media;
    return from(
      this.supabase
        .from('media_library')
        .insert(newMedia)
        .select()
        .single()
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return data as MediaItem;
      })
    );
  }

  deleteMedia(id: number): Observable<void> {
    return from(
      this.supabase
        .from('media_library')
        .delete()
        .eq('id', id)
    ).pipe(
      map(({ error }) => {
        if (error) throw error;
      })
    );
  }
  
  // Note: Actual file upload to Storage Bucket would go here
  // async uploadFile(file: File): Promise<string> { ... }
}
