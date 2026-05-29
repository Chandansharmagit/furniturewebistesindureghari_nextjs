import React from 'react';
import { MdPhone, MdRateReview, MdShoppingCart, MdInbox } from 'react-icons/md';
import './SubmissionsTab.css';

const SubmissionsTab = ({ 
  contactSubmissions, 
  feedbackSubmissions, 
  orderRequestSubmissions 
}) => {

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const getStatusClass = (status) => {
    const s = (status || 'new').toLowerCase();
    if (s === 'resolved') return 'sb-badge sb-badge--resolved';
    return 'sb-badge sb-badge--new';
  };

  return (
    <div className="sb-submissions-panel">
      {/* Page Header */}
      <div className="sb-page-header">
        <div>
          <h2 className="sb-header-title">Customer Inquiries & Submissions</h2>
          <p className="sb-header-subtitle">Review contact forms, feedback, and custom order requests from your clientele.</p>
        </div>
      </div>

      {/* Contact Submissions Section */}
      <div className="sb-section-card">
        <div className="sb-section-header">
          <div className="sb-section-icon"><MdPhone /></div>
          <div>
            <p className="sb-section-title">Contact Submissions</p>
            <p className="sb-section-subtitle">Direct inquiries from contact forms</p>
          </div>
        </div>
        <div className="sb-table-scroll">
          <table className="sb-data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Name</th>
                <th>Subject</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {(contactSubmissions || []).length > 0 ? contactSubmissions.map((sub, i) => (
                <tr key={i}>
                  <td>{formatDate(sub.created_at)}</td>
                  <td style={{ fontWeight: 600, color: '#343A40' }}>{sub.name}</td>
                  <td>{sub.subject}</td>
                  <td>
                    <span className={getStatusClass(sub.status)}>
                      {(sub.status || 'NEW').toUpperCase()}
                    </span>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="4">
                    <div className="sb-empty-state">
                      <MdInbox className="sb-empty-icon" />
                      <h4 className="sb-empty-title">No Contact Inquiries</h4>
                      <p className="sb-empty-desc">No contact form submissions found yet.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Feedback Submissions Section */}
      <div className="sb-section-card">
        <div className="sb-section-header">
          <div className="sb-section-icon"><MdRateReview /></div>
          <div>
            <p className="sb-section-title">Feedback & Reviews</p>
            <p className="sb-section-subtitle">Customer testimonials and service feedback</p>
          </div>
        </div>
        <div className="sb-table-scroll">
          <table className="sb-data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Name</th>
                <th>Rating</th>
                <th>Feedback</th>
              </tr>
            </thead>
            <tbody>
              {(feedbackSubmissions || []).length > 0 ? feedbackSubmissions.map((sub, i) => (
                <tr key={i}>
                  <td>{formatDate(sub.created_at)}</td>
                  <td style={{ fontWeight: 600, color: '#343A40' }}>{sub.name}</td>
                  <td><span className="sb-star-rating">{'★'.repeat(sub.rating || 0)}{'☆'.repeat(5 - (sub.rating || 0))}</span></td>
                  <td><span className="sb-feedback-text" title={sub.message || sub.feedback}>{sub.message || sub.feedback}</span></td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="4">
                    <div className="sb-empty-state">
                      <MdRateReview className="sb-empty-icon" />
                      <h4 className="sb-empty-title">No Feedback</h4>
                      <p className="sb-empty-desc">No feedback submissions found yet.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Request Submissions Section */}
      <div className="sb-section-card">
        <div className="sb-section-header">
          <div className="sb-section-icon"><MdShoppingCart /></div>
          <div>
            <p className="sb-section-title">Order Request Submissions</p>
            <p className="sb-section-subtitle">Custom furniture inquiries and requests</p>
          </div>
        </div>
        <div className="sb-table-scroll">
          <table className="sb-data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Name</th>
                <th>Product Type</th>
                <th>Budget</th>
              </tr>
            </thead>
            <tbody>
              {(orderRequestSubmissions || []).length > 0 ? orderRequestSubmissions.map((sub, i) => (
                <tr key={i}>
                  <td>{formatDate(sub.created_at)}</td>
                  <td style={{ fontWeight: 600, color: '#343A40' }}>{sub.name}</td>
                  <td>{sub.product_name || 'Custom Rendering'}</td>
                  <td><span className="sb-budget-value">₹{(sub.budget_range || 0).toLocaleString()}</span></td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="4">
                    <div className="sb-empty-state">
                      <MdShoppingCart className="sb-empty-icon" />
                      <h4 className="sb-empty-title">No Order Requests</h4>
                      <p className="sb-empty-desc">No custom order requests found yet.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SubmissionsTab;
