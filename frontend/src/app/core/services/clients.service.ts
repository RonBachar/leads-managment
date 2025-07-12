import { Injectable, signal, computed } from '@angular/core';
import {
  Client,
  CreateClientRequest,
  UpdateClientRequest,
  PackageType,
} from '../../shared/models/client.model';

@Injectable({
  providedIn: 'root',
})
export class ClientsService {
  private readonly _clients = signal<Client[]>([]);

  // Public signals
  public readonly clients = this._clients.asReadonly();
  public readonly clientsCount = computed(() => this._clients().length);

  constructor() {
    this.initializeMockData();
  }

  private initializeMockData(): void {
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
        renewalDate: new Date('2024-12-15'),
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
        renewalDate: new Date('2024-11-20'),
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
        renewalDate: new Date('2024-10-05'),
        contractFile: null,
        createdAt: new Date('2024-01-05'),
        updatedAt: new Date('2024-01-08'),
      },
    ];

    this._clients.set(mockClients);
  }

  getClientById(id: string): Client | undefined {
    return this._clients().find((client) => client.id === id);
  }

  createClient(clientData: CreateClientRequest): Client {
    const newClient: Client = {
      id: this.generateId(),
      ...clientData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this._clients.update((clients) => [...clients, newClient]);
    return newClient;
  }

  updateClient(
    id: string,
    updates: Partial<CreateClientRequest>
  ): Client | null {
    const currentClients = this._clients();
    const clientIndex = currentClients.findIndex((client) => client.id === id);

    if (clientIndex === -1) {
      return null;
    }

    const updatedClient: Client = {
      ...currentClients[clientIndex],
      ...updates,
      updatedAt: new Date(),
    };

    this._clients.update((clients) =>
      clients.map((client) => (client.id === id ? updatedClient : client))
    );

    return updatedClient;
  }

  deleteClient(id: string): boolean {
    const currentClients = this._clients();
    const clientExists = currentClients.some((client) => client.id === id);

    if (!clientExists) {
      return false;
    }

    this._clients.update((clients) =>
      clients.filter((client) => client.id !== id)
    );
    return true;
  }

  updateContractFile(id: string, file: File | null): boolean {
    const currentClients = this._clients();
    const clientIndex = currentClients.findIndex((client) => client.id === id);

    if (clientIndex === -1) {
      return false;
    }

    const updatedClient: Client = {
      ...currentClients[clientIndex],
      contractFile: file,
      updatedAt: new Date(),
    };

    this._clients.update((clients) =>
      clients.map((client) => (client.id === id ? updatedClient : client))
    );

    return true;
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}
