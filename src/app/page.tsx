'use client'

import { useRecoilValue } from 'recoil';
import { useRouter } from 'next/navigation';
import { tablesState } from '@/state/atoms/tableState';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const TableManagement = () => {
  const router = useRouter();
  const tables = useRecoilValue(tablesState);

  const handleTableClick = (tableId: number) => {
    router.push(`/tables/${tableId}`);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Tirumala Bar & Restaurant</h1>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        {tables.map((table) => (
          <Card 
            key={table.tableId}
            className={`cursor-pointer ${
              table.isOccupied ? 'bg-red-100' : 'bg-green-100'
            }`}
            onClick={() => handleTableClick(table.tableId)}
          >
            <CardHeader>
              <CardTitle>Table {table.tableId}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{table.isOccupied ? 'Occupied' : 'Available'}</p>
              {table.orders.length > 0 && (
                <p className="font-bold">
                  Total: ${table.orders.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TableManagement;