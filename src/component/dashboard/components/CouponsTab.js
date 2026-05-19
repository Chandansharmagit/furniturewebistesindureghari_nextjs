import React from 'react';
import { FaTicketAlt } from 'react-icons/fa';
import LoadingSpinner from '../../../components/common/LoadingSpinner';

const CouponsTab = ({ coupons, couponLoading, handleDeleteCoupon }) => {
  return (
    <div className="pu-tab-content-royal">
      <div className="pu-section-header-royal">
        <h2><FaTicketAlt /> Coupon Protocols</h2>
      </div>
      {couponLoading ? (
        <LoadingSpinner size="small" message="Loading..." />
      ) : (
        <div className="pu-coupons-grid-royal">
          {coupons.map(coupon => (
            <div key={coupon.id} className="pu-coupon-card-royal">
              <div className="coupon-header">
                <h3>{coupon.code}</h3>
                <span className={`pu-tag-royal ${coupon.is_active ? 'active' : 'expired'}`}>
                  {coupon.is_active ? 'ACTIVE' : 'EXPIRED'}
                </span>
              </div>
              <div className="coupon-details">
                <div>REDUCTION: {coupon.discount_value}%</div>
              </div>
              <button 
                className="action-delete" 
                onClick={() => handleDeleteCoupon(coupon.id)}
              >
                TERMINATE
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CouponsTab;
