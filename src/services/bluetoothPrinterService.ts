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

// export class BluetoothPrinterService {
//   private static instance: BluetoothPrinterService;
//   private device: BluetoothDevice | null = null;
//   private characteristic: BluetoothRemoteGATTCharacteristic | null = null;
//   private textEncoder = new TextEncoder();

//   public constructor() {
//     // Private constructor to enforce singleton pattern
//   }

//   public static getInstance(): BluetoothPrinterService {
//     if (!BluetoothPrinterService.instance) {
//       BluetoothPrinterService.instance = new BluetoothPrinterService();
//     }
//     return BluetoothPrinterService.instance;
//   }

//   // async connectPrinter(): Promise<void> {
//   //   try {
//   //     if (!navigator.bluetooth) {
//   //       throw new Error('Web Bluetooth is not supported by this browser');
//   //     }
//   //     // Request Bluetooth device with printer service
//   //     this.device = await navigator.bluetooth.requestDevice({
//   //       filters: [
//   //         { 
//   //           services: ['000018f0-0000-1000-8000-00805f9b34fb'], // Typical printer service UUID
//   //           namePrefix: 'EC-58' // Your printer name prefix
//   //         }
//   //       ]
//   //     });

//   //     if (!this.device) {
//   //       throw new Error('No printer selected');
//   //     }

//   //     console.log('Connecting to printer...');
//   //     const server = await this.device.gatt?.connect();
//   //     if (!server) {
//   //       throw new Error('Could not connect to printer');
//   //     }

//   //     // Get the printer service
//   //     const service = await server.getPrimaryService('000018f0-0000-1000-8000-00805f9b34fb');
//   //     // Get the characteristic for writing
//   //     this.characteristic = await service.getCharacteristic('00002af1-0000-1000-8000-00805f9b34fb');

//   //     console.log('Printer connected successfully');
//   //   } catch (error) {
//   //     console.error('Failed to connect:', error);
//   //     throw error;
//   //   }
//   // }
//     async connectPrinter(): Promise<void> {
//     try {
//       // Check if browser supports Web Bluetooth
//       if (!navigator.bluetooth) {
//         throw new Error('Web Bluetooth is not supported by this browser');
//       }

//       // Request device with broader filters and optional services
//       this.device = await navigator.bluetooth.requestDevice({
//         // Accept any device advertising these services
//         optionalServices: [
//           '000018f0-0000-1000-8000-00805f9b34fb',
//           '0000ff00-0000-1000-8000-00805f9b34fb', // Common printer service
//           '49535343-fe7d-4ae5-8fa9-9fafd205e455', // Common printer service
//         ],
//         // Accept any Bluetooth printer device
//         filters: [
//           { namePrefix: 'Printer' },
//           { namePrefix: 'POS' },
//           { namePrefix: 'BT' },
//           { namePrefix: 'Star' },
//           { namePrefix: 'EC-' },
//         ]
//       });

//       if (!this.device) {
//         throw new Error('No printer selected');
//       }

//       console.log('Connecting to printer...', this.device.gatt);
      
//       const server = await this.device.gatt?.connect();
//       if (!server) {
//         throw new Error('Could not connect to printer');
//       }

//       // Try different common printer service UUIDs
//       let service;
//       const serviceUUIDs = [
//         '000018f0-0000-1000-8000-00805f9b34fb',
//         '0000ff00-0000-1000-8000-00805f9b34fb',
//         '49535343-fe7d-4ae5-8fa9-9fafd205e455'
//       ];

//       for (const uuid of serviceUUIDs) {
//         try {
//           service = await server.getPrimaryService(uuid);
//           break;
//         } catch (e) {
//           console.log(`Service ${uuid} not found, trying next...`, e);
//         }
//       }

//       if (!service) {
//         throw new Error('No compatible printer service found');
//       }

//       // Try different characteristic UUIDs
//       const characteristicUUIDs = [
//         '00002af1-0000-1000-8000-00805f9b34fb',
//         '0000ff02-0000-1000-8000-00805f9b34fb',
//         '49535343-8841-43f4-a8d4-ecbe34729bb3'
//       ];

//       for (const uuid of characteristicUUIDs) {
//         try {
//           this.characteristic = await service.getCharacteristic(uuid);
//           break;
//         } catch (e) {
//           console.log(`Characteristic ${uuid} not found, trying next...`, e);
//         }
//       }

//       if (!this.characteristic) {
//         throw new Error('No compatible printer characteristic found');
//       }

//       console.log('Printer connected successfully');
//     } catch (error) {
//       console.error('Failed to connect:', error);
//       throw error;
//     }
//   }

//   private async sendCommand(command: Uint8Array): Promise<void> {
//     if (!this.characteristic) {
//       throw new Error('Printer not connected');
//     }
//     await this.characteristic.writeValue(command);
//   }


//   private async printLine(text: string): Promise<void> {
//     const data = this.textEncoder.encode(text + '\n');
//     await this.sendCommand(data);
//   }

//     async simulatePrint(tableId: number, orders: OrderItem[], total: number): Promise<void> {
//     console.log('Simulating print...');
//     console.log('Table:', tableId);
//     console.log('Orders:', orders);
//     console.log('Total:', total);
//     return new Promise(resolve => setTimeout(resolve, 1000));
//   }

