import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ClientsService } from '../../core/services/clients.service';
import { Client, PackageType } from '../../shared/models/client.model';
import {
  APP_CONSTANTS,
  PACKAGE_LABELS,
} from '../../shared/constants/app.constants';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss'],
})
export class ClientsComponent implements OnInit {
  private readonly clientsService = inject(ClientsService);
  private readonly router = inject(Router);

  clients: Client[] = [];
  filteredClients: Client[] = [];
  searchTerm = '';
  isLoading = false;

  readonly routes = APP_CONSTANTS.ROUTES;
  readonly PackageType = PackageType;

  ngOnInit(): void {
    this.loadClients();
  }

  loadClients(): void {
    this.isLoading = true;
    this.clients = this.clientsService.items();
    this.filteredClients = [...this.clients];
    this.isLoading = false;
  }

  onSearch(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchTerm = target.value;
    this.filterClients();
  }

  filterClients(): void {
    if (!this.searchTerm.trim()) {
      this.filteredClients = [...this.clients];
      return;
    }

    const term = this.searchTerm.toLowerCase();
    this.filteredClients = this.clients.filter(
      (client) =>
        client.firstName.toLowerCase().includes(term) ||
        client.lastName.toLowerCase().includes(term) ||
        (client.email && client.email.toLowerCase().includes(term)) ||
        (client.phone && client.phone.includes(term)) ||
        (client.domain && client.domain.toLowerCase().includes(term))
    );
  }

  getPackageClass(packageType: PackageType): string {
    switch (packageType) {
      case PackageType.NO_PACKAGE:
        return 'badge-no-package';
      case PackageType.HOSTING:
        return 'badge-hosting';
      case PackageType.ELEMENTOR_PRO:
        return 'badge-elementor-pro';
      case PackageType.HOSTING_ELEMENTOR_PRO:
        return 'badge-hosting-elementor-pro';
      default:
        return 'badge-info';
    }
  }

  getPackageText(packageType: PackageType): string {
    return PACKAGE_LABELS[packageType] || packageType;
  }

  getContractStatusClass(client: Client): string {
    return client.contractFile ? 'has-contract' : 'no-contract';
  }

  getContractStatusText(client: Client): string {
    return client.contractFile ? 'יש חוזה' : 'אין חוזה';
  }

  getRenewalStatusClass(client: Client): string {
    const today = new Date();
    const renewalDate = new Date(client.renewalDate);
    const daysUntilRenewal = Math.ceil(
      (renewalDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysUntilRenewal < 0) {
      return 'renewal-overdue';
    } else if (daysUntilRenewal <= 30) {
      return 'renewal-soon';
    }
    return '';
  }

  getRenewalStatusText(client: Client): string {
    const today = new Date();
    const renewalDate = new Date(client.renewalDate);
    const daysUntilRenewal = Math.ceil(
      (renewalDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysUntilRenewal < 0) {
      return `${Math.abs(daysUntilRenewal)} ימים באיחור`;
    } else if (daysUntilRenewal === 0) {
      return 'היום';
    } else if (daysUntilRenewal === 1) {
      return 'מחר';
    } else {
      return `${daysUntilRenewal} ימים`;
    }
  }

  editClient(client: Client): void {
    this.router.navigate([this.routes.CLIENTS_EDIT, client.id]);
  }

  deleteClient(client: Client): void {
    if (confirm('האם אתה בטוח שברצונך למחוק לקוח זה?')) {
      this.clientsService.deleteClient(client.id);
      this.loadClients();
    }
  }

  addNewClient(): void {
    this.router.navigate([this.routes.CLIENTS_NEW]);
  }

  getTotalClients(): number {
    return this.clients.length;
  }

  getActiveClients(): number {
    return this.clients.filter((client) => {
      const today = new Date();
      const renewalDate = new Date(client.renewalDate);
      return renewalDate >= today;
    }).length;
  }

  getTotalRevenue(): number {
    return this.clients.reduce((sum, client) => sum + client.packagePrice, 0);
  }

  getMonthlyRevenue(): number {
    return this.clientsService.monthlyRevenue();
  }

  getAverageRevenue(): number {
    if (this.clients.length === 0) return 0;
    return Math.round(this.getTotalRevenue() / this.clients.length);
  }

  getAverageMonthlyIncome(): number {
    if (this.clients.length === 0) return 0;
    const totalPackagePrices = this.clients.reduce(
      (sum, client) => sum + client.packagePrice,
      0
    );
    return Math.round(totalPackagePrices / this.clients.length);
  }

  getClientsWithPackage(): number {
    return this.clients.filter(
      (client) =>
        client.packageType &&
        client.packageType !== null &&
        client.packageType !== PackageType.NO_PACKAGE
    ).length;
  }

  getClientsWithoutContract(): number {
    return this.clients.filter(
      (client) => !client.contractFile || client.contractFile === null
    ).length;
  }

  formatDate(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }
}
