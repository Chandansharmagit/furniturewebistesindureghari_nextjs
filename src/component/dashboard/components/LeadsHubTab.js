import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { FaDownload, FaSync, FaEnvelope, FaSearch, FaFilter } from 'react-icons/fa';
import { API_BASE_URL } from '../../../config/api';
import authService from '../../../services/authService';
import './LeadsHubTab.css';

const LeadsHubTab = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

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
    link.setAttribute("download", `royal_leads_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
  };

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.email.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          lead.source.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || lead.source.toLowerCase().includes(filter.toLowerCase());
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="leads-hub-container">
      <div className="leads-header">
        <div className="header-titles">
          <h2>Leads Hub</h2>
          <p>Consolidated view of all captured contact information across the platform.</p>
        </div>
        <div className="header-actions">
          <button className="refresh-btn" onClick={fetchLeads} disabled={loading}>
            <FaSync className={loading ? 'spinning' : ''} /> Refresh
          </button>
          <button className="export-btn" onClick={handleExport}>
            <FaDownload /> Export CSV
          </button>
        </div>
      </div>

      <div className="leads-controls">
        <div className="search-bar">
          <FaSearch />
          <input 
            type="text" 
            placeholder="Search by email or source..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-group">
          <FaFilter />
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All Sources</option>
            <option value="Newsletter">Newsletter</option>
            <option value="Guest Lead">Guest Leads</option>
            <option value="Contact Form">Contact Forms</option>
            <option value="Order Request">Order Requests</option>
            <option value="Registered User">Registered Users</option>
          </select>
        </div>
      </div>

      <div className="leads-stats">
        <div className="stat-card">
          <span className="stat-label">Total Unique Leads</span>
          <span className="stat-value">{leads.length}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Newsletter Subs</span>
          <span className="stat-value">{leads.filter(l => l.source.includes('Newsletter')).length}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Guest Leads</span>
          <span className="stat-value">{leads.filter(l => l.source === 'Guest Lead').length}</span>
        </div>
      </div>

      <div className="leads-table-wrapper">
        <table className="leads-table">
          <thead>
            <tr>
              <th>Lead Email</th>
              <th>Origin Source</th>
              <th>Captured Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="4" className="loading-row">Processing lead database...</td></tr>
            ) : filteredLeads.length === 0 ? (
              <tr><td colSpan="4" className="empty-row">No leads matching your criteria.</td></tr>
            ) : (
              filteredLeads.map((lead, index) => (
                <tr key={index}>
                  <td className="email-cell">
                    <FaEnvelope className="email-icon" />
                    {lead.email}
                  </td>
                  <td>
                    <span className={`source-badge ${lead.source.toLowerCase().replace(/[^a-z]/g, '-')}`}>
                      {lead.source}
                    </span>
                  </td>
                  <td>{new Date(lead.created_at).toLocaleString()}</td>
                  <td>
                    <button className="action-btn" title="Send Email">
                      <FaEnvelope />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeadsHubTab;
