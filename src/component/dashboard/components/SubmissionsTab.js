import React, { useState, useEffect } from 'react';
import { MdPhone, MdRateReview, MdShoppingCart, MdInbox, MdEmail } from 'react-icons/md';
import { API_BASE_URL, CUSTOMER_DATA_ENDPOINTS } from '../../../config/api';
import authService from '../../../services/authService';
import ReplyEmailModal from './ReplyEmailModal';
import './SubmissionsTab.css';

const contactStatuses = ['new', 'in_progress', 'resolved', 'closed'];
const orderStatuses = ['new', 'quoted', 'approved', 'in_production', 'completed', 'cancelled'];

const SubmissionsTab = ({
  contactSubmissions,
  feedbackSubmissions,
  orderRequestSubmissions,
  isLoading = false
}) => {
  const [contacts, setContacts] = useState(contactSubmissions || []);
  const [orders, setOrders] = useState(orderRequestSubmissions || []);

  // Reply Modal state
  const [replyModalOpen, setReplyModalOpen] = useState(false);
  const [replyRecipient, setReplyRecipient] = useState('');
  const [replySubject, setReplySubject] = useState('');
  const [replyRefType, setReplyRefType] = useState('');
  const [replyRefId, setReplyRefId] = useState('');

  useEffect(() => {
    setContacts(contactSubmissions || []);
  }, [contactSubmissions]);

  useEffect(() => {
    setOrders(orderRequestSubmissions || []);
  }, [orderRequestSubmissions]);

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
    if (s === 'resolved' || s === 'completed' || s === 'approved') return 'sb-badge sb-badge--resolved';
    if (s === 'reviewing' || s === 'quoted' || s === 'in_progress' || s === 'in_production') return 'sb-badge sb-badge--reviewing';
    return 'sb-badge sb-badge--new';
  };

  const updateContactStatus = async (id, status) => {
    try {
      const credentials = authService.getCredentials();
      const endpoint = CUSTOMER_DATA_ENDPOINTS.UPDATE_CONTACT_STATUS.replace(':id', id);
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', ...credentials },
        body: JSON.stringify({ status })
      });
      if (response.ok) {
        setContacts(prev => prev.map(c => c.id === id ? { ...c, status } : c));
      }
    } catch (err) {
      console.error('Update status error:', err);
    }
  };

  const updateOrderRequestStatus = async (id, status) => {
    try {
      const credentials = authService.getCredentials();
      const endpoint = CUSTOMER_DATA_ENDPOINTS.UPDATE_ORDER_REQUEST_STATUS.replace(':id', id);
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', ...credentials },
        body: JSON.stringify({ status })
      });
      if (response.ok) {
        setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
      }
    } catch (err) {
      console.error('Update status error:', err);
    }
  };

  const openReply = (email, subject, type, id) => {
    setReplyRecipient(email);
    setReplySubject(`Response regarding: ${subject || 'Your Request'}`);
    setReplyRefType(type);
    setReplyRefId(id);
    setReplyModalOpen(true);
  };

  return (
    <div className="sb-submissions-panel">
      <div className="sb-page-header">
        <div>
          <h2 className="sb-header-title">Customer Inquiries &amp; Submissions</h2>
          <p className="sb-header-subtitle">Review contact forms, feedback, and custom order requests from your clientele.</p>
        </div>
      </div>

      {isLoading ? (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '80px 20px',
          gap: '18px',
          color: '#64748b'
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            border: '3px solid #e2e8f0',
            borderTop: '3px solid #B19456',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite'
          }} />
          <p style={{ margin: 0, fontSize: '0.95rem', fontWeight: 500, letterSpacing: '0.02em' }}>
            Loading inquiries &amp; submissions...
          </p>
        </div>
      ) : (
        <>
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
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {contacts.length > 0 ? contacts.map((sub, i) => (
                    <tr key={sub.id || i}>
                      <td>{formatDate(sub.created_at)}</td>
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <strong className="sb-customer-name">{sub.name}</strong>
                          <small style={{ color: '#64748b', fontSize: '0.8rem' }}>{sub.email}</small>
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                          <span>{sub.subject}</span>
                          <small style={{ color: '#64748b', fontSize: '0.82rem', whiteSpace: 'normal', maxWidth: '300px' }}>
                            {sub.message}
                          </small>
                        </div>
                      </td>
                      <td>
                        <select 
                          value={sub.status || 'new'} 
                          onChange={(e) => updateContactStatus(sub.id, e.target.value)}
                          className="royal-select"
                          style={{ padding: '6px 12px', fontSize: '0.8rem', width: 'max-content' }}
                        >
                          {contactStatuses.map(status => (
                            <option key={status} value={status}>{status.replace('_', ' ').toUpperCase()}</option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <button 
                          className="btn-icon-royal" 
                          onClick={() => openReply(sub.email, sub.subject, 'contact_form', sub.id)}
                          title="Reply via Email"
                        >
                          <MdEmail />
                        </button>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="5">
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

          <div className="sb-section-card">
            <div className="sb-section-header">
              <div className="sb-section-icon"><MdRateReview /></div>
              <div>
                <p className="sb-section-title">Feedback &amp; Reviews</p>
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
                      <td><strong className="sb-customer-name">{sub.name}</strong></td>
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

          <div className="sb-section-card">
            <div className="sb-section-header">
              <div className="sb-section-icon"><MdShoppingCart /></div>
              <div>
                <p className="sb-section-title">Order Request Submissions</p>
                <p className="sb-section-subtitle">Customer details, furniture type, timeline, and requirements</p>
              </div>
            </div>
            <div className="sb-table-scroll">
              <table className="sb-data-table sb-data-table--wide">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Customer</th>
                    <th>Furniture Type</th>
                    <th>Details</th>
                    <th>Budget</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.length > 0 ? orders.map((sub, i) => {
                    const isInternational = sub.special_requirements && sub.special_requirements.includes('Source: international_product_quote');
                    
                    return (
                      <tr key={sub.id || i}>
                        <td>{formatDate(sub.created_at)}</td>
                        <td>
                          <div className="sb-contact-stack">
                            <strong className="sb-customer-name">{sub.name || 'Unknown customer'}</strong>
                            <span>{sub.email || 'No email'}</span>
                            <small>{sub.phone || 'No phone'}</small>
                          </div>
                        </td>
                        <td>
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span>{sub.product_name || 'Custom furniture'}</span>
                            {isInternational && (
                              <span className="linked-ip-badge" style={{ fontSize: '0.65rem', padding: '1px 5px', width: 'max-content' }}>
                                🌍 Global Export
                              </span>
                            )}
                          </div>
                        </td>
                        <td>
                          <span className="sb-detail-text" title={`${sub.product_description || ''}\n${sub.special_requirements || ''}`}>
                            {sub.product_description || 'No project details'}
                            {sub.special_requirements && <small>{sub.special_requirements}</small>}
                          </span>
                        </td>
                        <td><span className="sb-budget-value">{sub.budget_range || 'Not shared'}</span></td>
                        <td>
                          <select 
                            value={sub.status || 'new'} 
                            onChange={(e) => updateOrderRequestStatus(sub.id, e.target.value)}
                            className="royal-select"
                            style={{ padding: '6px 12px', fontSize: '0.8rem', width: 'max-content' }}
                          >
                            {orderStatuses.map(status => (
                              <option key={status} value={status}>{status.toUpperCase()}</option>
                            ))}
                          </select>
                        </td>
                        <td>
                          <button 
                            className="btn-icon-royal" 
                            onClick={() => openReply(sub.email, sub.product_name, 'order_request', sub.id)}
                            title="Reply via Email"
                          >
                            <MdEmail />
                          </button>
                        </td>
                      </tr>
                    );
                  }) : (
                    <tr>
                      <td colSpan="7">
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
        </>
      )}

      {/* Shared email reply modal */}
      <ReplyEmailModal 
        isOpen={replyModalOpen}
        onClose={() => setReplyModalOpen(false)}
        to={replyRecipient}
        defaultSubject={replySubject}
        referenceType={replyRefType}
        referenceId={replyRefId}
      />
    </div>
  );
};

export default SubmissionsTab;
