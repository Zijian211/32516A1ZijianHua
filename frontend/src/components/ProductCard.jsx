// --- Visual Hierarchy & Feedback Loops ---
const ProductCard = ({ product, onAddToCart }) => {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group">
      
      {/* Product Image Box */}
      <div className="h-48 w-full p-4 bg-gray-50 flex items-center justify-center overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name}
          className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-500"
          title={product.name + (product.price ? ` - $${product.price}` : '') + (product.description ? ` - ${product.description}` : '')} // --- Tooltip for Detailed Products Information ---
        />
      </div>

      {/* Product Details */}
      <div className="p-5 grow flex flex-col justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-900 line-clamp-2 leading-tight">
            {product.name}
          </h2>
        </div>

        <div className="mt-4">
          <p className="text-2xl font-black text-orange-600">${product.price}</p>
          
          <button 
            onClick={() => onAddToCart(product)}
            className="mt-4 w-full bg-black text-white py-2.5 rounded-lg font-bold 
                       hover:bg-orange-600 active:scale-95 transition-all shadow-md"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;