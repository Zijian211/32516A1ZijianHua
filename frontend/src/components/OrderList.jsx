import React, { useState } from 'react';

const OrderList = ({ isOpen, onClose, orders }) => {
  // --- State To Track Which Order Is Currently Expanded ---
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  if (!isOpen) return null;

  // --- Toggle Function For The Dropdown ---
  const toggleOrderDetails = (orderId) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-2000 flex items-center justify-center p-4"
      role="dialog" 
      aria-modal="true" 
      aria-labelledby="order-history-title"
    >
      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-2xl w-full max-w-2xl relative max-h-[80vh] overflow-y-auto">
        <button 
          onClick={onClose} 
          aria-label="Close orders"
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 font-bold"
        >
          ✕
        </button>
        
        <h2 id="order-history-title" className="text-2xl font-black mb-6 text-gray-900 border-b pb-4">
          Order History
        </h2>

        {orders.length === 0 ? (
          <p className="text-gray-500 text-center py-8">You haven't placed any orders yet.</p>
        ) : (
          <div className="flex flex-col gap-4">
            {orders.map((order) => {
              const isExpanded = expandedOrderId === order._id;
              
              return (
                <div key={order._id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                      Order #{order._id.slice(-6)}
                    </span>
                    <span className="text-sm font-semibold text-green-600 bg-green-100 px-2 py-1 rounded-full">
                      {order.status}
                    </span>
                  </div>
                  
                  <div className="text-sm text-gray-700 mb-2">
                    <strong>Date:</strong> {new Date(order.created_at).toLocaleDateString()}
                  </div>

                  {/* --- Clickable Items Dropdown Trigger --- */}
                  <div 
                    className="text-sm text-blue-600 hover:text-blue-800 cursor-pointer flex items-center gap-1 mb-2 font-medium"
                    onClick={() => toggleOrderDetails(order._id)}
                  >
                    <strong>Items/Products:</strong> {order.items.reduce((sum, item) => sum + item.quantity, 0)} items, click to see the products details
                    <span className={`text-[10px] transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                      ▼
                    </span>
                  </div>

                  {/* --- Collapsible Detail Table --- */}
                  {isExpanded && (
                    <div className="mt-2 mb-4 bg-white border border-gray-100 rounded-md overflow-hidden">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-gray-100 text-gray-600 uppercase">
                          <tr>
                            <th className="px-3 py-2">Product</th>
                            <th className="px-3 py-2 text-center">Qty</th>
                            <th className="px-3 py-2 text-right">Price</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                          {order.items.map((item, index) => (
                            <tr key={index}>
                              <td className="px-3 py-2 text-gray-800 font-medium">{item.name}</td>
                              <td className="px-3 py-2 text-center text-gray-600">{item.quantity}</td>
                              <td className="px-3 py-2 text-right text-gray-800">
                                ${(item.price * item.quantity).toFixed(2)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  <div className="text-lg font-bold text-gray-900 mt-2 text-right border-t pt-2">
                    Total: ${order.total_price.toFixed(2)}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderList;