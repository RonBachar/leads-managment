import { Injectable, computed } from '@angular/core';
import { BaseServiceClass } from '../../shared/services/base.service';
import {
  Client,
  CreateClientRequest,
  UpdateClientRequest,
  PackageType,
} from '../../shared/models/client.model';

@Injectable({
  providedIn: 'root',
})
export class ClientsService extends BaseServiceClass<Client> {
  // Computed signals for statistics
  public readonly monthlyRevenue = computed(() => {
    const totalRevenue = this._items().reduce(
      (total, client) => total + client.packagePrice,
      0
    );
    return Math.floor(totalRevenue / 12); // Average monthly revenue
  });

  public readonly hostingCount = computed(
    () =>
      this._items().filter(
        (client) =>
          client.packageType === PackageType.HOSTING ||
          client.packageType === PackageType.HOSTING_ELEMENTOR_PRO
      ).length
  );

  public readonly elementorCount = computed(
    () =>
      this._items().filter(
        (client) =>
          client.packageType === PackageType.ELEMENTOR_PRO ||
          client.packageType === PackageType.HOSTING_ELEMENTOR_PRO
      ).length
  );

  constructor() {
    super();
    this.initializeMockData();
  }

  /**
   * Create a new client with proper typing
   */
  createClient(clientData: CreateClientRequest): Client {
    return this.create(clientData);
  }

  /**
   * Update an existing client
   */
  updateClient(
    id: string,
    updates: Partial<CreateClientRequest>
  ): Client | null {
    return this.update(id, updates);
  }

  /**
   * Delete a client
   */
  deleteClient(id: string): boolean {
    return this.delete(id);
  }

  /**
   * Get client by ID
   */
  getClientById(id: string): Client | undefined {
    return this.getById(id);
  }

  /**
   * Update contract file for a client
   */
  updateContractFile(id: string, file: File | null): boolean {
    const currentClients = this._items();
    const clientIndex = currentClients.findIndex((client) => client.id === id);

    if (clientIndex === -1) {
      return false;
    }

    const updatedClient: Client = {
      ...currentClients[clientIndex],
      contractFile: file,
      updatedAt: new Date(),
    };

    this._items.update((clients) =>
      clients.map((client) => (client.id === id ? updatedClient : client))
    );

    return true;
  }

  protected initializeMockData(): void {
    const mockClients: Client[] = [
      {
        id: '1',
        firstName: 'אבי',
        lastName: 'גולדברג',
        email: 'avi.goldberg@example.com',
        phone: '050-1234567',
        domain: 'goldberg-law.co.il',
        packageType: PackageType.HOSTING_ELEMENTOR_PRO,
        packagePrice: 299,
        renewalDate: new Date('2025-01-15'),
        contractFile: null,
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15'),
      },
      {
        id: '2',
        firstName: 'מיכל',
        lastName: 'כהן',
        email: 'michal.cohen@example.com',
        phone: '052-9876543',
        domain: 'cohen-design.com',
        packageType: PackageType.ELEMENTOR_PRO,
        packagePrice: 99,
        renewalDate: new Date('2025-02-20'),
        contractFile: null,
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date('2024-01-12'),
      },
      {
        id: '3',
        firstName: 'דן',
        lastName: 'לוי',
        email: 'dan.levy@example.com',
        phone: '054-5551234',
        domain: 'levy-restaurant.co.il',
        packageType: PackageType.HOSTING,
        packagePrice: 149,
        renewalDate: new Date('2025-03-05'),
        contractFile: null,
        createdAt: new Date('2024-01-05'),
        updatedAt: new Date('2024-01-08'),
      },
      {
        id: '4',
        firstName: 'שירה',
        lastName: 'ברק',
        email: 'shira.barak@example.com',
        phone: '050-4445555',
        domain: 'barak-photography.com',
        packageType: PackageType.HOSTING_ELEMENTOR_PRO,
        packagePrice: 299,
        renewalDate: new Date('2025-04-15'),
        contractFile: null,
        createdAt: new Date('2024-01-20'),
        updatedAt: new Date('2024-01-20'),
      },
      {
        id: '5',
        firstName: 'עומר',
        lastName: 'רוזן',
        email: 'omer.rozen@example.com',
        phone: '052-6667777',
        domain: 'rozen-consulting.co.il',
        packageType: PackageType.ELEMENTOR_PRO,
        packagePrice: 99,
        renewalDate: new Date('2025-05-30'),
        contractFile: null,
        createdAt: new Date('2024-01-18'),
        updatedAt: new Date('2024-01-19'),
      },
      {
        id: '6',
        firstName: 'נועה',
        lastName: 'שפירא',
        email: 'noa.shapira@example.com',
        phone: '054-8889999',
        domain: 'shapira-boutique.com',
        packageType: PackageType.HOSTING,
        packagePrice: 149,
        renewalDate: new Date('2025-06-12'),
        contractFile: null,
        createdAt: new Date('2024-01-12'),
        updatedAt: new Date('2024-01-15'),
      },
      {
        id: '7',
        firstName: 'אלון',
        lastName: 'גרין',
        email: 'alon.green@example.com',
        phone: '050-1112222',
        domain: 'green-tech.co.il',
        packageType: PackageType.HOSTING_ELEMENTOR_PRO,
        packagePrice: 299,
        renewalDate: new Date('2025-07-25'),
        contractFile: null,
        createdAt: new Date('2024-01-22'),
        updatedAt: new Date('2024-01-22'),
      },
      {
        id: '8',
        firstName: 'תמר',
        lastName: 'וייס',
        email: 'tamar.weiss@example.com',
        phone: '052-3334444',
        domain: 'weiss-accounting.com',
        packageType: PackageType.ELEMENTOR_PRO,
        packagePrice: 99,
        renewalDate: new Date('2025-08-18'),
        contractFile: null,
        createdAt: new Date('2024-01-16'),
        updatedAt: new Date('2024-01-17'),
      },
      {
        id: '9',
        firstName: 'גיא',
        lastName: 'מור',
        email: 'guy.mor@example.com',
        phone: '054-5556666',
        domain: 'mor-legal.co.il',
        packageType: PackageType.HOSTING,
        packagePrice: 149,
        renewalDate: new Date('2025-09-10'),
        contractFile: null,
        createdAt: new Date('2024-01-08'),
        updatedAt: new Date('2024-01-10'),
      },
      {
        id: '10',
        firstName: 'דנה',
        lastName: 'פלד',
        email: 'dana.feld@example.com',
        phone: '050-7778888',
        domain: 'feld-interior.com',
        packageType: PackageType.HOSTING_ELEMENTOR_PRO,
        packagePrice: 299,
        renewalDate: new Date('2025-10-22'),
        contractFile: null,
        createdAt: new Date('2024-01-05'),
        updatedAt: new Date('2024-01-07'),
      },
    ];

    this._items.set(mockClients);
  }
}
