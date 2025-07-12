export enum PackageType {
  NO_PACKAGE = 'ללא חבילה',
  HOSTING = 'Hosting',
  ELEMENTOR_PRO = 'Elementor Pro',
  HOSTING_ELEMENTOR_PRO = 'Hosting + Elementor Pro',
}

export interface Client {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  domain: string;
  packageType: PackageType;
  packagePrice: number;
  renewalDate: Date;
  contractFile: File | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateClientRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  domain: string;
  packageType: PackageType;
  packagePrice: number;
  renewalDate: Date;
  contractFile: File | null;
}

export interface UpdateClientRequest extends Partial<CreateClientRequest> {
  id: string;
}
