// 'use client'

// import { useEffect, useState } from 'react';
// import { useParams, useRouter } from 'next/navigation';
// import { useRecoilState } from 'recoil';
// import { tablesState, selectedTableState, MENU_ITEMS, type MenuItem, type OrderItem } from '@/state/atoms/tableState';
// import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
// import { PlusCircle, MinusCircle, Receipt, ArrowLeft } from 'lucide-react';
// import { Printer } from 'lucide-react';

// interface Token {
//   tokenNumber: number;
//   tableId: number;
//   timestamp: string;
//   items: OrderItem[];
// }

// const TableDetailPage = () => {
//   const router = useRouter();
//   const params = useParams();
//   const id = params.id as string; 
//   const [tables, setTables] = useRecoilState(tablesState);
//   const [selectedTable, setSelectedTable] = useRecoilState(selectedTableState);
//   const [showBill, setShowBill] = useState(false);

//     const [generatedTokens, setGeneratedTokens] = useState<Token[]>([]);
//   const [lastTokenNumber, setLastTokenNumber] = useState(0);
//   const [tokenToSend, setTokenToSend] = useState<Token | null>(null);

//   useEffect(() => {
//     if (id) {
//       const tableId = parseInt(id);
//       const table = tables.find(t => t.tableId === tableId);
//       if (table) {
//         setSelectedTable(table);
//       }
//     }
//   }, [id, tables, setSelectedTable]);

//   const handleAddItem = (menuItem: MenuItem) => {
//     if (!selectedTable) return;

//     setTables(prevTables =>
//       prevTables.map(table => {
//         if (table.tableId === selectedTable.tableId) {
//           const existingOrderIndex = table.orders.findIndex(
//             order => order.id === menuItem.id
//           );

//           if (existingOrderIndex >= 0) {
//             const updatedOrders = [...table.orders];
//             updatedOrders[existingOrderIndex] = {
//               ...updatedOrders[existingOrderIndex],
//               quantity: updatedOrders[existingOrderIndex].quantity + 1,
//             };
//             return { ...table, orders: updatedOrders, isOccupied: true };
//           }

//           return {
//             ...table,
//             orders: [...table.orders, { ...menuItem, quantity: 1 }],
//             isOccupied: true,
//           };
//         }
//         return table;
//       })
//     );

//     // Update selected table state
//     setSelectedTable(prev => {
//       if (!prev) return prev;
//       const existingOrderIndex = prev.orders.findIndex(
//         order => order.id === menuItem.id
//       );

//       if (existingOrderIndex >= 0) {
//         const updatedOrders = [...prev.orders];
//         updatedOrders[existingOrderIndex] = {
//           ...updatedOrders[existingOrderIndex],
//           quantity: updatedOrders[existingOrderIndex].quantity + 1,
//         };
//         return { ...prev, orders: updatedOrders, isOccupied: true };
//       }

//       return {
//         ...prev,
//         orders: [...prev.orders, { ...menuItem, quantity: 1 }],
//         isOccupied: true,
//       };
//     });
//   };



//   const handleRemoveItem = (menuItem: MenuItem) => {
//     if (!selectedTable) return;

//     setTables(prevTables =>
//       prevTables.map(table => {
//         if (table.tableId === selectedTable.tableId) {
//           const updatedOrders = table.orders
//             .map(order => {
//               if (order.id === menuItem.id) {
//                 return { ...order, quantity: order.quantity - 1 };
//               }
//               return order;
//             })
//             .filter(order => order.quantity > 0);

//           return {
//             ...table,
//             orders: updatedOrders,
//             isOccupied: updatedOrders.length > 0,
//           };
//         }
//         return table;
//       })
//     );
//   }

//   const calculateTotal = (orders: OrderItem[]): number => {
//     return orders.reduce((total, item) => total + item.price * item.quantity, 0);
//   };

//   const handleGenerateBill = () => {
//     setShowBill(true);
//   };

//   const handlePayment = () => {
//     if (!selectedTable) return;

//     setTables(prevTables =>
//       prevTables.map(table =>
//         table.tableId === selectedTable.tableId
//           ? { ...table, orders: [], isOccupied: false }
//           : table
//       )
//     );
//     setSelectedTable(null);
//     setShowBill(false);
//     router.push('/');
//   };

// const handleGenerateToken = () => {
//   if (!selectedTable || selectedTable.orders.length === 0) return;

//   // Get all current orders, including duplicates
//   const currentOrders = selectedTable.orders;

//   // Find orders that haven't been fully tokenized
//   const unsentItems = currentOrders.filter(order => {
//     // Find how many of this item have been sent in previous tokens
//     const tokenedQuantity = generatedTokens.reduce((total, token) => {
//       const itemInToken = token.items.find(tokenItem => tokenItem.id === order.id);
//       return total + (itemInToken ? itemInToken.quantity : 0);
//     }, 0);

