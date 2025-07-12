import { Injectable, computed } from '@angular/core';
import { BaseServiceClass } from '../../shared/services/base.service';
import {
  Lead,
  CreateLeadRequest,
  UpdateLeadRequest,
  LeadStatus,
} from '../../shared/models/lead.model';

@Injectable({
  providedIn: 'root',
})
export class LeadsService extends BaseServiceClass<Lead> {
  // Computed signals for statistics
  public readonly newLeadsCount = computed(
    () => this._items().filter((lead) => lead.status === LeadStatus.NEW).length
  );

  public readonly inProgressCount = computed(
    () =>
      this._items().filter((lead) => lead.status === LeadStatus.IN_PROGRESS)
        .length
  );

  public readonly notInterestedCount = computed(
    () =>
      this._items().filter((lead) => lead.status === LeadStatus.NOT_INTERESTED)
        .length
  );

  constructor() {
    super();
    this.initializeMockData();
  }

  /**
   * Create a new lead with proper typing
   */
  createLead(leadData: CreateLeadRequest): Lead {
    return this.create({
      ...leadData,
      notes: leadData.notes || '',
    });
  }

  /**
   * Update an existing lead
   */
  updateLead(id: string, updates: Partial<CreateLeadRequest>): Lead | null {
    return this.update(id, updates);
  }

  /**
   * Delete a lead
   */
  deleteLead(id: string): boolean {
    return this.delete(id);
  }

  /**
   * Get lead by ID
   */
  getLeadById(id: string): Lead | undefined {
    return this.getById(id);
  }

  protected initializeMockData(): void {
    const mockLeads: Lead[] = [
      {
        id: '1',
        firstName: 'יוסי',
        lastName: 'כהן',
        email: 'yossi.cohen@example.com',
        phone: '050-1234567',
        source: 'Website',
        notes: 'מתעניין בחבילה פרימיום - צור קשר בשבוע הבא',
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
        notes: 'המלצה מחבר - לעקוב השבוע הבא',
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
        notes: 'צריך לעקוב אחרי שבועיים - מתעניין באחסון',
        status: LeadStatus.IN_PROGRESS,
        createdAt: new Date('2024-01-05'),
        updatedAt: new Date('2024-01-08'),
      },
      {
        id: '4',
        firstName: 'מיכל',
        lastName: 'ברק',
        phone: '053-7778888',
        source: 'WhatsApp',
        notes: 'לא מעוניין כרגע - נסה שוב בעוד חודש',
        status: LeadStatus.NOT_INTERESTED,
        createdAt: new Date('2024-01-03'),
        updatedAt: new Date('2024-01-06'),
      },
      {
        id: '5',
        firstName: 'עמית',
        lastName: 'רוזן',
        email: 'amit.rozen@example.com',
        phone: '050-4445555',
        source: 'Facebook',
        notes: 'מתעניין באתר חדש - צור קשר השבוע',
        status: LeadStatus.NEW,
        createdAt: new Date('2024-01-20'),
        updatedAt: new Date('2024-01-20'),
      },
      {
        id: '6',
        firstName: 'נועה',
        lastName: 'שפירא',
        email: 'noa.shapira@example.com',
        phone: '052-6667777',
        source: 'Instagram',
        notes: 'מתעניינת בעיצוב - שלח הצעת מחיר',
        status: LeadStatus.IN_PROGRESS,
        createdAt: new Date('2024-01-18'),
        updatedAt: new Date('2024-01-19'),
      },
      {
        id: '7',
        firstName: 'אלון',
        lastName: 'גרין',
        email: 'alon.green@example.com',
        phone: '054-8889999',
        source: 'LinkedIn',
        notes: 'חברת הייטק - פרויקט גדול',
        status: LeadStatus.IN_PROGRESS,
        createdAt: new Date('2024-01-12'),
        updatedAt: new Date('2024-01-15'),
      },
      {
        id: '8',
        firstName: 'תמר',
        lastName: 'וייס',
        email: 'tamar.weiss@example.com',
        phone: '050-1112222',
        source: 'Google Ads',
        notes: 'מתעניינת באחסון ואלמנטור - צור קשר',
        status: LeadStatus.NEW,
        createdAt: new Date('2024-01-22'),
        updatedAt: new Date('2024-01-22'),
      },
      {
        id: '9',
        firstName: 'גיא',
        lastName: 'מור',
        email: 'guy.mor@example.com',
        phone: '052-3334444',
        source: 'Referral',
        notes: 'עורך דין - צריך אתר מקצועי',
        status: LeadStatus.IN_PROGRESS,
        createdAt: new Date('2024-01-16'),
        updatedAt: new Date('2024-01-17'),
      },
      {
        id: '10',
        firstName: 'דנה',
        lastName: 'פלד',
        email: 'dana.feld@example.com',
        phone: '054-5556666',
        source: 'Website',
        notes: 'חנות אונליין - פרויקט מורכב',
        status: LeadStatus.IN_PROGRESS,
        createdAt: new Date('2024-01-08'),
        updatedAt: new Date('2024-01-10'),
      },
    ];

    this._items.set(mockLeads);
  }
}