//   async printReceipt(tableId: number, orders: OrderItem[], total: number): Promise<void> {
//         if (!navigator.bluetooth) {
//       console.warn('Bluetooth not available, using simulation');
//       return this.simulatePrint(tableId, orders, total);
//     }
//     if (!this.characteristic) {
//       await this.connectPrinter();
//     }

//     try {
//       // Print header
//       await this.printLine('\x1B\x61\x01'); // Center align
//       await this.printLine('\x1B\x21\x30'); // Double size text
//       await this.printLine('RESTAURANT NAME');
//       await this.printLine('\x1B\x21\x00'); // Normal text
//       await this.printLine('Your Address Line 1');
//       await this.printLine('Your Address Line 2');
//       await this.printLine('Tel: Your Phone Number');
//       await this.printLine('------------------------');

//       // Print order details
//       await this.printLine(`Table: ${tableId}`);
//       await this.printLine(`Date: ${new Date().toLocaleString()}`);
//       await this.printLine('------------------------');
//       await this.printLine('ITEMS:');

//       // Print items
//       for (const item of orders) {
//         const itemTotal = item.price * item.quantity;
//         await this.printLine(`${item.name} x${item.quantity}`);
//         await this.printLine(`$${itemTotal.toFixed(2)}`);
//       }

//       // Print total
//       await this.printLine('------------------------');
//       await this.printLine(`TOTAL: $${total.toFixed(2)}`);
//       await this.printLine('------------------------');
//       await this.printLine('Thank you for dining with us!');
//       await this.printLine('Please visit again');

//       // Cut paper
//       await this.sendCommand(new Uint8Array([0x1D, 0x56, 0x41, 0x10]));
//     } catch (error) {
//       console.error('Failed to print receipt:', error);
//       throw error;
//     }
//   }

//   async disconnect(): Promise<void> {
//     if (this.device?.gatt?.connected) {
//       await this.device.gatt.disconnect();
//     }
//     this.device = null;
//     this.characteristic = null;
//   }
// }

// export const bluetoothPrinterService = new BluetoothPrinterService();

// bluetoothPrinterService.ts

export class BluetoothPrinterService {
  private device: BluetoothDevice | null = null;
  private characteristic: BluetoothRemoteGATTCharacteristic | null = null;
  
  async connectPrinter(): Promise<void> {
    try {
      // Define the correct filter and options for Bluetooth connection
      const options: RequestDeviceOptions = {
        filters: [
          {
            services: ['000018f0-0000-1000-8000-00805f9b34fb'] // Replace with your printer's service UUID
          }
        ],
        // Use acceptAllDevices if you don't know the specific service UUID
        // acceptAllDevices: true,
      };

      // Request the device
      this.device = await navigator.bluetooth.requestDevice(options);
      
      if (!this.device.gatt) {
        throw new Error('Bluetooth GATT not found');
      }

      // Connect to the device
      const server = await this.device.gatt.connect();
      
      // Get the primary service
      const service = await server.getPrimaryService('000018f0-0000-1000-8000-00805f9b34fb');
      
      // Get the characteristic
      this.characteristic = await service.getCharacteristic('00002af1-0000-1000-8000-00805f9b34fb');
      
    } catch (error) {
      console.error('Error connecting to printer:', error);
      throw new Error('Failed to connect to printer');
    }
  }

  private async writeToCharacteristic(data: Uint8Array): Promise<void> {
    if (!this.characteristic) {
      throw new Error('Printer not connected');
    }

    try {
      await this.characteristic.writeValue(data);
    } catch (error) {
      console.error('Error writing to characteristic:', error);
      throw new Error('Failed to write to printer');
    }
  }

  private textEncoder = new TextEncoder();

  private async printLine(text: string): Promise<void> {
    const data = this.textEncoder.encode(text + '\n');
    await this.writeToCharacteristic(data);
  }

  async printReceipt(tableId: number, items: Array<{ name: string; quantity: number; price: number }>, total: number): Promise<void> {
    try {
      // Header
      await this.printLine('================================');
      await this.printLine('         RESTAURANT NAME        ');
      await this.printLine('================================');
      await this.printLine(`Table: ${tableId}`);
      await this.printLine(`Date: ${new Date().toLocaleString()}`);
      await this.printLine('--------------------------------');
      
      // Items
      await this.printLine('ITEM          QTY    PRICE');
      await this.printLine('--------------------------------');
      
      for (const item of items) {
        const itemTotal = (item.quantity * item.price).toFixed(2);
        await this.printLine(
          `${item.name.padEnd(12)} ${item.quantity.toString().padStart(3)} ${itemTotal.padStart(8)}`
        );
      }
      
      // Footer
      await this.printLine('--------------------------------');
      await this.printLine(`TOTAL: $${total.toFixed(2).padStart(20)}`);
      await this.printLine('================================');
      await this.printLine('      Thank You, Visit Again!   ');
      await this.printLine('\n\n\n'); // Feed paper
      
    } catch (error) {
      console.error('Error printing receipt:', error);
      throw new Error('Failed to print receipt');
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