//     // If current order quantity is greater than tokenized quantity, it needs a token
//     return order.quantity > tokenedQuantity;
//   }).map(order => ({
//     ...order,
//     quantity: order.quantity - generatedTokens.reduce((total, token) => {
//       const itemInToken = token.items.find(tokenItem => tokenItem.id === order.id);
//       return total + (itemInToken ? itemInToken.quantity : 0);
//     }, 0)
//   })).filter(item => item.quantity > 0);

//   if (unsentItems.length === 0) return;

//   // Generate new token
//   const newTokenNumber = lastTokenNumber + 1;
//   const newToken: Token = {
//     tokenNumber: newTokenNumber,
//     tableId: selectedTable.tableId,
//     timestamp: new Date().toLocaleString(),
//     items: unsentItems
//   };

//   // Update tokens
//   setGeneratedTokens(prev => [...prev, newToken]);
//   setLastTokenNumber(newTokenNumber);
  
//   // Simulate sending token to kitchen
//   setTokenToSend(newToken);

//   // Optional: Show a confirmation
//   alert(`Token ${newTokenNumber} generated for Table ${selectedTable.tableId}`);
// };

//   const handleCloseTokenDialog = () => {
//     setTokenToSend(null);
//   };

//   if (!selectedTable) {
//     return <div>Loading...</div>;
//   }

//   const categories = [...new Set(MENU_ITEMS.map(item => item.category))];

//   return (
//     <div className="p-6">
//       <div className="flex items-center gap-4 mb-6">
//         <Button variant="outline" onClick={() => router.push('/')}>
//           <ArrowLeft className="h-4 w-4 mr-2" />
//           Back to Tables
//         </Button>
//         <h1 className="text-2xl font-bold">Table {selectedTable.tableId}</h1>
//       </div>

//       <div className="grid grid-cols-1 gap-6">
//         {/* Current Orders */}
//         <Card>
//           <CardHeader>
//             <CardTitle>Current Orders</CardTitle>
//           </CardHeader>
//           <CardContent>
//             {selectedTable.orders.length === 0 ? (
//               <p className="text-gray-500">No orders yet</p>
//             ) : (
//               <div className="space-y-4">
//                 {selectedTable.orders.map((item) => (
//                   <div key={item.id} className="flex justify-between items-center p-2 border-b">
//                     <div>
//                       <p className="font-medium">{item.name}</p>
//                       <p className="text-sm text-gray-500">${item.price} x {item.quantity}</p>
//                     </div>
//                     <div className="flex items-center gap-2">
//                       <Button
//                         size="sm"
//                         variant="outline"
//                         onClick={() => handleRemoveItem(item)}
//                       >
//                         <MinusCircle className="h-4 w-4" />
//                       </Button>
//                       <span className="w-8 text-center">{item.quantity}</span>
//                       <Button
//                         size="sm"
//                         variant="outline"
//                         onClick={() => handleAddItem(item)}
//                       >
//                         <PlusCircle className="h-4 w-4" />
//                       </Button>
//                     </div>
//                   </div>
//                 ))}
//                 <div className="pt-4 border-t">
//                   <div className="flex justify-between font-bold">
//                     <span>Total</span>
//                     <span>${calculateTotal(selectedTable.orders).toFixed(2)}</span>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </CardContent>
//           <CardFooter className='flex flex-col space-y-3'>
//             <Button 
//               className="w-full"
//               onClick={handleGenerateToken}
//               disabled={selectedTable.orders.length === 0}
//             >
//               <Printer className="mr-2 h-4 w-4" />
//               Generate Token
//             </Button>
 
//             <Button 
//               className="w-full"
//               onClick={handleGenerateBill}
//               disabled={selectedTable.orders.length === 0}
//             >
//               <Receipt className="mr-2 h-4 w-4" />
//               Generate Bill
//             </Button>
//          </CardFooter>
//         </Card>

