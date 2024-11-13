import { Product, Transaction } from "./types";

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Roti',
    brand: 'Roti',
    category: 'Roti',
    size: 750,
    currentStock: 24,
    minStockLevel: 10
  },
  {
    id: '2',
    name: 'Chicken Curry',
    brand: 'Chicken Curry',
    category: 'Chicken Curry',
    size: 750,
    currentStock: 5,
    minStockLevel: 8
  },
  {
    id: '3',
    name: 'Vodka',
    brand: 'Grey Goose',
    category: 'Vodka',
    size: 1000,
    currentStock: 15,
    minStockLevel: 12
  }
];

export const mockTransactions: Transaction[] = [
  {
    id: '1',
    type: 'INCOMING',
    quantity: 10,
    productId: '1',
    productName: 'Roti',
    date: '2024-03-13T10:00:00Z',
    note: 'Regular stock update'
  },
  {
    id: '2',
    type: 'OUTGOING',
    quantity: 5,
    productId: '2',
    productName: 'Chicken curry',
    date: '2024-03-13T11:30:00Z'
  },
  {
    id: '3',
    type: 'INCOMING',
    quantity: 10,
    productId: '1',
    productName: 'Chicken Manchurian',
    date: '2024-03-13T10:00:00Z',
    note: 'Regular stock update'
  },
  {
    id: '4',
    type: 'OUTGOING',
    quantity: 5,
    productId: '2',
    productName: 'Veg Manchurian',
    date: '2024-03-13T11:30:00Z'
  }
];