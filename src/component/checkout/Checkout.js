import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import orderService from '../../services/orderService';
import authService from '../../services/authService';
import useActivityTracking from '../../hooks/useActivityTracking';
import { ShoppingBag, ArrowLeft, CreditCard, Truck, User } from 'lucide-react';
import './Checkout.css';

export default function Checkout() {
  const navigate = useNavigate();
  const { items: cartItems, getCartTotal, clearCart } = useCart();
  const { trackPurchase } = useActivityTracking();
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const [formData, setFormData] = useState({
    // Personal Information
    firstName: '',
    lastName: '',
    email: '',
    phone: '',

    // Shipping Address
    address: '',
    city: '',
    state: '',
    pincode: '',
    country: 'Nepal',

    // Payment Information
    paymentMethod: 'cod',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: ''
  });

  // Autofill user details
  useEffect(() => {
    const loadUserData = async () => {
      try {
        if (authService.isAuthenticated()) {
          const result = await authService.getProfile();
          if (result.success && result.data) {
            const user = result.data;
            setFormData(prev => ({
              ...prev,
              firstName: user.first_name || '',
              lastName: user.last_name || '',
              email: user.email || '',
              phone: user.phone || '',
              address: user.address || ''
            }));
          }
        }
      } catch (error) {
        console.error('Failed to load user data for checkout', error);
      }
    };

    loadUserData();
  }, []);

  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Personal Information
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    else if (!/^[0-9]{10}$/.test(formData.phone)) newErrors.phone = 'Phone number must be 10 digits';

    // Shipping Address
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.pincode.trim()) newErrors.pincode = 'Pincode is required';
    else if (!/^[0-9]{6}$/.test(formData.pincode)) newErrors.pincode = 'Pincode must be 6 digits';

    // Payment Information (only for card payments)
    if (formData.paymentMethod === 'card') {
      if (!formData.cardNumber.trim()) newErrors.cardNumber = 'Card number is required';
      else if (!/^[0-9]{16}$/.test(formData.cardNumber.replace(/\s/g, ''))) newErrors.cardNumber = 'Card number must be 16 digits';
      if (!formData.expiryDate.trim()) newErrors.expiryDate = 'Expiry date is required';
      if (!formData.cvv.trim()) newErrors.cvv = 'CVV is required';
      else if (!/^[0-9]{3,4}$/.test(formData.cvv)) newErrors.cvv = 'CVV must be 3-4 digits';
      if (!formData.cardName.trim()) newErrors.cardName = 'Cardholder name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Check if user is authenticated
    if (!authService.isAuthenticated()) {
      alert('Please log in to place an order.');
      navigate('/login');
      return;
    }

    // Validate cart items
    if (!cartItems || cartItems.length === 0) {
      alert('Your cart is empty. Please add items before placing an order.');
      return;
    }

    // Check if all cart items have valid IDs
    const invalidItems = cartItems.filter(item => !item.id && !item.product_id);
    if (invalidItems.length > 0) {
      alert('Some items in your cart are invalid. Please refresh the page and try again.');
      return;
    }

    setIsProcessing(true);

    try {
      // Prepare order data
      const orderData = {
        customer_info: {
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          phone: formData.phone
        },
        shipping_address: {
          address: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          country: 'Nepal'
        },
        payment_method: formData.paymentMethod,
        items: cartItems.map(item => ({
          product_id: item.id || item.product_id,
          quantity: item.quantity || 1,
          price: item.price || 0
        })).filter(item => item.product_id), // Filter out items without valid product_id
        total_amount: getCartTotal(),
        notes: formData.notes || ''
      };

      // Create order using orderService
      const result = await orderService.createOrder(orderData);

      if (result.success) {
        // Track purchase activity
        const products = cartItems.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price
        }));
        trackPurchase(result.orderId || result.order_id, products, getCartTotal());

        // Clear cart and show success
        clearCart();
        setOrderPlaced(true);

        // Redirect to success page after 3 seconds
        setTimeout(() => {
          navigate('/');
        }, 3000);
      } else {
        throw new Error(result.error || 'Failed to place order');
      }

    } catch (error) {
      console.error('Order placement failed:', error);

      let errorMessage = 'Failed to place order. Please try again.';

      if (error.message.includes('401') || error.message.includes('Unauthorized')) {
        errorMessage = 'Please log in to place an order.';
        navigate('/login');
      } else if (error.message.includes('400') || error.message.includes('Bad Request')) {
        errorMessage = 'Invalid order data. Please check your cart items and try again.';
      } else if (error.message.includes('500') || error.message.includes('Internal Server Error')) {
        errorMessage = 'Server error. Please try again later.';
      } else if (error.message) {
        errorMessage = `Failed to place order: ${error.message}`;
      }

      alert(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const formatPrice = (price) => {
    return (price || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  if (cartItems.length === 0 && !orderPlaced) {
    return (
      <div className="checkout-container">
        <div className="empty-checkout">
          <h2>Your cart is empty</h2>
          <p>Add some items to your cart before checkout</p>
          <button onClick={() => navigate('/')} className="continue-shopping-btn">
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <div className="checkout-container">
        <div className="order-success">
          <div className="success-icon">✓</div>
          <h2>Order Placed Successfully!</h2>
          <p>Thank you for your purchase. You will receive a confirmation email shortly.</p>
          <p>Redirecting to home page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <div className="checkout-header">
        <div>
          <span className="checkout-eyebrow">Secure Order</span>
          <h1>
            <ShoppingBag size={28} style={{ marginRight: '12px', verticalAlign: 'middle', color: 'var(--primary-brown)' }} />
            Checkout
          </h1>
        </div>
        <button onClick={() => navigate('/cart')} className="back-to-cart-btn">
          <ArrowLeft size={18} />
          Back to Cart
        </button>
      </div>

      <div className="checkout-content">
        <div className="checkout-form">
          <div className="checkout-progress-strip">
            <span>Customer</span>
            <span>Delivery</span>
            <span>Payment</span>
          </div>
          <form onSubmit={handleSubmit}>
            {/* Personal Information */}
            <div className="form-section">
              <h3><User size={20} style={{ marginRight: '10px' }} /> Personal Information</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>First Name *</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className={errors.firstName ? 'error' : ''}
                  />
                  {errors.firstName && <span className="error-message">{errors.firstName}</span>}
                </div>
                <div className="form-group">
                  <label>Last Name *</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className={errors.lastName ? 'error' : ''}
                  />
                  {errors.lastName && <span className="error-message">{errors.lastName}</span>}
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={errors.email ? 'error' : ''}
                  />
                  {errors.email && <span className="error-message">{errors.email}</span>}
                </div>
                <div className="form-group">
                  <label>Phone *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={errors.phone ? 'error' : ''}
                  />
                  {errors.phone && <span className="error-message">{errors.phone}</span>}
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="form-section">
              <h3><Truck size={20} style={{ marginRight: '10px' }} /> Shipping Address</h3>
              <div className="form-group">
                <label>Address *</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className={errors.address ? 'error' : ''}
                  rows="3"
                />
                {errors.address && <span className="error-message">{errors.address}</span>}
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>City *</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className={errors.city ? 'error' : ''}
                  />
                  {errors.city && <span className="error-message">{errors.city}</span>}
                </div>
                <div className="form-group">
                  <label>State *</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className={errors.state ? 'error' : ''}
                  />
                  {errors.state && <span className="error-message">{errors.state}</span>}
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Pincode *</label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleInputChange}
                    className={errors.pincode ? 'error' : ''}
                  />
                  {errors.pincode && <span className="error-message">{errors.pincode}</span>}
                </div>
                <div className="form-group">
                  <label>Country</label>
                  <select name="country" value={formData.country} onChange={handleInputChange}>
                    <option value="Nepal">Nepal</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="form-section">
              <h3><CreditCard size={20} style={{ marginRight: '10px' }} /> Payment Method</h3>
              <div className="payment-methods">
                <label className="payment-option">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={formData.paymentMethod === 'cod'}
                    onChange={handleInputChange}
                  />
                  <span>Cash on Delivery</span>
                </label>
                <label className="payment-option">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={formData.paymentMethod === 'card'}
                    onChange={handleInputChange}
                  />
                  <span>Credit/Debit Card</span>
                </label>
              </div>

              {formData.paymentMethod === 'card' && (
                <div className="card-details">
                  <div className="form-group">
                    <label>Card Number *</label>
                    <input
                      type="text"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      className={errors.cardNumber ? 'error' : ''}
                      placeholder="1234 5678 9012 3456"
                    />
                    {errors.cardNumber && <span className="error-message">{errors.cardNumber}</span>}
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Expiry Date *</label>
                      <input
                        type="text"
                        name="expiryDate"
                        value={formData.expiryDate}
                        onChange={handleInputChange}
                        className={errors.expiryDate ? 'error' : ''}
                        placeholder="MM/YY"
                      />
                      {errors.expiryDate && <span className="error-message">{errors.expiryDate}</span>}
                    </div>
                    <div className="form-group">
                      <label>CVV *</label>
                      <input
                        type="text"
                        name="cvv"
                        value={formData.cvv}
                        onChange={handleInputChange}
                        className={errors.cvv ? 'error' : ''}
                        placeholder="123"
                      />
                      {errors.cvv && <span className="error-message">{errors.cvv}</span>}
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Cardholder Name *</label>
                    <input
                      type="text"
                      name="cardName"
                      value={formData.cardName}
                      onChange={handleInputChange}
                      className={errors.cardName ? 'error' : ''}
                    />
                    {errors.cardName && <span className="error-message">{errors.cardName}</span>}
                  </div>
                </div>
              )}
            </div>

            <button
              type="submit"
              className={`place-order-btn ${isProcessing ? 'processing' : ''}`}
              disabled={isProcessing}
            >
              {isProcessing ? 'Processing...' : `Place Order - NPR ${formatPrice(getCartTotal())}`}
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="order-summary">
          <h3>Order Summary</h3>
          <div className="order-summary-note">
            Your order details will be confirmed by our team before delivery.
          </div>
          <div className="summary-items">
            {cartItems.map(item => (
              <div key={item.id} className="summary-item">
                <img src={item.image} alt={item.title} />
                <div className="item-details">
                  <h4>{item.title}</h4>
                  <p>Qty: {item.quantity}</p>
                  <span className="item-price">NPR {formatPrice(item.price * item.quantity)}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="summary-total">
            <div className="total-row">
              <span>Subtotal:</span>
              <span>NPR {formatPrice(getCartTotal())}</span>
            </div>
            <div className="total-row">
              <span>Shipping:</span>
              <span>Free</span>
            </div>
            <div className="summary-row total-row">
              <span>Grand Total</span>
              <span>NPR {formatPrice(getCartTotal())}</span>
            </div>
          </div>
          <div className="checkout-support-strip">
            <span>Cash on delivery available</span>
            <span>Support after purchase</span>
          </div>
        </div>
      </div>
    </div>
  );
}
