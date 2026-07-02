import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { 
  MdSearch, MdFilterList, MdDownload, MdRefresh, 
  MdEmail, MdGroup, MdNewspaper, MdPersonOutline 
} from 'react-icons/md';
import { API_BASE_URL } from '../../../config/api';
import authService from '../../../services/authService';
import ReplyEmailModal from './ReplyEmailModal';
import './LeadsHubTab.css';

const LeadsHubTab = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  // Reply modal states
  const [replyModalOpen, setReplyModalOpen] = useState(false);
  const [replyRecipient, setReplyRecipient] = useState('');

  const fetchLeads = useCallback(async () => {
    try {
      setLoading(true);
      const credentials = authService.getCredentials();
      const response = await axios.get(`${API_BASE_URL}/api/dashboard/analytics/all-emails`, {
        headers: credentials
      });
      if (response.data.success) {
        setLeads(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching leads:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Email,Source,Date Captured\n"
      + leads.map(l => `${l.email},${l.source},${new Date(l.created_at).toLocaleString()}`).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `leads_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
  };

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.email.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          lead.source.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || lead.source.toLowerCase().includes(filter.toLowerCase());
    return matchesSearch && matchesFilter;
  });

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const newsletterCount = leads.filter(l => l.source.includes('Newsletter')).length;
  const guestLeadCount = leads.filter(l => l.source === 'Guest Lead').length;

  return (
    <div className="lh-leads-panel">
      {/* Page Header */}
      <div className="lh-page-header">
        <div>
          <h2 className="lh-header-title">Leads Hub</h2>
          <p className="lh-header-subtitle">Consolidated view of all captured contact information across the platform.</p>
        </div>
        <div className="lh-header-actions">
          <button className="lh-btn-outline" onClick={fetchLeads} disabled={loading}>
            <MdRefresh /> Refresh
          </button>
          <button className="lh-btn-primary" onClick={handleExport}>
            <MdDownload /> Export CSV
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="lh-stats-grid">
        <div className="lh-stat-card">
          <div className="lh-stat-top">
            <MdGroup className="lh-stat-icon" />
            <span className="lh-stat-badge">All Channels</span>
          </div>
          <p className="lh-stat-label">Total Unique Leads</p>
          <h3 className="lh-stat-value">{leads.length}</h3>
        </div>

        <div className="lh-stat-card">
          <div className="lh-stat-top">
            <MdNewspaper className="lh-stat-icon" />
            <span className="lh-stat-badge">Subscriptions</span>
          </div>
          <p className="lh-stat-label">Newsletter Subs</p>
          <h3 className="lh-stat-value">{newsletterCount}</h3>
        </div>

        <div className="lh-stat-card">
          <div className="lh-stat-top">
            <MdPersonOutline className="lh-stat-icon" />
            <span className="lh-stat-badge">Anonymous</span>
          </div>
          <p className="lh-stat-label">Guest Leads</p>
          <h3 className="lh-stat-value">{guestLeadCount}</h3>
        </div>
      </div>

      {/* Leads Table */}
      <div className="lh-table-container">
        {/* Search & Filters */}
        <div className="lh-filters-bar">
          <div className="lh-search-wrapper">
            <MdSearch className="lh-search-icon" />
            <input 
              type="text" 
              className="lh-search-input" 
              placeholder="Search by email or source..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="lh-filter-group">
            <select 
              className="lh-filter-select" 
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">Source: All</option>
              <option value="Newsletter">Newsletter</option>
              <option value="Guest Lead">Guest Leads</option>
              <option value="Contact Form">Contact Forms</option>
              <option value="Order Request">Order Requests</option>
              <option value="Registered User">Registered Users</option>
            </select>
          </div>
        </div>

        {/* Table Content */}
        {loading ? (
          <div className="lh-loading">
            <div className="lh-loading-spinner"></div>
            <span className="lh-loading-text">Processing lead database...</span>
          </div>
        ) : filteredLeads.length === 0 ? (
          <div className="lh-empty-state">
            <MdEmail className="lh-empty-icon" />
            <h4 className="lh-empty-title">No Leads Found</h4>
            <p className="lh-empty-desc">Try resetting your search query or source filter to see leads.</p>
          </div>
        ) : (
          <div className="lh-table-scroll">
            <table className="lh-data-table">
              <thead>
                <tr>
                  <th>Lead Email</th>
                  <th>Origin Source</th>
                  <th>Captured Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeads.map((lead, index) => (
                  <tr key={index}>
                    <td>
                      <div className="lh-email-cell">
                        <div className="lh-email-avatar">
                          <MdEmail />
                        </div>
                        <div>
                          <p className="lh-email-text">{lead.email}</p>
                          <p className="lh-email-meta">Lead Contact</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="lh-source-badge">
                        {lead.source}
                      </span>
                    </td>
                    <td>{formatDate(lead.created_at)}</td>
                    <td>
                      <button 
                        className="lh-action-btn" 
                        title="Send Email"
                        onClick={() => {
                          setReplyRecipient(lead.email);
                          setReplyModalOpen(true);
                        }}
                      >
                        <MdEmail />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ReplyEmailModal 
        isOpen={replyModalOpen}
        onClose={() => setReplyModalOpen(false)}
        to={replyRecipient}
        defaultSubject="Message from Sindureghari Furniture"
        referenceType="lead"
        referenceId={replyRecipient}
      />
    </div>
  );
};

export default LeadsHubTab;