//         {/* Add New Items */}
//         <Card>
//           <CardHeader>
//             <CardTitle>Add Items</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="space-y-6">
//               {categories.map((category) => (
//                 <div key={category}>
//                   <h3 className="font-medium mb-2">{category}</h3>
//                   <div className="space-y-2">
//                     {MENU_ITEMS.filter(item => item.category === category).map((item) => (
//                       <div key={item.id} className="flex justify-between items-center p-2 border rounded">
//                         <div>
//                           <p>{item.name}</p>
//                           <p className="text-sm text-gray-500">${item.price}</p>
//                         </div>
//                         <Button
//                           size="sm"
//                           onClick={() => handleAddItem(item)}
//                         >
//                           <PlusCircle className="h-4 w-4 mr-2" />
//                           Add
//                         </Button>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       <AlertDialog open={showBill} onOpenChange={setShowBill}>
//         <AlertDialogContent>
//           <AlertDialogHeader>
//             <AlertDialogTitle>Bill for Table {selectedTable.tableId}</AlertDialogTitle>
//             <AlertDialogDescription>
//               {selectedTable.orders.map((item) => (
//                 <div key={item.id} className="flex justify-between py-1">
//                   <span>
//                     {item.name} x{item.quantity}
//                   </span>
//                   <span>${(item.price * item.quantity).toFixed(2)}</span>
//                 </div>
//               ))}
//               <div className="border-t mt-2 pt-2">
//                 <div className="flex justify-between font-bold">
//                   <span>Total</span>
//                   <span>
//                     ${calculateTotal(selectedTable.orders).toFixed(2)}
//                   </span>
//                 </div>
//               </div>
//             </AlertDialogDescription>
//           </AlertDialogHeader>
//           <AlertDialogFooter>
//             <AlertDialogCancel>Cancel</AlertDialogCancel>
//             <AlertDialogAction onClick={handlePayment}>Process Payment</AlertDialogAction>
//           </AlertDialogFooter>
//         </AlertDialogContent>
//       </AlertDialog>
//             <AlertDialog open={!!tokenToSend} onOpenChange={handleCloseTokenDialog}>
//         <AlertDialogContent>
//           <AlertDialogHeader>
//             <AlertDialogTitle>Kitchen Token</AlertDialogTitle>
//             <AlertDialogDescription>
//               <div>
//                 <p>Token Number: {tokenToSend?.tokenNumber}</p>
//                 <p>Table: {tokenToSend?.tableId}</p>
//                 <p>Timestamp: {tokenToSend?.timestamp}</p>
//                 <div className="mt-4">
//                   <strong>Items:</strong>
//                   {tokenToSend?.items.map(item => (
//                     <div key={item.id} className="flex justify-between">
//                       <span>{item.name}</span>
//                       <span>x{item.quantity}</span>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </AlertDialogDescription>
//           </AlertDialogHeader>
//           <AlertDialogFooter>
//             <AlertDialogAction onClick={handleCloseTokenDialog}>Close</AlertDialogAction>
//           </AlertDialogFooter>
//         </AlertDialogContent>
//       </AlertDialog>
//     </div>
//   );
// };

// export default TableDetailPage;

// 'use client'

// import { useEffect, useState } from 'react';
// import { useParams, useRouter } from 'next/navigation';
// import { useRecoilState } from 'recoil';
// import { tablesState, selectedTableState, MENU_ITEMS, type MenuItem, type OrderItem } from '@/state/atoms/tableState';
// import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
// import { PlusCircle, MinusCircle, Receipt, ArrowLeft, Printer } from 'lucide-react';
// import { bluetoothPrinterService, BluetoothPrinterService } from '@/services/bluetoothPrinterService';

// interface Token {
//   tokenNumber: number;
//   tableId: number;
//   timestamp: string;
//   items: OrderItem[];
// }

// const TableDetailPage = () => {
//   const router = useRouter();
//   const params = useParams();
//   const id = params.id as string;
//   const [tables, setTables] = useRecoilState(tablesState);
//   const [selectedTable, setSelectedTable] = useRecoilState(selectedTableState);
//   const [showBill, setShowBill] = useState(false);
//   const [printerConnected, setPrinterConnected] = useState(false);
//   const [isConnecting, setIsConnecting] = useState(false);
//   const [connectionError, setConnectionError] = useState<string | null>(null);

//   const [generatedTokens, setGeneratedTokens] = useState<Token[]>([]);
//   const [lastTokenNumber, setLastTokenNumber] = useState(0);
//   const [tokenToSend, setTokenToSend] = useState<Token | null>(null);

//   // Initialize printer service
//   const printerService = new BluetoothPrinterService();

//   useEffect(() => {
//     if (id) {
//       const tableId = parseInt(id);
//       const table = tables.find(t => t.tableId === tableId);
//       if (table) {
//         setSelectedTable(table);
//       }
//     }
//   }, [id, tables, setSelectedTable]);

//   const handleConnectPrinter = async () => {
//     try {
//       setIsConnecting(true);
//       setConnectionError(null);
//       await printerService.connectPrinter();
//       setPrinterConnected(true);
//       alert('Printer connected successfully!');
//     } catch (error) {
//       console.error('Failed to connect printer:', error);
//       alert('Failed to connect printer. Please try again.');
//     } finally {
//       setIsConnecting(false);
//     }
//   };

//   const renderConnectionStatus = () => {
//     if (isConnecting) {
//       return <p className="text-yellow-500">Connecting to printer...</p>;
//     }
//     if (connectionError) {
//       return <p className="text-red-500">{connectionError}</p>;
//     }
//     if (printerConnected) {
//       return <p className="text-green-500">Printer connected</p>;
//     }
//     return null;
//   };

