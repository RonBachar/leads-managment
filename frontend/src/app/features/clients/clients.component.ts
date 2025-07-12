import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ClientsService } from '../../core/services/clients.service';
import { Client, PackageType } from '../../shared/models/client.model';
import { computed } from '@angular/core';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.css',
})
export class ClientsComponent {
  private clientsService = inject(ClientsService);
  private router = inject(Router);

  // Make Math available in template
  Math = Math;

  // Signals
  clients = this.clientsService.clients;
  clientsCount = this.clientsService.clientsCount;

  // Computed signals for stats
  monthlyRevenue = computed(() => {
    const totalRevenue = this.clients().reduce(
      (total, client) => total + client.packagePrice,
      0
    );
    return totalRevenue / 12; // Average monthly revenue
  });

  hostingCount = computed(
    () =>
      this.clients().filter(
        (client) =>
          client.packageType === PackageType.HOSTING ||
          client.packageType === PackageType.HOSTING_ELEMENTOR_PRO
      ).length
  );

  elementorCount = computed(
    () =>
      this.clients().filter(
        (client) =>
          client.packageType === PackageType.ELEMENTOR_PRO ||
          client.packageType === PackageType.HOSTING_ELEMENTOR_PRO
      ).length
  );

  getPackageHebrew(packageType: PackageType): string {
    const packageMap: { [key: string]: string } = {
      [PackageType.HOSTING]: 'אחסון',
      [PackageType.ELEMENTOR_PRO]: 'Elementor Pro',
      [PackageType.HOSTING_ELEMENTOR_PRO]: 'אחסון + Elementor Pro',
    };
    return packageMap[packageType] || packageType;
  }

  getPackageClass(packageType: PackageType): string {
    const classMap: { [key: string]: string } = {
      [PackageType.HOSTING]: 'hosting',
      [PackageType.ELEMENTOR_PRO]: 'elementor-pro',
      [PackageType.HOSTING_ELEMENTOR_PRO]: 'hosting-elementor-pro',
    };
    return classMap[packageType] || 'default';
  }

  getRenewalClass(renewalDate: Date): string {
    const today = new Date();
    const diffTime = renewalDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return 'renewal-overdue';
    } else if (diffDays <= 30) {
      return 'renewal-soon';
    }
    return '';
  }

  addNewClient(): void {
    this.router.navigate(['/clients/new']);
  }

  editClient(id: string): void {
    this.router.navigate(['/clients/edit', id]);
  }

  deleteClient(id: string): void {
    if (confirm('האם אתה בטוח שברצונך למחוק לקוח זה? פעולה זו אינה הפיכה.')) {
      this.clientsService.deleteClient(id);
    }
  }
}
