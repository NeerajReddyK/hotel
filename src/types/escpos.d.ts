// declare module 'escpos' {
//   export class Printer {
//     constructor(device: any, options?: any);
//     align(alignment: 'left' | 'center' | 'right'): this;
//     size(size: number): this;
//     text(content: string): this;
//     cut(): this;
//     close(): Promise<void>;
//   }
// }

// declare module 'escpos-usb' {
//   export class USB {
//     constructor(vendorId: string, productId: string);
//   }
//   export type Device = USB;
// }

// types/escpos.d.ts
declare module 'escpos' {
  export interface PrinterOptions {
    encoding?: string;
    width?: number;
  }

  export interface PrinterDevice {
    open(): Promise<void>;
    close(): Promise<void>;
  }

  export class Printer {
    constructor(device: PrinterDevice, options?: PrinterOptions);
    align(alignment: 'left' | 'center' | 'right'): this;
    size(size: number): this;
    text(content: string): this;
    cut(): this;
    close(): Promise<void>;
    openCashDrawer(): this;
    beep(): this;
    feed(n?: number): this;
    control(ctrl: string): this;
  }
}

declare module 'escpos-usb' {
  import { PrinterDevice } from 'escpos';

  export class USB implements PrinterDevice {
    constructor(vendorId: string, productId: string);
    open(): Promise<void>;
    close(): Promise<void>;
  }
  export type Device = USB;
}