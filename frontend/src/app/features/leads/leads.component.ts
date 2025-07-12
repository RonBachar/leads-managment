import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LeadsService } from '../../core/services/leads.service';
import { Lead, LeadStatus } from '../../shared/models/lead.model';
import { APP_CONSTANTS } from '../../shared/constants/app.constants';

interface SortState {
  column: string;
  direction: 'asc' | 'desc' | null;
}

@Component({
  selector: 'app-leads',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './leads.component.html',
  styleUrls: ['./leads.component.scss'],
})
export class LeadsComponent implements OnInit {
  private readonly leadsService = inject(LeadsService);
  private readonly router = inject(Router);

  leads: Lead[] = [];
  filteredLeads: Lead[] = [];
  searchTerm = '';
  isLoading = false;
  sortState: SortState = { column: '', direction: null };

  readonly routes = APP_CONSTANTS.ROUTES;
  readonly LeadStatus = LeadStatus;

  ngOnInit(): void {
    this.loadLeads();
  }

  loadLeads(): void {
    this.isLoading = true;
    this.leads = this.leadsService.items();
    this.filteredLeads = [...this.leads];
    this.isLoading = false;
  }

  onSearch(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchTerm = target.value;
    this.filterLeads();
  }

  filterLeads(): void {
    if (!this.searchTerm.trim()) {
      this.filteredLeads = [...this.leads];
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filteredLeads = this.leads.filter(
        (lead) =>
          lead.firstName.toLowerCase().includes(term) ||
          lead.lastName.toLowerCase().includes(term) ||
          (lead.email && lead.email.toLowerCase().includes(term)) ||
          (lead.phone && lead.phone.includes(term))
      );
    }
    this.applySorting();
  }

  sortBy(column: string): void {
    if (this.sortState.column === column) {
      // Toggle direction if same column
      if (this.sortState.direction === 'asc') {
        this.sortState.direction = 'desc';
      } else if (this.sortState.direction === 'desc') {
        this.sortState.direction = null;
      } else {
        this.sortState.direction = 'asc';
      }
    } else {
      // New column, start with ascending
      this.sortState.column = column;
      this.sortState.direction = 'asc';
    }

    this.applySorting();
  }

  applySorting(): void {
    if (!this.sortState.direction) {
      return; // No sorting
    }

    this.filteredLeads.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (this.sortState.column) {
        case 'createdAt':
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
        default:
          return 0;
      }

      if (aValue < bValue) {
        return this.sortState.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return this.sortState.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }

  getSortIcon(column: string): string {
    if (this.sortState.column !== column) {
      return '↕️'; // Default sort icon
    }

    switch (this.sortState.direction) {
      case 'asc':
        return '↑';
      case 'desc':
        return '↓';
      default:
        return '↕️';
    }
  }

  getSortClass(column: string): string {
    if (this.sortState.column !== column) {
      return '';
    }

    return this.sortState.direction === 'asc' ? 'sort-asc' : 'sort-desc';
  }

  getStatusClass(status: LeadStatus): string {
    switch (status) {
      case LeadStatus.NEW:
        return 'badge-success';
      case LeadStatus.IN_PROGRESS:
        return 'badge-warning';
      case LeadStatus.NOT_INTERESTED:
        return 'badge-danger';
      default:
        return 'badge-info';
    }
  }

  getStatusText(status: LeadStatus): string {
    return status;
  }

  getSourceText(source: string): string {
    switch (source) {
      case 'Website':
        return 'אתר אינטרנט';
      case 'Referral':
        return 'המלצה';
      case 'Email':
        return 'אימייל';
      case 'WhatsApp':
        return 'ווטסאפ';
      case 'Facebook':
        return 'פייסבוק';
      case 'Instagram':
        return 'אינסטגרם';
      case 'LinkedIn':
        return 'לינקדאין';
      case 'Google Ads':
        return 'גוגל אדס';
      case 'other':
        return 'אחר';
      default:
        return source;
    }
  }

  editLead(lead: Lead): void {
    this.router.navigate([this.routes.LEADS_EDIT, lead.id]);
  }

  deleteLead(lead: Lead): void {
    if (confirm('האם אתה בטוח שברצונך למחוק ליד זה?')) {
      this.leadsService.deleteLead(lead.id);
      this.loadLeads();
    }
  }

  addNewLead(): void {
    this.router.navigate([this.routes.LEADS_NEW]);
  }

  getTotalLeads(): number {
    return this.leads.length;
  }

  getNewLeads(): number {
    return this.leads.filter((lead) => lead.status === LeadStatus.NEW).length;
  }

  getInProgressLeads(): number {
    return this.leads.filter((lead) => lead.status === LeadStatus.IN_PROGRESS)
      .length;
  }

  getNotInterestedLeads(): number {
    return this.leads.filter(
      (lead) => lead.status === LeadStatus.NOT_INTERESTED
    ).length;
  }
}
