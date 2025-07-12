export enum LeadStatus {
  NEW = 'חדש',
  IN_PROGRESS = 'בטיפול',
  NOT_INTERESTED = 'לא מעוניין',
}

export interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  source: string;
  notes: string;
  status: LeadStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateLeadRequest {
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  source: string;
  notes: string;
  status: LeadStatus;
}

export interface UpdateLeadRequest extends Partial<CreateLeadRequest> {
  id: string;
}