//   const handleAddItem = (menuItem: MenuItem) => {
//     if (!selectedTable) return;

//     setTables(prevTables =>
//       prevTables.map(table => {
//         if (table.tableId === selectedTable.tableId) {
//           const existingOrderIndex = table.orders.findIndex(
//             order => order.id === menuItem.id
//           );

//           if (existingOrderIndex >= 0) {
//             const updatedOrders = [...table.orders];
//             updatedOrders[existingOrderIndex] = {
//               ...updatedOrders[existingOrderIndex],
//               quantity: updatedOrders[existingOrderIndex].quantity + 1,
//             };
//             return { ...table, orders: updatedOrders, isOccupied: true };
//           }

//           return {
//             ...table,
//             orders: [...table.orders, { ...menuItem, quantity: 1 }],
//             isOccupied: true,
//           };
//         }
//         return table;
//       })
//     );

//     setSelectedTable(prev => {
//       if (!prev) return prev;
//       const existingOrderIndex = prev.orders.findIndex(
//         order => order.id === menuItem.id
//       );

//       if (existingOrderIndex >= 0) {
//         const updatedOrders = [...prev.orders];
//         updatedOrders[existingOrderIndex] = {
//           ...updatedOrders[existingOrderIndex],
//           quantity: updatedOrders[existingOrderIndex].quantity + 1,
//         };
//         return { ...prev, orders: updatedOrders, isOccupied: true };
//       }

//       return {
//         ...prev,
//         orders: [...prev.orders, { ...menuItem, quantity: 1 }],
//         isOccupied: true,
//       };
//     });
//   };

//   const handleRemoveItem = (menuItem: MenuItem) => {
//     if (!selectedTable) return;

//     setTables(prevTables =>
//       prevTables.map(table => {
//         if (table.tableId === selectedTable.tableId) {
//           const updatedOrders = table.orders
//             .map(order => {
//               if (order.id === menuItem.id) {
//                 return { ...order, quantity: order.quantity - 1 };
//               }
//               return order;
//             })
//             .filter(order => order.quantity > 0);

//           return {
//             ...table,
//             orders: updatedOrders,
//             isOccupied: updatedOrders.length > 0,
//           };
//         }
//         return table;
//       })
//     );
//   };

//   const calculateTotal = (orders: OrderItem[]): number => {
//     return orders.reduce((total, item) => total + item.price * item.quantity, 0);
//   };

//   const handleGenerateBill = () => {
//     setShowBill(true);
//   };

//   const handlePayment = async () => {
//     if (!selectedTable) return;

//     try {
//       if (!printerConnected) {
//         await handleConnectPrinter();
//       }

//       // Print receipt
//       await printerService.printReceipt(
//         selectedTable.tableId,
//         selectedTable.orders,
//         calculateTotal(selectedTable.orders)
//       );

//       // Update table state
//       setTables(prevTables =>
//         prevTables.map(table =>
//           table.tableId === selectedTable.tableId
//             ? { ...table, orders: [], isOccupied: false }
//             : table
//         )
//       );
//       setSelectedTable(null);
//       setShowBill(false);
//       router.push('/');
//     } catch (error) {
//       console.error('Failed to print receipt:', error);
//       alert('Failed to print receipt. Please check printer connection and try again.');
//     }
//   };

//   // const handleGenerateToken = async () => {
//   //   if (!selectedTable || selectedTable.orders.length === 0) return;

//   //   const unsentItems = selectedTable.orders.filter(order => {
//   //     const tokenedQuantity = generatedTokens.reduce((total, token) => {
//   //       const itemInToken = token.items.find(tokenItem => tokenItem.id === order.id);
//   //       return total + (itemInToken ? itemInToken.quantity : 0);
//   //     }, 0);
//   //     return order.quantity > tokenedQuantity;
//   //   }).map(order => ({
//   //     ...order,
//   //     quantity: order.quantity - generatedTokens.reduce((total, token) => {
//   //       const itemInToken = token.items.find(tokenItem => tokenItem.id === order.id);
//   //       return total + (itemInToken ? itemInToken.quantity : 0);
//   //     }, 0)
//   //   })).filter(item => item.quantity > 0);

//   //   if (unsentItems.length === 0) return;

//   //   try {
//   //     if (!printerConnected) {
//   //       await handleConnectPrinter();
//   //     }

//   //     const newTokenNumber = lastTokenNumber + 1;
//   //     const newToken: Token = {
//   //       tokenNumber: newTokenNumber,
//   //       tableId: selectedTable.tableId,
//   //       timestamp: new Date().toLocaleString(),
//   //       items: unsentItems
//   //     };

