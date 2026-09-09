/**
 * ATELIER NICE — UNIFIED DATA SERVICE FACADE
 * Single point of truth for all modules, isolating UI from persistence mechanism.
 */

import { productRepository } from './productRepository';
import { categoryRepository } from './categoryRepository';
import { orderRepository } from './orderRepository';
import { customerRepository } from './customerRepository';
import { settingsRepository } from './settingsRepository';
import { contentRepository } from './contentRepository';
import { storageRepository } from './storageRepository';

export const dataService = {
  products: productRepository,
  categories: categoryRepository,
  orders: orderRepository,
  customers: customerRepository,
  settings: settingsRepository,
  content: contentRepository,
  storage: storageRepository
};

export {
  productRepository,
  categoryRepository,
  orderRepository,
  customerRepository,
  settingsRepository,
  contentRepository,
  storageRepository
};

export default dataService;
