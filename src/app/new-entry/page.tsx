// app/new-entry/page.tsx
'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { mockProducts } from '@/lib/mockData';

interface FormData {
  type: 'INCOMING' | 'OUTGOING';
  productId: string;
  quantity: string;
  note: string;
}

interface FormErrors {
  productId?: string;
  quantity?: string;
}

export default function NewEntry() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    type: 'INCOMING',
    productId: '',
    quantity: '',
    note: ''
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.productId) {
      newErrors.productId = 'Please select a product';
    }

    if (!formData.quantity) {
      newErrors.quantity = 'Please enter quantity';
    } else if (parseInt(formData.quantity) <= 0) {
      newErrors.quantity = 'Quantity must be greater than 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      // For now, just log the data and redirect
      console.log('Form submitted:', formData);
      setIsSubmitting(false);
      router.push('/inventory');
    }, 1000);
  };

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">New Entry</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Transaction Type */}
        {/* <div className="bg-white rounded-lg p-4 shadow-sm">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Transaction Type
          </label>
          <div className="grid grid-cols-2 gap-4">
            {['INCOMING', 'OUTGOING'].map((type) => (
              <button
                key={type}
                type="button"
                className={`p-4 rounded-lg border text-center ${
                  formData.type === type
                    ? 'border-blue-500 bg-blue-50 text-blue-600'
                    : 'border-gray-200 text-gray-600'
                }`}
                onClick={() => setFormData({ ...formData, type: type as 'INCOMING' | 'OUTGOING' })}
              >
                <div className="flex flex-col items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-6 w-6 ${formData.type === type ? 'text-blue-600' : 'text-gray-400'}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d={type === 'INCOMING' 
                        ? "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"  // Up arrow for incoming
                        : "M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"  // Down arrow for outgoing
                      }
                    />
                  </svg>
                  <span className="mt-2 text-sm">
                    {type === 'INCOMING' ? 'Incoming' : 'Outgoing'}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
 */}
        {/* Product Selection */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Product
          </label>
          <select
            className={`w-full p-3 border rounded-lg ${
              errors.productId ? 'border-red-500' : 'border-gray-200'
            }`}
            value={formData.productId}
            onChange={(e) => {
              setFormData({ ...formData, productId: e.target.value });
              setErrors({ ...errors, productId: undefined });
            }}
          >
            <option value="">Choose a product</option>
            {mockProducts.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name} - {product.brand} (single)
              </option>
            ))}
          </select>
          {errors.productId && (
            <p className="mt-1 text-sm text-red-500">{errors.productId}</p>
          )}
        </div>

        {/* Quantity Input */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Quantity
          </label>
          <div className="flex items-center">
            <button
              type="button"
              className="p-2 border border-gray-200 rounded-l-lg"
              onClick={() => {
                const currentQty = parseInt(formData.quantity) || 0;
                if (currentQty > 1) {
                  setFormData({ ...formData, quantity: (currentQty - 1).toString() });
                  setErrors({ ...errors, quantity: undefined });
                }
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </button>
            <input
              type="number"
              className={`w-full p-3 text-center border-y ${
                errors.quantity ? 'border-red-500' : 'border-gray-200'
              }`}
              value={formData.quantity}
              onChange={(e) => {
                setFormData({ ...formData, quantity: e.target.value });
                setErrors({ ...errors, quantity: undefined });
              }}
              min="1"
            />
            <button
              type="button"
              className="p-2 border border-gray-200 rounded-r-lg"
              onClick={() => {
                const currentQty = parseInt(formData.quantity) || 0;
                setFormData({ ...formData, quantity: (currentQty + 1).toString() });
                setErrors({ ...errors, quantity: undefined });
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
          {errors.quantity && (
            <p className="mt-1 text-sm text-red-500">{errors.quantity}</p>
          )}
        </div>

        {/* Note Input */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Note (Optional)
          </label>
          <textarea
            className="w-full p-3 border border-gray-200 rounded-lg min-h-[100px]"
            placeholder="Add any additional notes here..."
            value={formData.note}
            onChange={(e) => setFormData({ ...formData, note: e.target.value })}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full p-4 rounded-lg text-white font-medium ${
            isSubmitting
              ? 'bg-blue-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </div>
          ) : (
            'Submit Entry'
          )}
        </button>
      </form>
    </div>
  );
}