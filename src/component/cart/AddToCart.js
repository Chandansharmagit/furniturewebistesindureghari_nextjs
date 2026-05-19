import React from 'react';
import { useCart } from '../../context/CartContext';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './AddToCart.css';

const AddToCart = () => {
  const { items, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const formatPrice = (price) => {
    return `₹${(price || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  if (items.length === 0) {
    return (
      <div className="cart-container">
        <div className="cart-header">
          <button className="back-btn" onClick={() => navigate(-1)}>
            <ArrowLeft size={20} />
            Back
          </button>
          <h1 className="cart-title">
            <ShoppingBag size={28} />
            Shopping Cart
          </h1>
        </div>
        
        <div className="empty-cart">
          <div className="empty-cart-icon">
            <ShoppingBag size={80} />
          </div>
          <h2>Your cart is empty</h2>
          <p>Add some furniture to get started!</p>
          <button className="continue-shopping-btn" onClick={() => navigate('/products')}>
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <div className="cart-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
          Back
        </button>
        <h1 className="cart-title">
          <ShoppingBag size={28} />
          Shopping Cart ({items.length} {items.length === 1 ? 'item' : 'items'})
        </h1>
        <button className="clear-cart-btn" onClick={clearCart}>
          <Trash2 size={18} />
          Clear Cart
        </button>
      </div>

      <div className="cart-content">
        <div className="cart-items">
          {items.map((item) => (
            <div key={item.id} className="cart-item">
              <div className="item-image">
                <img src={item.image} alt={item.title} />
              </div>
              
              <div className="item-details">
                <h3 className="item-name">{item.title}</h3>
                <p className="item-description">{item.description}</p>
                <div className="item-specs">
                  {item.color && <span className="spec">Color: {item.color}</span>}
                  {item.material && <span className="spec">Material: {item.material}</span>}
                  {item.dimensions && <span className="spec">Size: {item.dimensions}</span>}
                </div>
              </div>

              <div className="item-price">
                <div className="price-display">
                  {item.originalPrice && item.originalPrice > item.price && (
                    <span className="original-price">{formatPrice(item.originalPrice)}</span>
                  )}
                  <span className="current-price">{formatPrice(item.price)}</span>
                  {item.originalPrice && item.originalPrice > item.price && (
                    <span className="discount">
                      {Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}% OFF
                    </span>
                  )}
                </div>
              </div>

              <div className="item-quantity">
                <button 
                  className="quantity-btn"
                  onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                >
                  <Minus size={16} />
                </button>
                <span className="quantity-display">{item.quantity}</span>
                <button 
                  className="quantity-btn"
                  onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                >
                  <Plus size={16} />
                </button>
              </div>

              <div className="item-total">
                <span className="total-price">{formatPrice(item.price * item.quantity)}</span>
              </div>

              <button 
                className="remove-btn"
                onClick={() => removeFromCart(item.id)}
                title="Remove item"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <div className="summary-card">
            <h3>Order Summary</h3>
            
            <div className="summary-row">
              <span>Subtotal ({items.reduce((count, item) => count + item.quantity, 0)} items)</span>
              <span>{formatPrice(getCartTotal())}</span>
            </div>
            
            <div className="summary-row">
              <span>Shipping</span>
              <span className="free-shipping">FREE</span>
            </div>
            

            
            <div className="summary-divider"></div>
            
            <div className="summary-row total-row">
              <span>Total</span>
              <span>{formatPrice(getCartTotal())}</span>
            </div>
            
            <div className="checkout-actions">
              <button className="checkout-btn" onClick={() => navigate('/checkout')}>
                Proceed to Checkout
              </button>
              {/* <button className="continue-shopping-btn" onClick={() => navigate('/products')}>
                Continue Shopping
              </button> */}
            </div>
            
            <div className="security-info">
              <p>🔒 Secure checkout with 256-bit SSL encryption</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddToCart;