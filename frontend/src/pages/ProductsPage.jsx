import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useCart } from '../context/CartContext';

function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');
  const [addedProducts, setAddedProducts] = useState({});
  const { incrementCart, updateCartCount } = useCart();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productsRes = await axios.get('http://localhost:5000/api/products');
        setProducts(productsRes.data);
        
        try {
          const cartRes = await axios.get('http://localhost:5000/api/cart');
          updateCartCount(cartRes.data.items?.length || 0);
        } catch (cartError) {
          console.log('Cart load error, setting count to 0');
          updateCartCount(0);
        }
        
        const storedProducts = JSON.parse(localStorage.getItem('addedProducts') || '{}');
        setAddedProducts(storedProducts);
      } catch (err) {
        setMsg('Failed to load products');
        console.error('Error loading products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [updateCartCount]);

  const addToCart = async (productId, productName) => {
    try {
      await axios.post('http://localhost:5000/api/cart', { productId, qty: 1 });
      
      const updatedProducts = { ...addedProducts, [productId]: true };
      localStorage.setItem('addedProducts', JSON.stringify(updatedProducts));
      setAddedProducts(updatedProducts);
      incrementCart();
      
      setMsg(`${productName} added to cart!`);
      setTimeout(() => setMsg(''), 2000);
      
    } catch (err) {
      setMsg('Error adding to cart');
      setTimeout(() => setMsg(''), 2000);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">Our Products</h1>
        <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto">
          Discover amazing products at unbeatable prices. Quality guaranteed with fast delivery.
        </p>
      </div>

      {msg && (
        <div className="fixed top-20 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in">
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>{msg}</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <div 
            key={product._id} 
            className="bg-white rounded-xl sm:rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 sm:hover:-translate-y-2 border border-gray-100 overflow-hidden group"
          >
            <div className="h-48 sm:h-56 bg-gray-100 overflow-hidden relative">
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMDAgMTUwSDE1MFYyMDBIMTAwVjE1MFpNMjUwIDE1MEgzMDBWMjAwSDI1MFYxNTBaIiBmaWxsPSIjOEU5MEEzIi8+CjxjaXJjbGUgY3g9IjIwMCIgY3k9IjI3NSIgcj0iNTAiIGZpbGw9IiM4RTkwQTMiLz4KPC9zdmc+';
                }}
              />
              <div className="absolute top-3 right-3">
                <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                  In Stock
                </span>
              </div>
            </div>
            
            {/* Product Info */}
            <div className="p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2 line-clamp-2 min-h-[3.5rem]">
                {product.name}
              </h3>
              
              {product.description && (
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {product.description}
                </p>
              )}
              
              <div className="flex items-center justify-between mb-4">
                <span className="text-xl sm:text-2xl font-bold text-blue-600">
                  ₹{product.price}
                </span>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  Free Shipping
                </span>
              </div>

              {addedProducts[product._id] ? (
                <button
                  disabled
                  className="w-full bg-green-500 text-white py-3 px-4 rounded-lg sm:rounded-xl font-semibold cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Added to Cart</span>
                </button>
              ) : (
                <button
                  onClick={() => addToCart(product._id, product.name)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg sm:rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 active:scale-95 flex items-center justify-center space-x-2 group/btn"
                >
                  <svg className="w-5 h-5 transition-transform group-hover/btn:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span>Add to Cart</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {products.length === 0 && !loading && (
        <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="text-6xl mb-4">📦</div>
          <h3 className="text-2xl font-semibold text-gray-700 mb-4">No Products Available</h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            We're currently updating our inventory. Please check back soon for amazing new products!
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Refresh Page
          </button>
        </div>
      )}

      {products.length > 0 && (
        <div className="text-center mt-12 pt-8 border-t border-gray-200">
          <p className="text-gray-600">
            Showing <span className="font-semibold text-blue-600">{products.length}</span> amazing products
          </p>
        </div>
      )}
    </div>
  );
}

export default ProductsPage;