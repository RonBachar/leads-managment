import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LeadsService } from '../../core/services/leads.service';
import { Lead, LeadStatus } from '../../shared/models/lead.model';
import { computed } from '@angular/core';

@Component({
  selector: 'app-leads',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './leads.component.html',
  styleUrl: './leads.component.css',
})
export class LeadsComponent {
  private leadsService = inject(LeadsService);
  private router = inject(Router);

  // Signals
  leads = this.leadsService.leads;
  leadsCount = this.leadsService.leadsCount;

  // Computed signals for stats
  newLeadsCount = computed(
    () => this.leads().filter((lead) => lead.status === LeadStatus.NEW).length
  );

  inProgressCount = computed(
    () =>
      this.leads().filter((lead) => lead.status === LeadStatus.IN_PROGRESS)
        .length
  );

  followUpCount = computed(
    () =>
      this.leads().filter((lead) => lead.status === LeadStatus.FOLLOW_UP).length
  );

  notInterestedCount = computed(
    () =>
      this.leads().filter((lead) => lead.status === LeadStatus.NOT_INTERESTED)
        .length
  );

  getSourceHebrew(source: string): string {
    const sourceMap: { [key: string]: string } = {
      Website: 'אתר אינטרנט',
      Email: 'אימייל',
      Referral: 'המלצה',
      WhatsApp: 'ווטסאפ',
      Phone: 'טלפון',
      'Social Media': 'רשתות חברתיות',
      Other: 'אחר',
    };
    return sourceMap[source] || source;
  }

  getStatusHebrew(status: LeadStatus): string {
    const statusMap: { [key: string]: string } = {
      [LeadStatus.NEW]: 'חדש',
      [LeadStatus.IN_PROGRESS]: 'בטיפול',
      [LeadStatus.FOLLOW_UP]: 'במעקב',
      [LeadStatus.NOT_INTERESTED]: 'לא מעוניין',
    };
    return statusMap[status] || status;
  }

  addNewLead(): void {
    this.router.navigate(['/leads/new']);
  }

  editLead(id: string): void {
    this.router.navigate(['/leads/edit', id]);
  }

  deleteLead(id: string): void {
    if (confirm('האם אתה בטוח שברצונך למחוק ליד זה? פעולה זו אינה הפיכה.')) {
      this.leadsService.deleteLead(id);
    }
  }
}
