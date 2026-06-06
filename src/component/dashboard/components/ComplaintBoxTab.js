import React, { useCallback, useEffect, useState } from 'react';
import { MdAttachment, MdAutoAwesome, MdOutlineReportProblem, MdRefresh } from 'react-icons/md';
import { API_BASE_URL, CUSTOMER_DATA_ENDPOINTS } from '../../../config/api';
import authService from '../../../services/authService';
import aiService from '../../../services/aiService';
import './ComplaintBoxTab.css';

const statuses = ['new', 'reviewing', 'resolved', 'closed'];

const ComplaintBoxTab = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [aiTriage, setAiTriage] = useState({});

  const fetchComplaints = useCallback(async () => {
    try {
      setLoading(true);
      const credentials = authService.getCredentials();
      const params = new URLSearchParams({ limit: '50' });
      if (statusFilter !== 'all') params.set('status', statusFilter);
      if (search.trim()) params.set('search', search.trim());

      const response = await fetch(`${API_BASE_URL}${CUSTOMER_DATA_ENDPOINTS.COMPLAINTS}?${params.toString()}`, {
        headers: { 'Content-Type': 'application/json', ...credentials }
      });
      const data = await response.json().catch(() => ({}));
      if (response.ok && data.success) {
        setComplaints(data.data || []);
      }
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter]);

  useEffect(() => {
    fetchComplaints();
  }, [fetchComplaints]);

  const updateStatus = async (id, status) => {
    const credentials = authService.getCredentials();
    const endpoint = CUSTOMER_DATA_ENDPOINTS.UPDATE_COMPLAINT_STATUS.replace(':id', id);
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...credentials },
      body: JSON.stringify({ status })
    });

    if (response.ok) {
      setComplaints((current) => current.map((item) => (
        item.id === id ? { ...item, status } : item
      )));
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const triageComplaint = async (complaint) => {
    setAiTriage((current) => ({
      ...current,
      [complaint.id]: { loading: true, message: '', error: '' }
    }));

    const result = await aiService.chat({
      context: 'Admin is triaging a customer complaint for Sindureghari Furniture. Keep response actionable and service-focused.',
      prompt: `Triage this complaint.
Customer: ${complaint.name}
Email: ${complaint.email}
Phone: ${complaint.phone || 'N/A'}
Issue type: ${complaint.issue_type || 'general'}
Priority field: ${complaint.priority || 'medium'}
Order: ${complaint.order_number || 'not shared'}
Product: ${complaint.product_name || 'not shared'}
Message: ${complaint.message || ''}
Media count: ${Array.isArray(complaint.media_urls) ? complaint.media_urls.length : 0}

Return 3 compact lines: urgency, likely department, suggested first reply/action.`
    });

    setAiTriage((current) => ({
      ...current,
      [complaint.id]: {
        loading: false,
        message: result.success ? result.message : '',
        error: result.success ? '' : result.error
      }
    }));
  };

  return (
    <div className="cb-admin-panel">
      <div className="cb-admin-header">
        <div>
          <p className="cb-admin-kicker">Customer Care</p>
          <h2>Complaint Box</h2>
          <span>Review product, delivery, payment, and service complaints with uploaded evidence.</span>
        </div>
        <button type="button" className="cb-refresh-btn" onClick={fetchComplaints}>
          <MdRefresh />
          Refresh
        </button>
      </div>

      <div className="cb-filter-bar">
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') fetchComplaints();
          }}
          placeholder="Search name, email, phone, order, product..."
        />
        <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
          <option value="all">All statuses</option>
          {statuses.map((status) => (
            <option value={status} key={status}>{status}</option>
          ))}
        </select>
        <button type="button" onClick={fetchComplaints}>Search</button>
      </div>

      <div className="cb-admin-grid">
        {loading ? (
          <div className="cb-empty-card">Loading complaints...</div>
        ) : complaints.length === 0 ? (
          <div className="cb-empty-card">
            <MdOutlineReportProblem />
            <strong>No complaints found</strong>
            <span>New complaint box submissions will appear here.</span>
          </div>
        ) : complaints.map((complaint) => (
          <article className="cb-complaint-card" key={complaint.id}>
            <div className="cb-complaint-top">
              <span className={`cb-status cb-status--${complaint.status || 'new'}`}>{complaint.status || 'new'}</span>
              <small>{formatDate(complaint.created_at)}</small>
            </div>

            <h3>{complaint.name}</h3>
            <div className="cb-contact-lines">
              <span>{complaint.email}</span>
              <span>{complaint.phone || 'No phone'}</span>
            </div>

            <div className="cb-meta-grid">
              <span><strong>Issue</strong>{complaint.issue_type || 'general'}</span>
              <span><strong>Order</strong>{complaint.order_number || 'Not shared'}</span>
              <span><strong>Product</strong>{complaint.product_name || 'Not shared'}</span>
              <span><strong>Priority</strong>{complaint.priority || 'medium'}</span>
            </div>

            <p className="cb-message">{complaint.message}</p>

            <div className="cb-ai-triage">
              <button type="button" onClick={() => triageComplaint(complaint)} disabled={aiTriage[complaint.id]?.loading}>
                <MdAutoAwesome />
                {aiTriage[complaint.id]?.loading ? 'Triaging...' : 'AI Triage'}
              </button>
              {(aiTriage[complaint.id]?.message || aiTriage[complaint.id]?.error) && (
                <p className={aiTriage[complaint.id]?.error ? 'cb-ai-error' : ''}>
                  {aiTriage[complaint.id]?.error || aiTriage[complaint.id]?.message}
                </p>
              )}
            </div>

            {Array.isArray(complaint.media_urls) && complaint.media_urls.length > 0 && (
              <div className="cb-media-list">
                {complaint.media_urls.map((media, index) => (
                  <a href={media.url} target="_blank" rel="noreferrer" key={`${media.url}-${index}`}>
                    <MdAttachment />
                    {media.type || 'media'} {index + 1}
                  </a>
                ))}
              </div>
            )}

            <label className="cb-status-control">
              Update status
              <select value={complaint.status || 'new'} onChange={(event) => updateStatus(complaint.id, event.target.value)}>
                {statuses.map((status) => (
                  <option value={status} key={status}>{status}</option>
                ))}
              </select>
            </label>
          </article>
        ))}
      </div>
    </div>
  );
};

export default ComplaintBoxTab;