//   //     // Print token
//   //     await printerService.printReceipt(
//   //       selectedTable.tableId,
//   //       unsentItems,
//   //       calculateTotal(unsentItems)
//   //     );

//   //     setGeneratedTokens(prev => [...prev, newToken]);
//   //     setLastTokenNumber(newTokenNumber);
//   //     setTokenToSend(newToken);

//   //   } catch (error) {
//   //     console.error('Failed to print token:', error);
//   //     alert('Failed to print token. Please check printer connection and try again.');
//   //   }
//   // };

//   // In your TableDetailPage component

// const handleGenerateToken = async () => {
//   if (!selectedTable || selectedTable.orders.length === 0) return;

//   const unsentItems = selectedTable.orders.filter(order => {
//     const tokenedQuantity = generatedTokens.reduce((total, token) => {
//       const itemInToken = token.items.find(tokenItem => tokenItem.id === order.id);
//       return total + (itemInToken ? itemInToken.quantity : 0);
//     }, 0);
//     return order.quantity > tokenedQuantity;
//   }).map(order => ({
//     ...order,
//     quantity: order.quantity - generatedTokens.reduce((total, token) => {
//       const itemInToken = token.items.find(tokenItem => tokenItem.id === order.id);
//       return total + (itemInToken ? itemInToken.quantity : 0);
//     }, 0)
//   })).filter(item => item.quantity > 0);

//   if (unsentItems.length === 0) return;

//   try {
//     setIsConnecting(true);

//     if (!printerConnected) {
//       try {
//         await handleConnectPrinter();
//       } catch (error) {
//         console.error('Printer connection failed:', error);
//         // Continue with token generation even if printer fails
//         const shouldContinue = window.confirm('Printer connection failed. Continue without printing?');
//         if (!shouldContinue) {
//           return;
//         }
//       }
//     }

//     const newTokenNumber = lastTokenNumber + 1;
//     const newToken: Token = {
//       tokenNumber: newTokenNumber,
//       tableId: selectedTable.tableId,
//       timestamp: new Date().toLocaleString(),
//       items: unsentItems
//     };

//     try {
//       // Attempt to print
//       await bluetoothPrinterService.printReceipt(
//         selectedTable.tableId,
//         unsentItems,
//         calculateTotal(unsentItems)
//       );
//     } catch (printError) {
//       console.error('Print failed:', printError);
//       // Continue with token generation even if printing fails
//       alert('Printing failed, but token will still be generated');
//     }

//     // Update state regardless of print success
//     setGeneratedTokens(prev => [...prev, newToken]);
//     setLastTokenNumber(newTokenNumber);
//     setTokenToSend(newToken);

//   } catch (error) {
//     console.error('Token generation failed:', error);
//     alert('Failed to generate token. Please try again.');
//   } finally {
//     setIsConnecting(false);
//   }
// };
//   const handleCloseTokenDialog = () => {
//     setTokenToSend(null);
//   };

//   if (!selectedTable) {
//     return <div>Loading...</div>;
//   }

//   const categories = [...new Set(MENU_ITEMS.map(item => item.category))];

//   return (
//     <div className="p-6">
//       <div className='mb-4'>
//         {renderConnectionStatus()}
//       </div>
//       <div className="flex items-center gap-4 mb-6">
//         <Button variant="outline" onClick={() => router.push('/')}>
//           <ArrowLeft className="h-4 w-4 mr-2" />
//           Back to Tables
//         </Button>
//         <h1 className="text-2xl font-bold">Table {selectedTable.tableId}</h1>
//       </div>

//       <div className="grid grid-cols-1 gap-6">
//         {/* Current Orders */}
//         <Card>
//           <CardHeader>
//             <CardTitle>Current Orders</CardTitle>
//           </CardHeader>
//           <CardContent>
//             {selectedTable.orders.length === 0 ? (
//               <p className="text-gray-500">No orders yet</p>
//             ) : (
//               <div className="space-y-4">
//                 {selectedTable.orders.map((item) => (
//                   <div key={item.id} className="flex justify-between items-center p-2 border-b">
//                     <div>
//                       <p className="font-medium">{item.name}</p>
//                       <p className="text-sm text-gray-500">${item.price} x {item.quantity}</p>
//                     </div>
//                     <div className="flex items-center gap-2">
//                       <Button
//                         size="sm"
//                         variant="outline"
//                         onClick={() => handleRemoveItem(item)}
//                       >
//                         <MinusCircle className="h-4 w-4" />
//                       </Button>
//                       <span className="w-8 text-center">{item.quantity}</span>
//                       <Button
//                         size="sm"
//                         variant="outline"
//                         onClick={() => handleAddItem(item)}
//                       >
//                         <PlusCircle className="h-4 w-4" />
//                       </Button>
//                     </div>
//                   </div>
//                 ))}
//                 <div className="pt-4 border-t">
//                   <div className="flex justify-between font-bold">
//                     <span>Total</span>
//                     <span>${calculateTotal(selectedTable.orders).toFixed(2)}</span>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </CardContent>
//           <CardFooter className="flex flex-col space-y-3">
//             <Button
//               className="w-full"
//               onClick={handleGenerateToken}
//               disabled={selectedTable.orders.length === 0}
//             >
//               <Printer className="mr-2 h-4 w-4" />
//               Generate Token
//             </Button>

