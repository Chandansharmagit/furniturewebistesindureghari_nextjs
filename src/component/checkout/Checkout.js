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
  const [isMounted, setIsMounted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [unavailablePayment, setUnavailablePayment] = useState('');
  const [postalLookup, setPostalLookup] = useState({
    status: 'idle',
    message: ''
  });

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
  });

  useEffect(() => {
    const mountTimer = window.setTimeout(() => {
      setIsMounted(true);
    }, 0);

    return () => window.clearTimeout(mountTimer);
  }, []);

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

  useEffect(() => {
    const postalCode = formData.pincode.trim();

    if (!/^[0-9]{5}$/.test(postalCode)) {
      return undefined;
    }

    const controller = new AbortController();
    const lookupTimer = window.setTimeout(async () => {
      setPostalLookup({
        status: 'loading',
        message: 'Finding address from postal code...'
      });

      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?postalcode=${encodeURIComponent(postalCode)}&country=Nepal&format=json&addressdetails=1&limit=1`,
          {
            signal: controller.signal,
            headers: {
              Accept: 'application/json'
            }
          }
        );

        if (!response.ok) {
          throw new Error('Postal lookup failed');
        }

        const results = await response.json();
        const place = Array.isArray(results) ? results[0] : null;

        if (!place) {
          setPostalLookup({
            status: 'error',
            message: 'No matching Nepal address found for this postal code.'
          });
          return;
        }

        const address = place.address || {};
        const city = address.city || address.town || address.village || address.municipality || address.county || '';
        const state = address.state || address.province || address.region || '';
        const roadAddress = [
          address.road,
          address.suburb || address.neighbourhood,
          city,
          state,
          address.country
        ].filter(Boolean).join(', ');

        setFormData(prev => ({
          ...prev,
          city: prev.city || city,
          state: prev.state || state,
          country: 'Nepal',
          address: prev.address || roadAddress || place.display_name || prev.address
        }));

        setPostalLookup({
          status: 'success',
          message: `Address matched${city ? ` for ${city}` : ''}. Please review before placing order.`
        });
      } catch (error) {
        if (error.name === 'AbortError') return;
        setPostalLookup({
          status: 'error',
          message: 'Could not fetch postal address right now. You can still enter it manually.'
        });
      }
    }, 650);

    return () => {
      controller.abort();
      window.clearTimeout(lookupTimer);
    };
  }, [formData.pincode]);

  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === 'pincode' && !/^[0-9]{5}$/.test(value.trim())) {
      setPostalLookup({ status: 'idle', message: '' });
    }

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
    if (!formData.pincode.trim()) newErrors.pincode = 'Postal code is required';
    else if (!/^[0-9]{5}$/.test(formData.pincode)) newErrors.pincode = 'Nepal postal code must be 5 digits';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const showUnavailablePaymentMessage = (method) => {
    setUnavailablePayment(method);
  };

  const redirectToStripeCheckout = async () => {
    const response = await fetch('/api/stripe/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customer: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone
        },
        shipping: {
          address: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          country: formData.country || 'Nepal'
        },
        items: cartItems.map(item => ({
          id: item.id || item.product_id,
          title: item.title || item.name || 'Sindureghari Furniture item',
          price: Number(item.price || 0),
          quantity: Number(item.quantity || 1),
          image: item.image
        })),
        total: getCartTotal()
      })
    });

    const data = await response.json();

    if (!response.ok || !data.url) {
      throw new Error(data.error || 'Unable to start Stripe checkout.');
    }

    window.location.href = data.url;
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
      if (formData.paymentMethod === 'card') {
        await redirectToStripeCheckout();
        return;
      }

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

  if (!isMounted) {
    return (
      <div className="checkout-container">
        <div className="empty-checkout">
          <h2>Loading checkout...</h2>
          <p>Preparing your cart and secure order details.</p>
        </div>
      </div>
    );
  }

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
                  <label>Postal Code *</label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleInputChange}
                    className={errors.pincode ? 'error' : ''}
                    placeholder="e.g. 44600"
                    inputMode="numeric"
                    maxLength="5"
                  />
                  {errors.pincode && <span className="error-message">{errors.pincode}</span>}
                  {postalLookup.message && (
                    <span className={`postal-lookup-message ${postalLookup.status}`}>
                      {postalLookup.message}
                    </span>
                  )}
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
                  <span>Secure Card Payment (Stripe)</span>
                </label>
                <button
                  type="button"
                  className="payment-option payment-option-unavailable"
                  onClick={() => showUnavailablePaymentMessage('eSewa')}
                >
                  <span>eSewa</span>
                  <em>Coming soon</em>
                </button>
                <button
                  type="button"
                  className="payment-option payment-option-unavailable"
                  onClick={() => showUnavailablePaymentMessage('Local Bank Transfer')}
                >
                  <span>Local Bank Transfer</span>
                  <em>Coming soon</em>
                </button>
              </div>

              {unavailablePayment && (
                <div className="payment-building-popup" role="alert">
                  <button
                    type="button"
                    onClick={() => setUnavailablePayment('')}
                    aria-label="Close payment method message"
                  >
                    ×
                  </button>
                  <strong>{unavailablePayment} is still building</strong>
                  <p>
                    This payment method is not ready yet. Please select Cash on Delivery
                    or Secure Card Payment with Stripe for now.
                  </p>
                </div>
              )}

              {formData.paymentMethod === 'card' && (
                <div className="stripe-checkout-note">
                  <strong>Stripe secure checkout</strong>
                  <p>
                    You will be redirected to Stripe to enter card details. Sindureghari Furniture
                    does not store your card number, CVV, or bank details.
                  </p>
                </div>
              )}
            </div>

            <button
              type="submit"
              className={`place-order-btn ${isProcessing ? 'processing' : ''}`}
              disabled={isProcessing}
            >
              {isProcessing
                ? 'Processing...'
                : `${formData.paymentMethod === 'card' ? 'Pay with Stripe' : 'Place Order'} - NPR ${formatPrice(getCartTotal())}`}
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
