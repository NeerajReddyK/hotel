// services/bluetoothPrinterService.ts
// interface PrinterCommand {
//   text: string;
//   size?: number;
//   align?: 'left' | 'center' | 'right';
// }
import { OrderItem } from '../types';

// Add these type declarations at the top of the file
declare global {
  interface Navigator {
    bluetooth: {
      requestDevice(options: {
        filters: Array<{
          services?: string[];
          namePrefix?: string;
        }>;
      }): Promise<BluetoothDevice>;
    };
  }

  interface BluetoothDevice {
    gatt?: {
      connect(): Promise<BluetoothRemoteGATTServer>;
      connected?: boolean;
      disconnect(): void;
    };
  }

  interface BluetoothRemoteGATTServer {
    getPrimaryService(service: string): Promise<BluetoothRemoteGATTService>;
  }

  interface BluetoothRemoteGATTService {
    getCharacteristic(characteristic: string): Promise<BluetoothRemoteGATTCharacteristic>;
  }

  interface BluetoothRemoteGATTCharacteristic {
    writeValue(value: BufferSource): Promise<void>;
  }
}

export class BluetoothPrinterService {
  private static instance: BluetoothPrinterService;
  private device: BluetoothDevice | null = null;
  private characteristic: BluetoothRemoteGATTCharacteristic | null = null;
  private textEncoder = new TextEncoder();

  public constructor() {
    // Private constructor to enforce singleton pattern
  }

  public static getInstance(): BluetoothPrinterService {
    if (!BluetoothPrinterService.instance) {
      BluetoothPrinterService.instance = new BluetoothPrinterService();
    }
    return BluetoothPrinterService.instance;
  }

  async connectPrinter(): Promise<void> {
    try {
      // Request Bluetooth device with printer service
      this.device = await navigator.bluetooth.requestDevice({
        filters: [
          { 
            services: ['000018f0-0000-1000-8000-00805f9b34fb'], // Typical printer service UUID
            namePrefix: 'EC-58' // Your printer name prefix
          }
        ]
      });

      if (!this.device) {
        throw new Error('No printer selected');
      }

      console.log('Connecting to printer...');
      const server = await this.device.gatt?.connect();
      if (!server) {
        throw new Error('Could not connect to printer');
      }

      // Get the printer service
      const service = await server.getPrimaryService('000018f0-0000-1000-8000-00805f9b34fb');
      // Get the characteristic for writing
      this.characteristic = await service.getCharacteristic('00002af1-0000-1000-8000-00805f9b34fb');

      console.log('Printer connected successfully');
    } catch (error) {
      console.error('Failed to connect:', error);
      throw error;
    }
  }

  private async sendCommand(command: Uint8Array): Promise<void> {
    if (!this.characteristic) {
      throw new Error('Printer not connected');
    }
    await this.characteristic.writeValue(command);
  }


  private async printLine(text: string): Promise<void> {
    const data = this.textEncoder.encode(text + '\n');
    await this.sendCommand(data);
  }

  async printReceipt(tableId: number, orders: OrderItem[], total: number): Promise<void> {
    if (!this.characteristic) {
      await this.connectPrinter();
    }

    try {
      // Print header
      await this.printLine('\x1B\x61\x01'); // Center align
      await this.printLine('\x1B\x21\x30'); // Double size text
      await this.printLine('RESTAURANT NAME');
      await this.printLine('\x1B\x21\x00'); // Normal text
      await this.printLine('Your Address Line 1');
      await this.printLine('Your Address Line 2');
      await this.printLine('Tel: Your Phone Number');
      await this.printLine('------------------------');

      // Print order details
      await this.printLine(`Table: ${tableId}`);
      await this.printLine(`Date: ${new Date().toLocaleString()}`);
      await this.printLine('------------------------');
      await this.printLine('ITEMS:');

      // Print items
      for (const item of orders) {
        const itemTotal = item.price * item.quantity;
        await this.printLine(`${item.name} x${item.quantity}`);
        await this.printLine(`$${itemTotal.toFixed(2)}`);
      }

      // Print total
      await this.printLine('------------------------');
      await this.printLine(`TOTAL: $${total.toFixed(2)}`);
      await this.printLine('------------------------');
      await this.printLine('Thank you for dining with us!');
      await this.printLine('Please visit again');

      // Cut paper
      await this.sendCommand(new Uint8Array([0x1D, 0x56, 0x41, 0x10]));
    } catch (error) {
      console.error('Failed to print receipt:', error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    if (this.device?.gatt?.connected) {
      await this.device.gatt.disconnect();
    }
    this.device = null;
    this.characteristic = null;
  }
}

export const bluetoothPrinterService = new BluetoothPrinterService();