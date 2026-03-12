// --- CartDrawer Is Used to Handle the Sliding UI With SPA  ---
const CartDrawer = ({ isOpen, onClose, cartItems, onUpdateQuantity, onRemoveItem, onCheckout }) => {
  return (
    <>
      {/* --- 1. THE OVERLAY: This Dims The Background, Floating Over The Whole Screen. --- */}
      <div 
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-999 transition-opacity duration-300 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
        }`}
        onClick={onClose}
      ></div>

      {/* --- 2. THE DRAWER: This is the white panel on the right. --- */}
      <div 
        className={`fixed top-0 right-0 h-full w-full sm:w-100 bg-white shadow-2xl z-1000 transform transition-transform duration-500 ease-in-out flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* --- Drawer Header --- */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white">
          <h2 className="text-xl font-bold text-gray-900">Your Cart</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-400">✕</button>
        </div>

        {/* --- Scrollable Items Area --- */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {cartItems.length === 0 ? (
            <p className="text-center text-gray-400 mt-10">Your cart is empty</p>
          ) : (
            cartItems.map((item) => (
              <div key={item._id} className="flex gap-4 items-center border-b pb-4">
                <img src={item.image} alt={item.name} className="w-16 h-16 object-contain" />
                <div className="flex-1">
                  <p className="font-bold text-sm">{item.name}</p>
                  <div className="flex justify-between items-center mt-2">
                    <div className="flex items-center border rounded">
                      <button onClick={() => onUpdateQuantity(item.product_id, item.quantity - 1)} className="px-2">-</button>
                      <span className="px-3 text-xs font-bold">{item.quantity}</span>
                      <button onClick={() => onUpdateQuantity(item.product_id, item.quantity + 1)} className="px-2">+</button>
                    </div>
                    <button onClick={() => onRemoveItem(item.product_id)} className="text-red-500 text-xs">Remove</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* --- Checkout Section --- */}
        <div className="p-6 border-t bg-gray-50">
          <div className="flex justify-between mb-4">
            <span className="font-medium text-gray-600">Subtotal</span>
            <span className="font-bold text-xl">${cartItems.reduce((sum, i) => sum + (i.price * i.quantity), 0).toFixed(2)}</span>
          </div>
          <button onClick={onCheckout} className="w-full bg-orange-600 text-white py-3 rounded-lg font-bold hover:bg-orange-700 transition">
            Checkout
          </button>
        </div>
      </div>
    </>
  );
};

export default CartDrawer;