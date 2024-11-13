// app/page.tsx
'use client'

import { useEffect, useState } from 'react';
import { mockProducts, mockTransactions } from '@/lib/mockData';

export default function Dashboard() {
  const [stats, setStats] = useState({
    lowStock: 0,
    totalProducts: 0,
    incomingToday: 0,
    outgoingToday: 0
  });

  useEffect(() => {
    // Calculate stats from mock data
    const lowStock = mockProducts.filter(p => p.currentStock <= p.minStockLevel).length;
    const today = new Date().toISOString().split('T')[0];
    const todayTransactions = mockTransactions.filter(t => 
      t.date.startsWith(today)
    );

    setStats({
      lowStock,
      totalProducts: mockProducts.length,
      incomingToday: todayTransactions.filter(t => t.type === 'INCOMING').length,
      outgoingToday: todayTransactions.filter(t => t.type === 'OUTGOING').length
    });
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Low Stock Items</p>
              <p className="text-2xl font-bold">{stats.lowStock}</p>
            </div>
            <div className="p-2 bg-red-100 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Products</p>
              <p className="text-2xl font-bold">{stats.totalProducts}</p>
            </div>
            <div className="p-2 bg-blue-100 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Incoming Today</p>
              <p className="text-2xl font-bold">{stats.incomingToday}</p>
            </div>
            <div className="p-2 bg-green-100 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Outgoing Today</p>
              <p className="text-2xl font-bold">{stats.outgoingToday}</p>
            </div>
            <div className="p-2 bg-orange-100 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-3">Recent Transactions</h2>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {mockTransactions.map((transaction) => (
            <div key={transaction.id} className="p-4 border-b last:border-b-0">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">{transaction.productName}</h3>
                  <p className="text-sm text-gray-500">
                    {new Date(transaction.date).toLocaleDateString()}
                  </p>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm ${
                  transaction.type === 'INCOMING' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-orange-100 text-orange-800'
                }`}>
                  {transaction.type === 'INCOMING' ? '+' : '-'}{transaction.quantity}
                </div>
              </div>
              {transaction.note && (
                <p className="text-sm text-gray-500 mt-1">{transaction.note}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}