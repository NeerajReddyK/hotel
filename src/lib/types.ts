export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  size: number;
  currentStock: number;
  minStockLevel: number;
}

export interface Transaction {
  id: string;
  type: 'INCOMING' | 'OUTGOING';
  quantity: number;
  productId: string;
  productName: string;
  date: string;
  note?: string;
}