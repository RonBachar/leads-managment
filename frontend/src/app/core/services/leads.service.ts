import { Injectable, signal, computed } from '@angular/core';
import {
  Lead,
  CreateLeadRequest,
  UpdateLeadRequest,
  LeadStatus,
} from '../../shared/models/lead.model';

@Injectable({
  providedIn: 'root',
})
export class LeadsService {
  private readonly _leads = signal<Lead[]>([]);

  // Public signals
  public readonly leads = this._leads.asReadonly();
  public readonly leadsCount = computed(() => this._leads().length);

  constructor() {
    this.initializeMockData();
  }

  private initializeMockData(): void {
    const mockLeads: Lead[] = [
      {
        id: '1',
        firstName: 'יוסי',
        lastName: 'כהן',
        email: 'yossi.cohen@example.com',
        phone: '050-1234567',
        source: 'Website',
        notes: 'מתעניין בחבילה פרימיום',
        status: LeadStatus.NEW,
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15'),
      },
      {
        id: '2',
        firstName: 'שרה',
        lastName: 'לוי',
        email: 'sarah.levy@example.com',
        phone: '052-9876543',
        source: 'Referral',
        notes: 'לעקוב השבוע הבא',
        status: LeadStatus.IN_PROGRESS,
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date('2024-01-12'),
      },
      {
        id: '3',
        firstName: 'דוד',
        lastName: 'גולדברג',
        email: 'david.goldberg@example.com',
        phone: '054-5551234',
        source: 'Email',
        notes: 'צריך לעקוב אחרי שבועיים',
        status: LeadStatus.FOLLOW_UP,
        createdAt: new Date('2024-01-05'),
        updatedAt: new Date('2024-01-08'),
      },
      {
        id: '4',
        firstName: 'מיכל',
        lastName: 'ברק',
        phone: '053-7778888',
        source: 'WhatsApp',
        notes: 'לא מעוניין כרגע',
        status: LeadStatus.NOT_INTERESTED,
        createdAt: new Date('2024-01-03'),
        updatedAt: new Date('2024-01-06'),
      },
    ];

    this._leads.set(mockLeads);
  }

  getLeadById(id: string): Lead | undefined {
    return this._leads().find((lead) => lead.id === id);
  }

  createLead(leadData: CreateLeadRequest): Lead {
    const newLead: Lead = {
      id: this.generateId(),
      ...leadData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this._leads.update((leads) => [...leads, newLead]);
    return newLead;
  }

  updateLead(id: string, updates: Partial<CreateLeadRequest>): Lead | null {
    const currentLeads = this._leads();
    const leadIndex = currentLeads.findIndex((lead) => lead.id === id);

    if (leadIndex === -1) {
      return null;
    }

    const updatedLead: Lead = {
      ...currentLeads[leadIndex],
      ...updates,
      updatedAt: new Date(),
    };

    this._leads.update((leads) =>
      leads.map((lead) => (lead.id === id ? updatedLead : lead))
    );

    return updatedLead;
  }

  deleteLead(id: string): boolean {
    const currentLeads = this._leads();
    const leadExists = currentLeads.some((lead) => lead.id === id);

    if (!leadExists) {
      return false;
    }

    this._leads.update((leads) => leads.filter((lead) => lead.id !== id));
    return true;
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}
