import { Link } from "react-router-dom"
import { useCart } from "../context/CartContext"

const Header = () => {
  const { cartCount } = useCart()

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-gray-800 hover:text-blue-600 transition-colors">
          🛍️ E-Com Cart
        </Link>

        <nav className="flex items-center space-x-6">
          <Link 
            to="/" 
            className="text-gray-700 hover:text-blue-600 font-medium transition-colors relative group"
          >
            Products
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all group-hover:w-full"></span>
          </Link>
          <Link 
            to="/cart" 
            className="text-gray-700 hover:text-blue-600 font-medium transition-colors relative group"
          >
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5.5M7 13l2.5 5.5m0 0L17 21" />
              </svg>
              Cart
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold animate-bounce">
                  {cartCount}
                </span>
              )}
            </div>
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all group-hover:w-full"></span>
          </Link>
        </nav>
      </div>
    </header>
  )
}

export default Header