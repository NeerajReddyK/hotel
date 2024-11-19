import { atom } from 'recoil';

export type MenuItem = {
  id: number;
  name: string;
  price: number;
  category: string;
};

export type OrderItem = MenuItem & {
  quantity: number;
};

export type TableOrder = {
  tableId: number;
  orders: OrderItem[];
  isOccupied: boolean;
  timestamp: Date;
};

export const MENU_ITEMS: MenuItem[] = [
  { id: 1, name: 'Margherita Pizza', price: 12.99, category: 'Pizza' },
  { id: 2, name: 'Pasta Carbonara', price: 10.99, category: 'Pasta' },
  { id: 3, name: 'Caesar Salad', price: 8.99, category: 'Salads' },
  { id: 4, name: 'Chicken Wings', price: 9.99, category: 'Appetizers' },
  { id: 5, name: 'Pepperoni Pizza', price: 13.99, category: 'Pizza' },
  { id: 6, name: 'Mushroom Risotto', price: 14.99, category: 'Mains' },
];

// Atom for all tables
export const tablesState = atom<TableOrder[]>({
  key: 'tablesState',
  default: Array.from({ length: 25 }, (_, i) => ({
    tableId: i + 1,
    orders: [],
    isOccupied: false,
    timestamp: new Date(),
  })),
});

// Atom for selected table
export const selectedTableState = atom<TableOrder | null>({
  key: 'selectedTableState',
  default: null,
});