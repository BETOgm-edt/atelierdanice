/**
 * ATELIER NICE — ORDER REPOSITORY
 */

import { storageAdapter } from './storageAdapter';
import { INITIAL_ORDERS } from './mockData';

const STORAGE_KEY = 'atelier_nice_orders';

class OrderRepository {
  constructor() {
    this.ensureInitialized();
  }

  ensureInitialized() {
    const existing = storageAdapter.getItem(STORAGE_KEY, null);
    if (!existing || !Array.isArray(existing) || existing.length === 0) {
      storageAdapter.setItem(STORAGE_KEY, INITIAL_ORDERS);
    }
  }

  async getAll(filter = {}) {
    this.ensureInitialized();
    let orders = storageAdapter.getItem(STORAGE_KEY, INITIAL_ORDERS);

    if (filter.status && filter.status !== 'all') {
      orders = orders.filter(o => o.status === filter.status);
    }

    if (filter.search && filter.search.trim() !== '') {
      const term = filter.search.trim().toLowerCase();
      orders = orders.filter(o =>
        o.orderNumber?.toLowerCase().includes(term) ||
        o.customer?.name?.toLowerCase().includes(term) ||
        o.customer?.email?.toLowerCase().includes(term) ||
        o.customer?.phone?.toLowerCase().includes(term)
      );
    }

    orders.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    return JSON.parse(JSON.stringify(orders));
  }

  async getById(id) {
    this.ensureInitialized();
    const orders = storageAdapter.getItem(STORAGE_KEY, INITIAL_ORDERS);
    const order = orders.find(o => o.id === id || o.orderNumber === id);
    return order ? JSON.parse(JSON.stringify(order)) : null;
  }

  async create(orderData) {
    this.ensureInitialized();
    const orders = storageAdapter.getItem(STORAGE_KEY, INITIAL_ORDERS);
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const id = `ord-${Date.now()}`;
    const orderNumber = `#ATN-${randomNum}`;

    const newOrder = {
      id,
      orderNumber,
      customer: orderData.customer || {
        name: 'Cliente Não Identificado',
        email: '',
        phone: ''
      },
      items: Array.isArray(orderData.items) ? orderData.items : [],
      status: orderData.status || 'pending_payment',
      subtotal: parseFloat(orderData.subtotal) || 0,
      discount: parseFloat(orderData.discount) || 0,
      shipping: parseFloat(orderData.shipping) || 0,
      total: parseFloat(orderData.total) || 0,
      shippingMethod: orderData.shippingMethod || 'Retirada no Atelier Nice',
      paymentMethod: orderData.paymentMethod || 'A Definir',
      notes: orderData.notes || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    orders.unshift(newOrder);
    storageAdapter.setItem(STORAGE_KEY, orders);
    return JSON.parse(JSON.stringify(newOrder));
  }

  async updateStatus(id, newStatus) {
    this.ensureInitialized();
    const orders = storageAdapter.getItem(STORAGE_KEY, INITIAL_ORDERS);
    const index = orders.findIndex(o => o.id === id || o.orderNumber === id);

    if (index === -1) {
      throw new Error(`Pedido "${id}" não encontrado.`);
    }

    orders[index].status = newStatus;
    orders[index].updatedAt = new Date().toISOString();
    storageAdapter.setItem(STORAGE_KEY, orders);
    return JSON.parse(JSON.stringify(orders[index]));
  }

  subscribe(callback) {
    return storageAdapter.subscribe(STORAGE_KEY, callback);
  }
}

export const orderRepository = new OrderRepository();