//             <Button
//               className="w-full"
//               onClick={handleGenerateBill}
//               disabled={selectedTable.orders.length === 0}
//             >
//               <Receipt className="mr-2 h-4 w-4" />
//               Generate Bill
//             </Button>
//           </CardFooter>
//         </Card>

//         {/* Add New Items */}
//         <Card>
//           <CardHeader>
//             <CardTitle>Add Items</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="space-y-6">
//               {categories.map((category) => (
//                 <div key={category}>
//                   <h3 className="font-medium mb-2">{category}</h3>
//                   <div className="space-y-2">
//                     {MENU_ITEMS.filter(item => item.category === category).map((item) => (
//                       <div key={item.id} className="flex justify-between items-center p-2 border rounded">
//                         <div>
//                           <p>{item.name}</p>
//                           <p className="text-sm text-gray-500">${item.price}</p>
//                         </div>
//                         <Button
//                           size="sm"
//                           onClick={() => handleAddItem(item)}
//                         >
//                           <PlusCircle className="h-4 w-4 mr-2" />
//                           Add
//                         </Button>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       <AlertDialog open={showBill} onOpenChange={setShowBill}>
//         <AlertDialogContent>
//           <AlertDialogHeader>
//             <AlertDialogTitle>Bill for Table {selectedTable.tableId}</AlertDialogTitle>
//             <AlertDialogDescription>
//               {selectedTable.orders.map((item) => (
//                 <div key={item.id} className="flex justify-between py-1">
//                   <span>
//                     {item.name} x{item.quantity}
//                   </span>
//                   <span>${(item.price * item.quantity).toFixed(2)}</span>
//                 </div>
//               ))}
//               <div className="border-t mt-2 pt-2">
//                 <div className="flex justify-between font-bold">
//                   <span>Total</span>
//                   <span>
//                     ${calculateTotal(selectedTable.orders).toFixed(2)}
//                   </span>
//                 </div>
//               </div>
//             </AlertDialogDescription>
//           </AlertDialogHeader>
//           <AlertDialogFooter>
//             <AlertDialogCancel>Cancel</AlertDialogCancel>
//             <AlertDialogAction onClick={handlePayment}>Process Payment</AlertDialogAction>
//           </AlertDialogFooter>
//         </AlertDialogContent>
//       </AlertDialog>

//       <AlertDialog open={!!tokenToSend} onOpenChange={handleCloseTokenDialog}>
//         <AlertDialogContent>
//           <AlertDialogHeader>
//             <AlertDialogTitle>Kitchen Token</AlertDialogTitle>
//             <AlertDialogDescription>
//               <div>
//                 <p>Token Number: {tokenToSend?.tokenNumber}</p>
//                 <p>Table: {tokenToSend?.tableId}</p>
//                 <p>Timestamp: {tokenToSend?.timestamp}</p>
//                 <div className="mt-4">
//                   <strong>Items:</strong>
//                   {tokenToSend?.items.map(item => (
//                     <div key={item.id} className="flex justify-between">
//                       <span>{item.name}</span>
//                       <span>x{item.quantity}</span>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </AlertDialogDescription>
//           </AlertDialogHeader>
//           <AlertDialogFooter>
//             <AlertDialogAction onClick={handleCloseTokenDialog}>Close</AlertDialogAction>
//           </AlertDialogFooter>
//         </AlertDialogContent>
//       </AlertDialog>
//     </div>
//   );
// };

// export default TableDetailPage;

'use client'

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useRecoilState } from 'recoil';
import { tablesState, selectedTableState, MENU_ITEMS, type MenuItem, type OrderItem } from '@/state/atoms/tableState';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { PlusCircle, MinusCircle, Receipt, ArrowLeft, Printer } from 'lucide-react';
import { usbPrinterService } from '@/services/usbPrinterService';

interface Token {
  tokenNumber: number;
  tableId: number;
  timestamp: string;
  items: OrderItem[];
}

