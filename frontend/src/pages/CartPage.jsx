import React, { useEffect, useState } from "react";
import axios from "axios";
import { useCart } from "../context/CartContext";

function CartPage() {
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [receipt, setReceipt] = useState(null);
  const [msg, setMsg] = useState("");
  const { updateCartCount, resetCart } = useCart();

  const getCart = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/cart");
      setCart(res.data);
      updateCartCount(res.data.items.length);
    } catch (err) {
      setMsg("Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCart();
  }, [updateCartCount]);

  const removeItem = async (id, productName) => {
    try {
      await axios.delete(`http://localhost:5000/api/cart/${id}`);

      const addedProducts = JSON.parse(
        localStorage.getItem("addedProducts") || "{}"
      );
      const cartItem = cart.items.find((item) => item._id === id);
      if (cartItem && cartItem.product) {
        delete addedProducts[cartItem.product._id];
        localStorage.setItem("addedProducts", JSON.stringify(addedProducts));
      }

      getCart();
      setMsg(`${productName} removed from cart`);
      setTimeout(() => setMsg(""), 2000);
    } catch (err) {
      setMsg("Error removing item");
      setTimeout(() => setMsg(""), 2000);
    }
  };

  const updateQty = async (id, qty, productName) => {
    if (qty < 1) {
      const cartItem = cart.items.find((item) => item._id === id);
      await removeItem(id, cartItem?.product?.name || "Item");
      return;
    }

    try {
      await axios.patch(`http://localhost:5000/api/cart/${id}`, { qty });
      getCart();
      setMsg(`${productName} quantity updated`);
      setTimeout(() => setMsg(""), 1500);
    } catch (err) {
      setMsg("Error updating quantity");
      setTimeout(() => setMsg(""), 2000);
    }
  };

  const handleCheckout = async () => {
    if (!name || !email || !address) {
      setMsg("Please fill in all fields");
      setTimeout(() => setMsg(""), 3000);
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/checkout", {
        cartItems: cart.items,
        name,
        email,
        address,
      });

      setReceipt(res.data.receipt);
      setMsg("🎉 Checkout successful! Thank you for your order.");
      resetCart();
      localStorage.removeItem("addedProducts");
      setName("");
      setEmail("");
      setAddress("");
      getCart();
    } catch (err) {
      setMsg("Checkout failed. Please try again.");
      setTimeout(() => setMsg(""), 3000);
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
      <div className="text-center mb-8 sm:mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-3 sm:mb-4">
          Shopping Cart
        </h1>
        <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto">
          Review your items and proceed to checkout
        </p>
      </div>

      {msg && (
        <div
          className={`fixed top-20 right-4 px-4 sm:px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in max-w-sm ${
            msg.includes("failed") || msg.includes("Error")
              ? "bg-red-500"
              : "bg-green-500"
          } text-white`}
        >
          <div className="flex items-center space-x-2">
            {msg.includes("failed") || msg.includes("Error") ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            )}
            <span className="text-sm sm:text-base">{msg}</span>
          </div>
        </div>
      )}

      {cart.items.length === 0 ? (
        <div className="text-center py-12 sm:py-16 bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 mx-2 sm:mx-0">
          <div className="text-5xl sm:text-6xl mb-4">🛒</div>
          <h3 className="text-xl sm:text-2xl font-semibold text-gray-700 mb-3 sm:mb-4">
            Your cart is empty
          </h3>
          <p className="text-gray-500 mb-6 sm:mb-8 text-sm sm:text-base max-w-md mx-auto px-4">
            Looks like you haven't added any items to your cart yet.
          </p>
          <a
            href="/"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 sm:px-8 py-3 rounded-lg sm:rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 inline-block"
          >
            Continue Shopping
          </a>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">
                Cart Items ({cart.items.length})
              </h2>
              
              <div className="space-y-4">
                {cart.items.map((item) => (
                  <div
                    key={item._id}
                    className="bg-gray-50 rounded-xl p-4 sm:p-6 border border-gray-200 hover:border-blue-200 transition-all duration-300 group"
                  >
                    <div className="flex flex-col sm:flex-row items-start gap-4">
                      <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white rounded-lg overflow-hidden flex-shrink-0 border border-gray-200">
                        <img 
                          src={item.product.image} 
                          alt={item.product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iOTYiIGhlaWdodD0iOTYiIHZpZXdCb3g9IjAgMCA5NiA5NiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9Ijk2IiBoZWlnaHQ9Ijk2IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yNCAzNkgzNlY2MEgyNFYzNlpNOCAzNkgxNlY2MEg4VjM2Wk02NCAzNkg3MlY2MEg2NFYzNloiIGZpbGw9IiM4RTkwQTMiLz4KPGNpcmNsZSBjeD0iNDgiIGN5PSI2NiIgcj0iMTIiIGZpbGw9IiM4RTkwQTMiLz4KPC9zdmc+';
                          }}
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-1 line-clamp-2">
                          {item.product.name}
                        </h3>
                        <p className="text-lg sm:text-xl font-bold text-blue-600 mb-2">
                          ₹{item.product.price}
                        </p>
                        <p className="text-gray-600 text-sm mb-3">
                          Subtotal: <span className="font-semibold">₹{item.product.price * item.qty}</span>
                        </p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="flex items-center space-x-2 bg-white rounded-lg p-1 border border-gray-300">
                              <button
                                onClick={() => updateQty(item._id, item.qty - 1, item.product.name)}
                                className="w-8 h-8 flex items-center justify-center bg-gray-50 hover:bg-gray-100 rounded-md transition-colors"
                              >
                                <span className="text-lg font-bold text-gray-700">-</span>
                              </button>
                              <span className="w-8 text-center font-semibold text-gray-800 text-sm sm:text-base">
                                {item.qty}
                              </span>
                              <button
                                onClick={() => updateQty(item._id, item.qty + 1, item.product.name)}
                                className="w-8 h-8 flex items-center justify-center bg-gray-50 hover:bg-gray-100 rounded-md transition-colors"
                              >
                                <span className="text-lg font-bold text-gray-700">+</span>
                              </button>
                            </div>
                          </div>

                          <button
                            onClick={() => removeItem(item._id, item.product.name)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors group/remove"
                            title="Remove item"
                          >
                            <svg
                              className="w-5 h-5 group-hover/remove:scale-110 transition-transform"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 sticky top-24">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Order Summary
              </h3>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Items ({cart.items.length})</span>
                  <span className="font-semibold">₹{cart.total}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="text-green-600 font-semibold">FREE</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax (18%)</span>
                  <span>₹{(cart.total * 0.18).toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between text-lg font-bold text-gray-800">
                    <span>Total Amount</span>
                    <span className="text-blue-600">₹{(cart.total * 1.18).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-gray-700 text-lg">
                  Customer Information
                </h4>

                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Full Name *"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg sm:rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />

                  <input
                    type="email"
                    placeholder="Email Address *"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg sm:rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />

                  <textarea
                    placeholder="Delivery Address *"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg sm:rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                  />
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-4 px-6 rounded-lg sm:rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
                >
                  <div className="flex items-center justify-center space-x-2">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-base">Complete Checkout</span>
                  </div>
                </button>

                <p className="text-xs text-gray-500 text-center">
                  * Required fields must be filled
                </p>
              </div>
            </div>

            {receipt && (
              <div className="bg-green-50 border border-green-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 animate-fade-in">
                <div className="flex items-center space-x-2 mb-3">
                  <div className="text-2xl">🎉</div>
                  <h4 className="text-lg sm:text-xl font-semibold text-green-800">
                    Order Confirmed!
                  </h4>
                </div>
                <div className="space-y-2 text-green-700 text-sm sm:text-base">
                  <div className="flex justify-between">
                    <span className="font-semibold">Total:</span>
                    <span>₹{receipt.total}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold">Order Time:</span>
                    <span>{receipt.time}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold">Email:</span>
                    <span className="truncate ml-2">{email}</span>
                  </div>
                </div>
                <p className="text-green-600 text-xs sm:text-sm mt-4 pt-3 border-t border-green-200">
                  A confirmation email has been sent to your inbox with order details.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default CartPage;