// printerService.ts
import { Device } from 'escpos-usb';
import { Printer } from 'escpos';
import { USB } from 'escpos-usb';
import { OrderItem } from '@/state/atoms/tableState'; // Adjust this import path to match your project structure

// Define the Token interface
export interface Token {
  tokenNumber: number;
  tableId: number;
  timestamp: string;
  items: OrderItem[];
}

interface PrinterConfig {
  width: number;
  characterSize: number;
  emphasis: boolean;
  align: 'left' | 'center' | 'right';
}

interface ESCPOSPrinter {
  align: (alignment: 'left' | 'center' | 'right') => ESCPOSPrinter;
  size: (size: number) => ESCPOSPrinter;
  text: (content: string) => ESCPOSPrinter;
  cut: () => ESCPOSPrinter;
  close: () => Promise<void>;
}

export class ThermalPrinterService {
  private device: Device | null = null;
  private printer: ESCPOSPrinter | null = null;
  private defaultConfig: PrinterConfig = {
    width: 32,
    characterSize: 1,
    emphasis: false,
    align: 'left'
  };

  constructor() {
    try {
      // Find Everycom printer
      // Note: You'll need to update the vendorId and productId based on your printer
      const vendorId = 0x4B8; // Example ID - replace with actual
      const productId = 0x0E03; // Example ID - replace with actual
      
      this.device = new USB(vendorId.toString(16), productId.toString(16));
      const options = { encoding: "GB18030" };
      
      if (this.device) {
        this.printer = new Printer(this.device, options) as unknown as ESCPOSPrinter;
      }
    } catch (error) {
      console.error('Failed to initialize printer:', error);
    }
  }

  private formatText(text: string, width: number): string {
    return text.padEnd(width);
  }

  private formatCurrency(amount: number): string {
    return amount.toFixed(2);
  }

  private checkPrinterStatus(): void {
    if (!this.printer) {
      throw new Error('Printer not initialized');
    }
  }

  async printToken(token: Token): Promise<void> {
    this.checkPrinterStatus();
    
    try {
      const printer = this.printer as ESCPOSPrinter;
      await printer.align('center')
        .size(2)
        .text('KITCHEN TOKEN')
        .size(1)
        .text('------------------------')
        .align('left')
        .text(`Token #: ${token.tokenNumber}`)
        .text(`Table: ${token.tableId}`)
        .text(`Time: ${token.timestamp}`)
        .text('------------------------')
        .size(1)
        .text('ITEMS:')
        .text('');

      // Print items
      for (const item of token.items) {
        await printer
          .text(`${item.name}`)
          .align('right')
          .text(`x${item.quantity}`)
          .align('left');
      }

      await printer
        .text('------------------------')
        .cut()
        .close();

    } catch (error) {
      console.error('Failed to print token:', error);
      throw new Error('Printing failed');
    }
  }

  async printReceipt(tableId: number, orders: OrderItem[], total: number): Promise<void> {
    this.checkPrinterStatus();
    
    try {
      const printer = this.printer as ESCPOSPrinter;
      await printer.align('center')
        .size(2)
        .text('RESTAURANT NAME')
        .size(1)
        .text('Your Address Line 1')
        .text('Your Address Line 2')
        .text('Tel: Your Phone Number')
        .text('------------------------')
        .align('left')
        .text(`Table: ${tableId}`)
        .text(`Date: ${new Date().toLocaleString()}`)
        .text('------------------------')
        .size(1)
        .text('ITEMS:')
        .text('');

      // Print items
      for (const item of orders) {
        const itemTotal = item.price * item.quantity;
        await printer
          .text(`${item.name} x${item.quantity}`)
          .align('right')
          .text(`$${this.formatCurrency(itemTotal)}`)
          .align('left');
      }

      await printer
        .text('------------------------')
        .align('right')
        .size(2)
        .text(`TOTAL: $${this.formatCurrency(total)}`)
        .size(1)
        .text('------------------------')
        .align('center')
        .text('Thank you for dining with us!')
        .text('Please visit again')
        .cut()
        .close();

    } catch (error) {
      console.error('Failed to print receipt:', error);
      throw new Error('Printing failed');
    }
  }
}

export const printerService = new ThermalPrinterService();