const TableDetailPage = () => {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [tables, setTables] = useRecoilState(tablesState);
  const [selectedTable, setSelectedTable] = useRecoilState(selectedTableState);
  const [showBill, setShowBill] = useState(false);
  const [printerConnected, setPrinterConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  const [generatedTokens, setGeneratedTokens] = useState<Token[]>([]);
  const [lastTokenNumber, setLastTokenNumber] = useState(0);
  const [tokenToSend, setTokenToSend] = useState<Token | null>(null);

  useEffect(() => {
    if (id) {
      const tableId = parseInt(id);
      const table = tables.find(t => t.tableId === tableId);
      if (table) {
        setSelectedTable(table);
      }
    }
  }, [id, tables, setSelectedTable]);

  const handleConnectPrinter = async () => {
    try {
      setIsConnecting(true);
      setConnectionError(null);
      await usbPrinterService.connectPrinter();
      setPrinterConnected(true);
      alert('USB Printer connected successfully!');
    } catch (error) {
      console.error('Failed to connect USB printer:', error);
      setConnectionError('Failed to connect to USB printer');
      alert('Failed to connect USB printer. Please ensure the printer is connected and try again.');
    } finally {
      setIsConnecting(false);
    }
  };

  const renderConnectionStatus = () => {
    if (isConnecting) {
      return <p className="text-yellow-500">Connecting to USB printer...</p>;
    }
    if (connectionError) {
      return <p className="text-red-500">{connectionError}</p>;
    }
    if (printerConnected) {
      return <p className="text-green-500">USB Printer connected</p>;
    }
    return null;
  };

  const handleAddItem = (menuItem: MenuItem) => {
    if (!selectedTable) return;

    setTables(prevTables =>
      prevTables.map(table => {
        if (table.tableId === selectedTable.tableId) {
          const existingOrderIndex = table.orders.findIndex(
            order => order.id === menuItem.id
          );

          if (existingOrderIndex >= 0) {
            const updatedOrders = [...table.orders];
            updatedOrders[existingOrderIndex] = {
              ...updatedOrders[existingOrderIndex],
              quantity: updatedOrders[existingOrderIndex].quantity + 1,
            };
            return { ...table, orders: updatedOrders, isOccupied: true };
          }

          return {
            ...table,
            orders: [...table.orders, { ...menuItem, quantity: 1 }],
            isOccupied: true,
          };
        }
        return table;
      })
    );

    setSelectedTable(prev => {
      if (!prev) return prev;
      const existingOrderIndex = prev.orders.findIndex(
        order => order.id === menuItem.id
      );

      if (existingOrderIndex >= 0) {
        const updatedOrders = [...prev.orders];
        updatedOrders[existingOrderIndex] = {
          ...updatedOrders[existingOrderIndex],
          quantity: updatedOrders[existingOrderIndex].quantity + 1,
        };
        return { ...prev, orders: updatedOrders, isOccupied: true };
      }

      return {
        ...prev,
        orders: [...prev.orders, { ...menuItem, quantity: 1 }],
        isOccupied: true,
      };
    });
  };

  const handleRemoveItem = (menuItem: MenuItem) => {
    if (!selectedTable) return;

    setTables(prevTables =>
      prevTables.map(table => {
        if (table.tableId === selectedTable.tableId) {
          const updatedOrders = table.orders
            .map(order => {
              if (order.id === menuItem.id) {
                return { ...order, quantity: order.quantity - 1 };
              }
              return order;
            })
            .filter(order => order.quantity > 0);

          return {
            ...table,
            orders: updatedOrders,
            isOccupied: updatedOrders.length > 0,
          };
        }
        return table;
      })
    );
  };

  const calculateTotal = (orders: OrderItem[]): number => {
    return orders.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handleGenerateBill = () => {
    setShowBill(true);
  };

  const handlePayment = async () => {
    if (!selectedTable) return;

    try {
      if (!printerConnected) {
        await handleConnectPrinter();
      }

      // Print receipt
      await usbPrinterService.printReceipt(
        selectedTable.tableId,
        selectedTable.orders,
        calculateTotal(selectedTable.orders)
      );

      // Update table state
      setTables(prevTables =>
        prevTables.map(table =>
          table.tableId === selectedTable.tableId
            ? { ...table, orders: [], isOccupied: false }
            : table
        )
      );
      setSelectedTable(null);
      setShowBill(false);
      router.push('/');
    } catch (error) {
      console.error('Failed to print receipt:', error);
      alert('Failed to print receipt. Please check USB printer connection and try again.');
    }
  };

  const handleGenerateToken = async () => {
    if (!selectedTable || selectedTable.orders.length === 0) return;

    const unsentItems = selectedTable.orders.filter(order => {
      const tokenedQuantity = generatedTokens.reduce((total, token) => {
        const itemInToken = token.items.find(tokenItem => tokenItem.id === order.id);
        return total + (itemInToken ? itemInToken.quantity : 0);
      }, 0);
      return order.quantity > tokenedQuantity;
    }).map(order => ({
      ...order,
      quantity: order.quantity - generatedTokens.reduce((total, token) => {
        const itemInToken = token.items.find(tokenItem => tokenItem.id === order.id);
        return total + (itemInToken ? itemInToken.quantity : 0);
      }, 0)
    })).filter(item => item.quantity > 0);

    if (unsentItems.length === 0) return;

    try {
      setIsConnecting(true);

      if (!printerConnected) {
        try {
          await handleConnectPrinter();
        } catch (error) {
          console.error('USB Printer connection failed:', error);
          const shouldContinue = window.confirm('USB Printer connection failed. Continue without printing?');
          if (!shouldContinue) {
            return;
          }
        }
      }

      const newTokenNumber = lastTokenNumber + 1;
      const newToken: Token = {
        tokenNumber: newTokenNumber,
        tableId: selectedTable.tableId,
        timestamp: new Date().toLocaleString(),
        items: unsentItems
      };

      try {
        // Attempt to print
        await usbPrinterService.printReceipt(
          selectedTable.tableId,
          unsentItems,
          calculateTotal(unsentItems)
        );
      } catch (printError) {
        console.error('Print failed:', printError);
        alert('Printing failed, but token will still be generated');
      }

      // Update state regardless of print success
      setGeneratedTokens(prev => [...prev, newToken]);
      setLastTokenNumber(newTokenNumber);
      setTokenToSend(newToken);

    } catch (error) {
      console.error('Token generation failed:', error);
      alert('Failed to generate token. Please try again.');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleCloseTokenDialog = () => {
    setTokenToSend(null);
  };

  if (!selectedTable) {
    return <div>Loading...</div>;
  }

  const categories = [...new Set(MENU_ITEMS.map(item => item.category))];

  return (
    <div className="p-6">
      <div className='mb-4'>
        {renderConnectionStatus()}
      </div>
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" onClick={() => router.push('/')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Tables
        </Button>
        <h1 className="text-2xl font-bold">Table {selectedTable.tableId}</h1>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Current Orders */}
        <Card>
          <CardHeader>
            <CardTitle>Current Orders</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedTable.orders.length === 0 ? (
              <p className="text-gray-500">No orders yet</p>
            ) : (
              <div className="space-y-4">
                {selectedTable.orders.map((item) => (
                  <div key={item.id} className="flex justify-between items-center p-2 border-b">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-500">${item.price} x {item.quantity}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleRemoveItem(item)}
                      >
                        <MinusCircle className="h-4 w-4" />
                      </Button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleAddItem(item)}
                      >
                        <PlusCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                <div className="pt-4 border-t">
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>${calculateTotal(selectedTable.orders).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col space-y-3">
            <Button
              className="w-full"
              onClick={handleGenerateToken}
              disabled={selectedTable.orders.length === 0}
            >
              <Printer className="mr-2 h-4 w-4" />
              Generate Token
            </Button>

            <Button
              className="w-full"
              onClick={handleGenerateBill}
              disabled={selectedTable.orders.length === 0}
            >
              <Receipt className="mr-2 h-4 w-4" />
              Generate Bill
            </Button>
          </CardFooter>
        </Card>

        {/* Add New Items */}
        <Card>
          <CardHeader>
            <CardTitle>Add Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {categories.map((category) => (
                <div key={category}>
                  <h3 className="font-medium mb-2">{category}</h3>
                  <div className="space-y-2">
                    {MENU_ITEMS.filter(item => item.category === category).map((item) => (
                      <div key={item.id} className="flex justify-between items-center p-2 border rounded">
                        <div>
                          <p>{item.name}</p>
                          <p className="text-sm text-gray-500">${item.price}</p>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => handleAddItem(item)}
                        >
                          <PlusCircle className="h-4 w-4 mr-2" />
                          Add
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <AlertDialog open={showBill} onOpenChange={setShowBill}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bill for Table {selectedTable.tableId}</AlertDialogTitle>
            <AlertDialogDescription>
              {selectedTable.orders.map((item) => (
                <div key={item.id} className="flex justify-between py-1">
                  <span>
                    {item.name} x{item.quantity}
                  </span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="border-t mt-2 pt-2">
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>
                    ${calculateTotal(selectedTable.orders).toFixed(2)}
                  </span>
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handlePayment}>Process Payment</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!tokenToSend} onOpenChange={handleCloseTokenDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Kitchen Token</AlertDialogTitle>
            <AlertDialogDescription>
              <div>
                <p>Token Number: {tokenToSend?.tokenNumber}</p>
                <p>Table: {tokenToSend?.tableId}</p>
                <p>Timestamp: {tokenToSend?.timestamp}</p>
                <div className="mt-4">
                  <strong>Items:</strong>
                  {tokenToSend?.items.map(item => (
                    <div key={item.id} className="flex justify-between">
                      <span>{item.name}</span>
                      <span>x{item.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={handleCloseTokenDialog}>Close</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default TableDetailPage;
