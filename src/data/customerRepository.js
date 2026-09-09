/**
 * ATELIER NICE — CUSTOMER REPOSITORY
 */

import { storageAdapter } from './storageAdapter';
import { INITIAL_CUSTOMERS } from './mockData';

const STORAGE_KEY = 'atelier_nice_customers';

class CustomerRepository {
  constructor() {
    this.ensureInitialized();
  }

  ensureInitialized() {
    const existing = storageAdapter.getItem(STORAGE_KEY, null);
    if (!existing || !Array.isArray(existing) || existing.length === 0) {
      storageAdapter.setItem(STORAGE_KEY, INITIAL_CUSTOMERS);
    }
  }

  async getAll(search = '') {
    this.ensureInitialized();
    let customers = storageAdapter.getItem(STORAGE_KEY, INITIAL_CUSTOMERS);

    if (search && search.trim() !== '') {
      const term = search.trim().toLowerCase();
      customers = customers.filter(c =>
        c.name?.toLowerCase().includes(term) ||
        c.email?.toLowerCase().includes(term) ||
        c.phone?.toLowerCase().includes(term) ||
        c.city?.toLowerCase().includes(term)
      );
    }

    customers.sort((a, b) => (b.totalSpent || 0) - (a.totalSpent || 0));
    return JSON.parse(JSON.stringify(customers));
  }

  async getById(id) {
    this.ensureInitialized();
    const customers = storageAdapter.getItem(STORAGE_KEY, INITIAL_CUSTOMERS);
    const customer = customers.find(c => c.id === id);
    return customer ? JSON.parse(JSON.stringify(customer)) : null;
  }

  async create(data) {
    this.ensureInitialized();
    const customers = storageAdapter.getItem(STORAGE_KEY, INITIAL_CUSTOMERS);
    const id = `cust-${Date.now()}`;

    const newCustomer = {
      id,
      name: data.name?.trim() || 'Cliente Sem Nome',
      email: data.email?.trim() || '',
      phone: data.phone?.trim() || '',
      city: data.city?.trim() || '',
      state: data.state?.trim() || '',
      ordersCount: 0,
      totalSpent: 0,
      createdAt: new Date().toISOString()
    };

    customers.unshift(newCustomer);
    storageAdapter.setItem(STORAGE_KEY, customers);
    return JSON.parse(JSON.stringify(newCustomer));
  }

  async recordPurchase(customerId, amount) {
    this.ensureInitialized();
    const customers = storageAdapter.getItem(STORAGE_KEY, INITIAL_CUSTOMERS);
    const index = customers.findIndex(c => c.id === customerId);

    if (index !== -1) {
      customers[index].ordersCount = (customers[index].ordersCount || 0) + 1;
      customers[index].totalSpent = (customers[index].totalSpent || 0) + (parseFloat(amount) || 0);
      storageAdapter.setItem(STORAGE_KEY, customers);
    }
  }

  subscribe(callback) {
    return storageAdapter.subscribe(STORAGE_KEY, callback);
  }
}

export const customerRepository = new CustomerRepository();
