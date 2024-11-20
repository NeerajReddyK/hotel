export interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  category: string;
}

export interface PrinterCommand {
  text: string;
  size?: number;
  align?: 'left' | 'center' | 'right';
}