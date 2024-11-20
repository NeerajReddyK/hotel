// usbPrinterService.ts

export class USBPrinterService {
  private device: USBDevice | null = null;
  private endpointOut: number | null = null;
  private interfaceNumber: number | null = null;

  // Common ESC/POS commands
  private ESC = 0x1B;
  private LF = 0x0A;
  private Commands = {
    INIT: new Uint8Array([this.ESC, 0x40]), // Initialize printer
    CUT: new Uint8Array([this.ESC, 0x69]), // Cut paper
    NEW_LINE: new Uint8Array([this.LF]), // New line
  };

  async connectPrinter(): Promise<void> {
    try {
      // Request the USB device
      this.device = await navigator.usb.requestDevice({
        filters: [
          // Add your printer's vendor ID and product ID here
          // You can find these in your printer's documentation or using device manager
          { vendorId: 0x0456 } // Example vendor ID, replace with your printer's
        ]
      });

      // Open connection to the device
      await this.device.open();
      
      // Select configuration #1
      if (this.device.configuration === null) {
        await this.device.selectConfiguration(1);
      }

      // Get the interface for printing
      const interface_ = this.device.configurations[0].interfaces[0];
      this.interfaceNumber = interface_.interfaceNumber;

      // Claim the interface
      await this.device.claimInterface(this.interfaceNumber);

      // Find the output endpoint
      const endpoint = interface_.alternate.endpoints.find(
        (e) => e.direction === 'out'
      );

      if (!endpoint) {
        throw new Error('Endpoint not found');
      }

      this.endpointOut = endpoint.endpointNumber;
      
      // Initialize the printer
      await this.sendCommand(this.Commands.INIT);
      
      console.log('Printer connected successfully');
      return;
    } catch (error) {
      console.error('Error connecting to printer:', error);
      throw new Error('Failed to connect to printer');
    }
  }

  private async sendCommand(command: Uint8Array): Promise<void> {
    if (!this.device || this.endpointOut === null || this.interfaceNumber === null) {
      throw new Error('Printer not connected');
    }

    try {
      await this.device.transferOut(this.endpointOut, command);
    } catch (error) {
      console.error('Error sending command:', error);
      throw new Error('Failed to send command to printer');
    }
  }

  private textEncoder = new TextEncoder();

  private async printText(text: string): Promise<void> {
    const data = this.textEncoder.encode(text);
    await this.sendCommand(data);
    await this.sendCommand(this.Commands.NEW_LINE);
  }

  async printReceipt(tableId: number, items: Array<{ name: string; quantity: number; price: number }>, total: number): Promise<void> {
    if (!this.device) {
      throw new Error('Printer not connected');
    }

    try {
      // Header
      await this.printText('================================');
      await this.printText('         RESTAURANT NAME        ');
      await this.printText('================================');
      await this.printText(`Table: ${tableId}`);
      await this.printText(`Date: ${new Date().toLocaleString()}`);
      await this.printText('--------------------------------');
      
      // Items
      await this.printText('ITEM          QTY    PRICE');
      await this.printText('--------------------------------');
      
      for (const item of items) {
        const itemTotal = (item.quantity * item.price).toFixed(2);
        await this.printText(
          `${item.name.padEnd(12)} ${item.quantity.toString().padStart(3)} ${itemTotal.padStart(8)}`
        );
      }
      
      // Footer
      await this.printText('--------------------------------');
      await this.printText(`TOTAL: $${total.toFixed(2).padStart(20)}`);
      await this.printText('================================');
      await this.printText('      Thank You, Visit Again!   ');
      
      // Cut paper
      await this.sendCommand(this.Commands.CUT);
      
    } catch (error) {
      console.error('Error printing receipt:', error);
      throw new Error('Failed to print receipt');
    }
  }

  async disconnect(): Promise<void> {
    if (this.device) {
      try {
        if (this.interfaceNumber !== null) {
          await this.device.releaseInterface(this.interfaceNumber);
        }
        await this.device.close();
        this.device = null;
        this.endpointOut = null;
        this.interfaceNumber = null;
        console.log('Printer disconnected successfully');
      } catch (error) {
        console.error('Error disconnecting printer:', error);
        throw new Error('Failed to disconnect printer');
      }
    }
  }
}

export const usbPrinterService = new USBPrinterService();