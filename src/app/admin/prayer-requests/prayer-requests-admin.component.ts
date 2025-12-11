import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PrayerRequestService, PrayerRequest } from '../../core/services/prayer-request.service';
import { ToastService } from '../../core/services/toast.service';
import { SupabaseService } from '../../core/services/supabase.service';

@Component({
  selector: 'app-prayer-requests-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './prayer-requests-admin.component.html',
  styleUrls: ['./prayer-requests-admin.component.scss']
})
export class PrayerRequestsAdminComponent implements OnInit {
  prayerRequests: PrayerRequest[] = [];
  filteredRequests: PrayerRequest[] = [];
  loading = true;
  filterStatus: 'all' | 'pending' | 'prayed' | 'archived' = 'all';
  searchTerm = '';

  constructor(
    private prayerRequestService: PrayerRequestService,
    private toastService: ToastService,
    private supabaseService: SupabaseService
  ) {}

  ngOnInit() {
    this.loadPrayerRequests();
  }

  loadPrayerRequests() {
    this.loading = true;
    this.prayerRequestService.getAllPrayerRequests().subscribe({
      next: async (requests) => {
        // Fetch profiles for requests with user_id
        const userIds = requests
          .filter(r => r.user_id)
          .map(r => r.user_id as string);

        if (userIds.length > 0) {
          const { data: profiles } = await this.supabaseService.client
            .from('profiles')
            .select('id, full_name, email')
            .in('id', userIds);

          // Merge profile data into requests
          this.prayerRequests = requests.map(request => {
            if (request.user_id && profiles) {
              const profile = profiles.find((p: any) => p.id === request.user_id);
              return {
                ...request,
                user_full_name: profile?.full_name,
                user_email: profile?.email
              };
            }
            return request;
          });
        } else {
          this.prayerRequests = requests;
        }

        this.applyFilters();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading prayer requests:', error);
        this.toastService.error('Failed to load prayer requests');
        this.loading = false;
      }
    });
  }

  applyFilters() {
    this.filteredRequests = this.prayerRequests.filter(request => {
      const matchesStatus = this.filterStatus === 'all' || request.status === this.filterStatus;
      const matchesSearch = !this.searchTerm || 
        request.request_text.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        request.submitter_name?.toLowerCase().includes(this.searchTerm.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }

  onFilterChange() {
    this.applyFilters();
  }

  onSearchChange() {
    this.applyFilters();
  }

  updateStatus(request: PrayerRequest, newStatus: 'pending' | 'prayed' | 'archived') {
    if (!request.id) return;

    this.prayerRequestService.updateRequestStatus(request.id, newStatus).subscribe({
      next: () => {
        request.status = newStatus;
        this.toastService.success(`Request marked as ${newStatus}`);
        this.applyFilters();
      },
      error: (error) => {
        console.error('Error updating status:', error);
        this.toastService.error('Failed to update status');
      }
    });
  }

  deleteRequest(request: PrayerRequest) {
    if (!request.id) return;
    
    if (!confirm('Are you sure you want to delete this prayer request?')) {
      return;
    }

    this.prayerRequestService.deletePrayerRequest(request.id).subscribe({
      next: () => {
        this.prayerRequests = this.prayerRequests.filter(r => r.id !== request.id);
        this.toastService.success('Prayer request deleted');
        this.applyFilters();
      },
      error: (error) => {
        console.error('Error deleting request:', error);
        this.toastService.error('Failed to delete request');
      }
    });
  }

  formatDate(dateString: string | undefined): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  getStatusBadgeClass(status: string | undefined): string {
    switch (status) {
      case 'pending': return 'badge-pending';
      case 'prayed': return 'badge-prayed';
      case 'archived': return 'badge-archived';
      default: return 'badge-pending';
    }
  }
}
