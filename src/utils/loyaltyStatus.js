import { buildApiUrl } from '../config/api';

export const getStoredCustomerIdentity = () => {
  if (typeof window === 'undefined') return {};

  const identity = {};
  const inspect = (value) => {
    if (!value || typeof value !== 'object') return;

    identity.id = identity.id || value.id || value.user_id || value.userId || value.customer_id;
    identity.name = identity.name || value.name || value.full_name || value.fullName || value.username;
    identity.email = identity.email || value.email || value.user_email;
    identity.phone = identity.phone || value.phone || value.contact || value.mobile;
    identity.image = identity.image || value.profile_image || value.profileImage || value.avatar || value.image;
    identity.totalSpend = identity.totalSpend || value.total_spend || value.totalSpend || value.total_purchase || value.totalPurchase;

    Object.values(value).forEach((nestedValue) => {
      if (nestedValue && typeof nestedValue === 'object' && !Array.isArray(nestedValue)) {
        inspect(nestedValue);
      }
    });
  };

  Object.keys(localStorage).forEach((key) => {
    if (!/user|customer|auth|profile|client|patron/i.test(key)) return;

    try {
      inspect(JSON.parse(localStorage.getItem(key)));
    } catch {
      // Ignore tokens and plain strings.
    }
  });

  return identity;
};

export const fetchLoyaltyStatus = async (fallbackIdentity = {}) => {
  const identity = {
    ...getStoredCustomerIdentity(),
    ...fallbackIdentity
  };
  const email = identity.email || '';
  const userId = identity.id || '';
  const totalSpend = Number(identity.totalSpend || 0);

  if (!email && !userId) {
    return {
      status: 'Registered',
      status_key: 'registered',
      eligible_for_loyalty: false,
      discount_percent: 0,
      coupon: null
    };
  }

  const params = new URLSearchParams();
  if (email) params.set('email', email);
  if (userId) params.set('user_id', userId);
  if (totalSpend) params.set('total_spend', String(totalSpend));

  const response = await fetch(buildApiUrl(`/api/customer-data/loyalty-status?${params.toString()}`), {
    credentials: 'include'
  });

  if (!response.ok) throw new Error('Unable to fetch loyalty status');

  return response.json();
};

export const getLoyaltyStatusClass = (status) => String(status || 'registered').toLowerCase();
