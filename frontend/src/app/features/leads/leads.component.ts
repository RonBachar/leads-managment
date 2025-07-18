import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LeadsService } from '../../core/services/leads.service';
import { Lead, LeadStatus } from '../../shared/models/lead.model';
import { APP_CONSTANTS } from '../../shared/constants/app.constants';

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
  selectedLeadIds: Set<string> = new Set();
  selectAllChecked = false;

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
      return;
    }

    const term = this.searchTerm.toLowerCase();
    this.filteredLeads = this.leads.filter(
      (lead) =>
        lead.firstName.toLowerCase().includes(term) ||
        lead.lastName.toLowerCase().includes(term) ||
        (lead.email && lead.email.toLowerCase().includes(term)) ||
        (lead.phone && lead.phone.includes(term))
    );
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
      case 'X-place':
        return 'X-place';
      case 'ליד יזום':
        return 'ליד יזום';
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

  // Selection logic
  isLeadSelected(leadId: string): boolean {
    return this.selectedLeadIds.has(leadId);
  }

  toggleLeadSelection(leadId: string, checked: boolean): void {
    if (checked) {
      this.selectedLeadIds.add(leadId);
    } else {
      this.selectedLeadIds.delete(leadId);
    }
    this.updateSelectAllChecked();
  }

  toggleSelectAll(checked: boolean): void {
    this.selectAllChecked = checked;
    if (checked) {
      this.filteredLeads.forEach((lead) => this.selectedLeadIds.add(lead.id));
    } else {
      this.filteredLeads.forEach((lead) =>
        this.selectedLeadIds.delete(lead.id)
      );
    }
  }

  updateSelectAllChecked(): void {
    this.selectAllChecked =
      this.filteredLeads.length > 0 &&
      this.filteredLeads.every((lead) => this.selectedLeadIds.has(lead.id));
  }

  deleteSelectedLeads(): void {
    if (this.selectedLeadIds.size === 0) return;
    if (confirm('האם אתה בטוח שברצונך למחוק את כל הלידים שנבחרו?')) {
      this.selectedLeadIds.forEach((id) => this.leadsService.deleteLead(id));
      this.selectedLeadIds.clear();
      this.loadLeads();
    }
  }
}
