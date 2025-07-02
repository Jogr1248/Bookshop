import React from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../contexts/CartContext'
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react'

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart()

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <ShoppingBag size={64} className="mx-auto text-gray-400 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-8">
              Looks like you haven't added any books to your cart yet.
            </p>
            <Link to="/books" className="btn-primary">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          <button
            onClick={clearCart}
            className="text-red-600 hover:text-red-700 font-medium"
          >
            Clear Cart
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Cart Items */}
          <div className="divide-y divide-gray-200">
            {cartItems.map((item) => (
              <div key={item._id} className="p-6 flex items-center space-x-6">
                {/* Book Image */}
                <div className="flex-shrink-0">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-20 h-28 object-cover rounded-lg"
                  />
                </div>

                {/* Book Details */}
                <div className="flex-1 min-w-0">
                  <Link
                    to={`/books/${item._id}`}
                    className="text-lg font-medium text-gray-900 hover:text-primary-400 transition-colors"
                  >
                    {item.title}
                  </Link>
                  <p className="text-gray-600 mt-1">by {item.author}</p>
                  <p className="text-lg font-semibold text-primary-400 mt-2">
                    ${item.price}
                  </p>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => updateQuantity(item._id, item.quantity - 1)}
                    className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                    disabled={item.quantity <= 1}
                  >
                    <Minus size={16} className={item.quantity <= 1 ? 'text-gray-300' : 'text-gray-600'} />
                  </button>
                  
                  <span className="w-12 text-center font-medium">
                    {item.quantity}
                  </span>
                  
                  <button
                    onClick={() => updateQuantity(item._id, item.quantity + 1)}
                    className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <Plus size={16} className="text-gray-600" />
                  </button>
                </div>

                {/* Item Total */}
                <div className="text-right">
                  <p className="text-lg font-semibold text-gray-900">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => removeFromCart(item._id)}
                  className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div>

          {/* Cart Summary */}
          <div className="bg-gray-50 p-6">
            <div className="flex items-center justify-between text-xl font-bold text-gray-900 mb-6">
              <span>Total: ${getCartTotal().toFixed(2)}</span>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/books"
                className="flex-1 btn-secondary text-center"
              >
                Continue Shopping
              </Link>
              <Link
                to="/checkout"
                className="flex-1 btn-primary text-center"
              >
                Proceed to Checkout
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart