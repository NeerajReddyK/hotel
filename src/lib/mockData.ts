import { Product, Transaction } from "./types";

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Scotch Whisky',
    brand: 'Johnnie Walker',
    category: 'Whisky',
    size: 750,
    currentStock: 24,
    minStockLevel: 10
  },
  {
    id: '2',
    name: 'Blue Label',
    brand: 'Johnnie Walker',
    category: 'Whisky',
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
    productName: 'Scotch Whisky',
    date: '2024-03-13T10:00:00Z',
    note: 'Regular stock update'
  },
  {
    id: '2',
    type: 'OUTGOING',
    quantity: 5,
    productId: '2',
    productName: 'Blue Label',
    date: '2024-03-13T11:30:00Z'
  }
];