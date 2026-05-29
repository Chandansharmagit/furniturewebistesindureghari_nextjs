import React from 'react';
import { MdLocalOffer, MdConfirmationNumber, MdCheckCircle, MdCancel } from 'react-icons/md';
import './CouponsTab.css';

const CouponsTab = ({ coupons, couponLoading, handleDeleteCoupon }) => {

  const totalCoupons = coupons?.length || 0;
  const activeCoupons = coupons?.filter(c => c.is_active).length || 0;
  const expiredCoupons = totalCoupons - activeCoupons;

  return (
    <div className="cp-coupons-panel">
      {/* Page Header */}
      <div className="cp-page-header">
        <div>
          <h2 className="cp-header-title">Coupon Protocols</h2>
          <p className="cp-header-subtitle">Manage promotional codes and discount strategies for your clientele.</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="cp-stats-grid">
        <div className="cp-stat-card">
          <div className="cp-stat-top">
            <MdConfirmationNumber className="cp-stat-icon" />
            <span className="cp-stat-badge">Total Issued</span>
          </div>
          <p className="cp-stat-label">Total Coupons</p>
          <h3 className="cp-stat-value">{totalCoupons}</h3>
        </div>

        <div className="cp-stat-card">
          <div className="cp-stat-top">
            <MdCheckCircle className="cp-stat-icon" />
            <span className="cp-stat-badge cp-stat-badge--active">Currently Valid</span>
          </div>
          <p className="cp-stat-label">Active Coupons</p>
          <h3 className="cp-stat-value">{activeCoupons}</h3>
        </div>

        <div className="cp-stat-card">
          <div className="cp-stat-top">
            <MdCancel className="cp-stat-icon" />
            <span className="cp-stat-badge cp-stat-badge--expired">Terminated</span>
          </div>
          <p className="cp-stat-label">Expired Coupons</p>
          <h3 className="cp-stat-value">{expiredCoupons}</h3>
        </div>
      </div>

      {/* Coupons Table */}
      <div className="cp-table-container">
        <div className="cp-table-header">
          <h4 className="cp-table-title">Coupon Registry</h4>
        </div>

        {couponLoading ? (
          <div className="cp-loading">
            <div className="cp-loading-spinner"></div>
            <span className="cp-loading-text">Accessing coupon database...</span>
          </div>
        ) : !coupons || coupons.length === 0 ? (
          <div className="cp-empty-state">
            <MdLocalOffer className="cp-empty-icon" />
            <h4 className="cp-empty-title">No Coupons Found</h4>
            <p className="cp-empty-desc">Create your first promotional code to offer exclusive discounts.</p>
          </div>
        ) : (
          <div className="cp-table-scroll">
            <table className="cp-data-table">
              <thead>
                <tr>
                  <th>Coupon Code</th>
                  <th>Discount</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {coupons.map(coupon => (
                  <tr key={coupon.id}>
                    <td>
                      <div className="cp-code-cell">
                        <div className="cp-code-avatar">
                          <MdLocalOffer />
                        </div>
                        <div>
                          <p className="cp-code-name">{coupon.code}</p>
                          <p className="cp-code-meta">Promotional Code</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <p className="cp-discount-value">{coupon.discount_value}%</p>
                    </td>
                    <td>
                      <span className={`cp-badge ${coupon.is_active ? 'cp-badge--active' : 'cp-badge--expired'}`}>
                        {coupon.is_active ? 'ACTIVE' : 'EXPIRED'}
                      </span>
                    </td>
                    <td>
                      <button className="cp-action-btn" onClick={() => handleDeleteCoupon(coupon.id)}>
                        Terminate
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default CouponsTab;
