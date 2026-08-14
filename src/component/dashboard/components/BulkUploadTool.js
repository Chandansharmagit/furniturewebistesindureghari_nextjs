'use client';

import React, { useState, useEffect } from 'react';
import { 
  FaCloudUploadAlt, 
  FaFileCode, 
  FaFileCsv, 
  FaDownload, 
  FaCopy, 
  FaCheck, 
  FaExclamationTriangle,
  FaTerminal,
  FaTags,
  FaCheckCircle,
  FaSync,
  FaSearch,
  FaFilter
} from 'react-icons/fa';
import authService from '../../../services/authService';
import { API_BASE_URL } from '../../../config/api';
import './BulkUploadTool.css';

const SAMPLE_JSON_TEMPLATE = [
  {
    "name": "Royal Solid Teak Dining Table 6-Seater",
    "price": 85000,
    "old_price": 95000,
    "stock": 10,
    "description": "Handcrafted premium solid teak dining table with ergonomic chairs.",
    "category_name": "Dining Room",
    "sku": "SIND-DIN-001",
    "wooden_type": "Teak Wood",
    "images": ["https://images.unsplash.com/photo-1617806118233-18e1de247200"]
  },
  {
    "name": "Ergonomic Upholstered Lounge Chair",
    "price": 32000,
    "old_price": 38000,
    "stock": 15,
    "description": "High-density foam accent chair with stain-resistant fabric.",
    "category_name": "Living Room",
    "sku": "SIND-LIV-002",
    "wooden_type": "Sal Wood",
    "images": ["https://images.unsplash.com/photo-1555041469-a586c61ea9bc"]
  }
];

const SAMPLE_CSV_TEMPLATE = `name,price,old_price,stock,description,category_name,sku,wooden_type,images
"Royal Solid Teak Dining Table",85000,95000,10,"Handcrafted 6-seater solid teak table","Dining Room","SIND-DIN-001","Teak Wood","https://images.unsplash.com/photo-1617806118233-18e1de247200"
"Modern King Size Bed Frame",65000,75000,8,"Solid timber bed with upholstered headboard","Modern Beds","SIND-BED-002","Shisham Wood","https://images.unsplash.com/photo-1616594039964-ae9021a400a0"`;

const BulkUploadTool = () => {
  const [activeTab, setActiveTab] = useState('upload'); // 'upload' | 'requests' | 'templates' | 'apidocs'
  const [rawInput, setRawInput] = useState('');
  const [parsedProducts, setParsedProducts] = useState([]);
  const [parseError, setParseError] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);

  // API Token Approvals State
  const [tokenRequests, setTokenRequests] = useState([]);
  const [requestsLoading, setRequestsLoading] = useState(false);
  const [requestActionFeedback, setRequestActionFeedback] = useState(null);

  // Pending Bulk Product Moderation State
  const [pendingProducts, setPendingProducts] = useState([]);
  const [pendingLoading, setPendingLoading] = useState(false);
  const [moderationFeedback, setModerationFeedback] = useState(null);

  // Pending Search, Filter & Bulk Selection State
  const [pendingSearch, setPendingSearch] = useState('');
  const [selectedBatchFilter, setSelectedBatchFilter] = useState('ALL');
  const [selectedProductIds, setSelectedProductIds] = useState([]);

  const fetchPendingProducts = async () => {
    setPendingLoading(true);
    try {
      const credentials = authService.getCredentials();
      const res = await fetch(`${API_BASE_URL}/api/products/pending-approvals`, {
        headers: { ...credentials, 'Content-Type': 'application/json' }
      });
      if (res.ok) {
        const data = await res.json();
        setPendingProducts(data.data || []);
      }
    } catch (err) {
      console.warn('Failed to fetch pending products:', err);
    } finally {
      setPendingLoading(false);
    }
  };

  const fetchTokenRequests = async () => {
    setRequestsLoading(true);
    try {
      const credentials = authService.getCredentials();
      const res = await fetch(`${API_BASE_URL}/api/auth/api-token-requests`, {
        headers: { ...credentials, 'Content-Type': 'application/json' }
      });
      if (res.ok) {
        const data = await res.json();
        setTokenRequests(data.data || []);
      }
    } catch (err) {
      console.warn('Failed to fetch token requests:', err);
    } finally {
      setRequestsLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingProducts();
    if (activeTab === 'requests') {
      fetchTokenRequests();
    }
  }, [activeTab]);

  const handleApproveProductBatch = async (batchId, productIds) => {
    if (!window.confirm('Approve these bulk uploaded products to make them live on the storefront?')) return;

    try {
      const credentials = authService.getCredentials();
      const res = await fetch(`${API_BASE_URL}/api/products/approve-batch`, {
        method: 'POST',
        headers: { ...credentials, 'Content-Type': 'application/json' },
        body: JSON.stringify({ batch_id: batchId, product_ids: productIds })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setModerationFeedback({ type: 'success', message: `🎉 ${data.message}` });
        setSelectedProductIds([]);
        fetchPendingProducts();
      } else {
        setModerationFeedback({ type: 'error', message: data.message || 'Failed to approve batch.' });
      }
    } catch (err) {
      setModerationFeedback({ type: 'error', message: 'Error: ' + err.message });
    }
  };

  const handleRejectProductBatch = async (batchId, productIds) => {
    const reason = window.prompt('Enter rejection reason (An email will be sent to the uploader explaining why their upload was rejected and removed):');
    if (!reason || !reason.trim()) {
      alert('Rejection cancelled: A rejection reason is required.');
      return;
    }

    try {
      const credentials = authService.getCredentials();
      const res = await fetch(`${API_BASE_URL}/api/products/reject-batch`, {
        method: 'POST',
        headers: { ...credentials, 'Content-Type': 'application/json' },
        body: JSON.stringify({ batch_id: batchId, product_ids: productIds, rejection_reason: reason.trim() })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setModerationFeedback({ type: 'success', message: `❌ ${data.message}` });
        setSelectedProductIds([]);
        fetchPendingProducts();
      } else {
        setModerationFeedback({ type: 'error', message: data.message || 'Failed to reject batch.' });
      }
    } catch (err) {
      setModerationFeedback({ type: 'error', message: 'Error: ' + err.message });
    }
  };

  const handleApproveTokenRequest = async (id, applicantEmail) => {
    if (!window.confirm(`Are you sure you want to approve API Access and email a generated Bearer Token to ${applicantEmail}?`)) return;

    try {
      const credentials = authService.getCredentials();
      const res = await fetch(`${API_BASE_URL}/api/auth/approve-api-token-request/${id}`, {
        method: 'POST',
        headers: { ...credentials, 'Content-Type': 'application/json' }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setRequestActionFeedback({ type: 'success', message: `✅ Approved & Token Emailed to ${applicantEmail}!` });
        fetchTokenRequests();
      } else {
        setRequestActionFeedback({ type: 'error', message: data.error || 'Failed to approve token request.' });
      }
    } catch (err) {
      setRequestActionFeedback({ type: 'error', message: 'Error: ' + err.message });
    }
  };

  const handleRejectTokenRequest = async (id, applicantEmail) => {
    if (!window.confirm(`Reject API Token request for ${applicantEmail}?`)) return;

    try {
      const credentials = authService.getCredentials();
      const res = await fetch(`${API_BASE_URL}/api/auth/reject-api-token-request/${id}`, {
        method: 'POST',
        headers: { ...credentials, 'Content-Type': 'application/json' }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setRequestActionFeedback({ type: 'success', message: `Request for ${applicantEmail} rejected.` });
        fetchTokenRequests();
      } else {
        setRequestActionFeedback({ type: 'error', message: data.error || 'Failed to reject.' });
      }
    } catch (err) {
      setRequestActionFeedback({ type: 'error', message: 'Error: ' + err.message });
    }
  };

  const handleRevokeTokenRequest = async (id, applicantEmail) => {
    if (!window.confirm(`🚫 Are you sure you want to REVOKE API Access for ${applicantEmail}? Their Bearer token will be invalidated immediately.`)) return;

    try {
      const credentials = authService.getCredentials();
      const res = await fetch(`${API_BASE_URL}/api/auth/revoke-api-token-request/${id}`, {
        method: 'POST',
        headers: { ...credentials, 'Content-Type': 'application/json' }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setRequestActionFeedback({ type: 'success', message: `🚫 Revoked API token for ${applicantEmail}!` });
        fetchTokenRequests();
      } else {
        setRequestActionFeedback({ type: 'error', message: data.error || 'Failed to revoke API token.' });
      }
    } catch (err) {
      setRequestActionFeedback({ type: 'error', message: 'Error: ' + err.message });
    }
  };

  const handleDeleteTokenRequest = async (id) => {
    if (!window.confirm('Delete this request record permanently?')) return;

    try {
      const credentials = authService.getCredentials();
      const res = await fetch(`${API_BASE_URL}/api/auth/api-token-requests/${id}`, {
        method: 'DELETE',
        headers: { ...credentials, 'Content-Type': 'application/json' }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setRequestActionFeedback({ type: 'success', message: 'Record deleted.' });
        fetchTokenRequests();
      } else {
        setRequestActionFeedback({ type: 'error', message: data.error || 'Failed to delete record.' });
      }
    } catch (err) {
      setRequestActionFeedback({ type: 'error', message: 'Error: ' + err.message });
    }
  };

  // Fetch active categories for reference
  useEffect(() => {
    const fetchCategories = async () => {
      setCategoriesLoading(true);
      try {
        const credentials = authService.getCredentials();
        const res = await fetch(`${API_BASE_URL}/api/categories`, {
          headers: { ...credentials, 'Content-Type': 'application/json' }
        });
        if (res.ok) {
          const data = await res.json();
          setCategories(Array.isArray(data) ? data : data.data || []);
        }
      } catch (err) {
        console.warn('Failed to fetch categories list:', err);
      } finally {
        setCategoriesLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // Parse JSON / CSV input
  const handleInputChange = (text) => {
    setRawInput(text);
    setParseError('');
    setUploadResult(null);

    if (!text.trim()) {
      setParsedProducts([]);
      return;
    }

    try {
      // Try parsing JSON first
      if (text.trim().startsWith('[') || text.trim().startsWith('{')) {
        const parsed = JSON.parse(text);
        const list = Array.isArray(parsed) ? parsed : [parsed];
        setParsedProducts(list);
      } else {
        // Fallback: Parse simple CSV
        const lines = text.trim().split('\n');
        if (lines.length < 2) {
          setParsedProducts([]);
          return;
        }
        const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
        const list = [];
        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(',').map(v => v.trim().replace(/^"|"$/g, ''));
          if (values.length < headers.length) continue;
          const obj = {};
          headers.forEach((h, idx) => {
            obj[h] = values[idx];
          });
          list.push(obj);
        }
        setParsedProducts(list);
      }
    } catch (err) {
      setParseError('JSON format error: ' + err.message);
      setParsedProducts([]);
    }
  };

  // Drag and drop file reader
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      handleInputChange(event.target.result);
    };
    reader.readAsText(file);
  };

  // Perform Bulk Upload to API
  const handleBulkUpload = async () => {
    if (parsedProducts.length === 0) {
      alert('Please input or upload valid product data first.');
      return;
    }

    setIsUploading(true);
    setUploadResult(null);

    try {
      const credentials = authService.getCredentials();
      const response = await fetch(`${API_BASE_URL}/api/products/bulk-upload`, {
        method: 'POST',
        headers: {
          ...credentials,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ products: parsedProducts })
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setUploadResult({
          success: true,
          message: data.message,
          totalSubmitted: data.totalSubmitted,
          insertedCount: data.insertedCount,
          skippedCount: data.skippedCount,
          skippedDetails: data.skippedDetails || []
        });
      } else {
        setUploadResult({
          success: false,
          message: data.message || data.error || 'Bulk upload failed.'
        });
      }
    } catch (err) {
      setUploadResult({
        success: false,
        message: 'Network connection error: ' + err.message
      });
    } finally {
      setIsUploading(false);
    }
  };

  // Copy helper
  const handleCopy = (str, idx) => {
    navigator.clipboard.writeText(str);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // Download template files
  const downloadFile = (filename, content, type) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const curlCode = `curl -X POST "${API_BASE_URL}/api/products/bulk-upload" \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \\
  -d '{
    "products": [
      {
        "name": "Solid Wood Coffee Table",
        "price": 24000,
        "old_price": 28000,
        "stock": 10,
        "category_name": "Living Room",
        "sku": "SIND-COF-901"
      }
    ]
  }'`;

  const fetchCode = `// Node.js / JavaScript Fetch Bulk Upload Script
const bulkUploadProducts = async (productsArray) => {
  const response = await fetch('${API_BASE_URL}/api/products/bulk-upload', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('token')
    },
    body: JSON.stringify({ products: productsArray })
  });

  const result = await response.json();
  console.log('Bulk Upload Status:', result);
};`;

  return (
    <div className="bulk-upload-tool-container">
      {/* Header Banner */}
      <div className="bulk-tool-header">
        <div className="tool-title-group">
          <h2>📦 Bulk Product Upload & API Manager</h2>
          <p>Batch insert hundreds of products categorized by category using JSON/CSV payloads or REST API endpoints.</p>
        </div>
        <div className="tool-tabs">
          <button 
            className={`tool-tab-btn ${activeTab === 'upload' ? 'active' : ''}`}
            onClick={() => setActiveTab('upload')}
          >
            <FaCloudUploadAlt /> Direct Bulk Upload
          </button>
          <button 
            className={`tool-tab-btn ${activeTab === 'moderation' ? 'active' : ''}`}
            onClick={() => setActiveTab('moderation')}
            style={{ position: 'relative' }}
          >
            <FaCheckCircle /> Pending Bulk Product Approvals
            {pendingProducts.length > 0 && (
              <span className="pending-badge-count" style={{ background: '#f59e0b', color: '#fff', borderRadius: '10px', padding: '1px 6px', fontSize: '10px', marginLeft: '6px' }}>
                {pendingProducts.length}
              </span>
            )}
          </button>
          <button 
            className={`tool-tab-btn ${activeTab === 'requests' ? 'active' : ''}`}
            onClick={() => setActiveTab('requests')}
            style={{ position: 'relative' }}
          >
            <FaTerminal /> API Token Requests
            {tokenRequests.filter(r => r.status === 'pending').length > 0 && (
              <span className="pending-badge-count" style={{ background: '#ef4444', color: '#fff', borderRadius: '10px', padding: '1px 6px', fontSize: '10px', marginLeft: '6px' }}>
                {tokenRequests.filter(r => r.status === 'pending').length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* TAB 1: DIRECT BULK UPLOAD */}
      {activeTab === 'upload' && (
        <div className="bulk-upload-pane">
          <div className="upload-input-grid">
            {/* File Drop / Paste Box */}
            <div className="upload-box-card">
              <div className="box-header">
                <h3>Input JSON / CSV Payload</h3>
                <label className="file-select-btn">
                  <FaCloudUploadAlt /> Choose File (.json / .csv)
                  <input type="file" accept=".json,.csv" onChange={handleFileUpload} hidden />
                </label>
              </div>

              <textarea
                className="payload-textarea"
                placeholder={`Paste your JSON array or CSV text here...\n\nExample JSON:\n[\n  { "name": "Solid Wood Table", "price": 45000, "category_name": "Living Room", "stock": 10 }\n]`}
                value={rawInput}
                onChange={(e) => handleInputChange(e.target.value)}
              />

              {parseError && (
                <div className="parse-error-banner">
                  <FaExclamationTriangle /> {parseError}
                </div>
              )}
            </div>

            {/* Validation & Live Preview Summary */}
            <div className="preview-summary-card">
              <h3>Parsed Batch Overview</h3>
              <div className="preview-metrics">
                <div className="metric-badge">
                  <span>Detected Rows</span>
                  <strong>{parsedProducts.length}</strong>
                </div>
                <div className="metric-badge">
                  <span>Batch Chunk Size</span>
                  <strong>250 items/batch</strong>
                </div>
                <div className="metric-badge">
                  <span>Status</span>
                  <strong className={parsedProducts.length > 0 ? 'status-ready' : 'status-idle'}>
                    {parsedProducts.length > 0 ? 'Ready for Insert' : 'Awaiting Input'}
                  </strong>
                </div>
              </div>

              {parsedProducts.length > 0 && (
                <div className="parsed-preview-table-wrap">
                  <table className="mini-preview-table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Price</th>
                        <th>Category</th>
                        <th>Stock</th>
                      </tr>
                    </thead>
                    <tbody>
                      {parsedProducts.slice(0, 5).map((p, i) => (
                        <tr key={i}>
                          <td>{i + 1}</td>
                          <td>{p.name || p.title || 'N/A'}</td>
                          <td>Rs. {p.price || p.new_price || 0}</td>
                          <td>{p.category_name || p.category || p.categoryId || 'Auto-Detect'}</td>
                          <td>{p.stock || p.stock_quantity || 0}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {parsedProducts.length > 5 && (
                    <small className="preview-more-lbl">+ {parsedProducts.length - 5} more items in this batch</small>
                  )}
                </div>
              )}

              <button
                className="btn-execute-upload"
                disabled={parsedProducts.length === 0 || isUploading}
                onClick={handleBulkUpload}
              >
                {isUploading ? (
                  <>
                    <FaSync className="spin-icon" /> Batch Ingesting...
                  </>
                ) : (
                  <>
                    <FaCloudUploadAlt /> Execute Chunked Upload ({parsedProducts.length} Items)
                  </>
                )}
              </button>

              {/* Upload Results Output */}
              {uploadResult && (
                <div className={`upload-result-box ${uploadResult.success ? 'success' : 'failed'}`}>
                  <div className="result-header">
                    {uploadResult.success ? <FaCheckCircle /> : <FaExclamationTriangle />}
                    <strong>{uploadResult.message}</strong>
                  </div>
                  {uploadResult.success && (
                    <div className="result-stats">
                      <span>Total: <strong>{uploadResult.totalSubmitted}</strong></span> | 
                      <span className="text-success"> Inserted: <strong>{uploadResult.insertedCount}</strong></span> | 
                      <span className="text-warning"> Skipped: <strong>{uploadResult.skippedCount}</strong></span>
                    </div>
                  )}

                  {uploadResult.skippedDetails && uploadResult.skippedDetails.length > 0 && (
                    <div className="skipped-details-list">
                      <small>Skipped Row Details:</small>
                      <ul>
                        {uploadResult.skippedDetails.map((err, idx) => (
                          <li key={idx}>Row {err.row}: {err.reason}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PENDING BULK PRODUCT MODERATION */}
      {activeTab === 'moderation' && (() => {
        const uniqueBatches = [...new Set(pendingProducts.map(p => p.batch_id).filter(Boolean))];
        const filteredPendingProducts = pendingProducts.filter(p => {
          const query = pendingSearch.toLowerCase().trim();
          const matchesSearch = !query || [
            p.name, p.sku, p.uploader_email, p.batch_id, p.categoryName
          ].some(val => String(val || '').toLowerCase().includes(query));

          const matchesBatch = selectedBatchFilter === 'ALL' || String(p.batch_id || '') === selectedBatchFilter;

          return matchesSearch && matchesBatch;
        });

        const isAllFilteredSelected = filteredPendingProducts.length > 0 && filteredPendingProducts.every(p => selectedProductIds.includes(p.id));

        return (
          <div className="moderation-pane" style={{ padding: '24px', background: '#fff', borderRadius: '14px', border: '1px solid rgba(156, 90, 51, 0.15)' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '18px' }}>
              <div style={{ flex: '1 1 300px', minWidth: 0 }}>
                <h3 style={{ margin: 0, fontSize: '18px', color: '#1c120c', fontWeight: 800 }}>⏳ Pending Bulk Product Approvals</h3>
                <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#6b5545', lineHeight: '1.5' }}>
                  All bulk CSV/JSON uploaded products remain pending here. Click <strong>Approve & Publish</strong> to make them live on the storefront, or <strong>Reject & Delete</strong> to delete them and send an email explaining the rejection.
                </p>
              </div>
              <button 
                type="button"
                onClick={fetchPendingProducts}
                disabled={pendingLoading}
                style={{ 
                  background: 'linear-gradient(135deg, #1c120c 0%, #3a2618 100%)', 
                  color: '#ffffff', 
                  border: '1px solid rgba(212, 175, 55, 0.35)', 
                  padding: '9px 18px', 
                  borderRadius: '10px', 
                  cursor: pendingLoading ? 'not-allowed' : 'pointer', 
                  fontSize: '12.5px', 
                  fontWeight: 700, 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  gap: '8px',
                  boxShadow: '0 4px 14px rgba(0, 0, 0, 0.12)',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                  transition: 'all 0.25s ease'
                }}
              >
                <FaSync className={pendingLoading ? 'spin' : ''} style={{ color: '#f5e3c3', fontSize: '13px' }} /> 
                <span>{pendingLoading ? 'Refreshing...' : 'Refresh List'}</span>
              </button>
            </div>

            {moderationFeedback && (
              <div style={{ padding: '12px 16px', borderRadius: '8px', marginBottom: '16px', fontSize: '13px', background: moderationFeedback.type === 'success' ? '#f0fdf4' : '#fef2f2', border: moderationFeedback.type === 'success' ? '1px solid #bbf7d0' : '1px solid #fecaca', color: moderationFeedback.type === 'success' ? '#166534' : '#991b1b' }}>
                {moderationFeedback.message}
              </div>
            )}

            {/* Advanced Search, Filter & Bulk Action Toolbar */}
            <div style={{ background: '#faf6f0', padding: '16px', borderRadius: '12px', border: '1px solid rgba(156, 90, 51, 0.18)', marginBottom: '18px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              
              {/* Top Row: Search Input & Batch Filter Dropdown */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <FaSearch style={{ position: 'absolute', left: '12px', color: '#9c5a33', fontSize: '13px' }} />
                  <input 
                    type="text"
                    placeholder="Search by Product Name, SKU, Email, Batch ID..."
                    value={pendingSearch}
                    onChange={(e) => setPendingSearch(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px 9px 34px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', background: '#fff', boxSizing: 'border-box' }}
                  />
                  {pendingSearch && (
                    <button onClick={() => setPendingSearch('')} style={{ position: 'absolute', right: '10px', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '12px' }}>✕</button>
                  )}
                </div>

                <div>
                  <select
                    value={selectedBatchFilter}
                    onChange={(e) => setSelectedBatchFilter(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', background: '#fff', fontWeight: 600, color: '#1c120c', boxSizing: 'border-box' }}
                  >
                    <option value="ALL">📦 All Batch Uploads ({pendingProducts.length} items)</option>
                    {uniqueBatches.map(batch => (
                      <option key={batch} value={batch}>
                        Batch: {batch} ({pendingProducts.filter(p => p.batch_id === batch).length} items)
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Bottom Row: Selection Controls & Accept All / Delete All Action Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', paddingTop: '10px', borderTop: '1px solid rgba(156, 90, 51, 0.12)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '13px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontWeight: 700, color: '#1c120c' }}>
                    <input 
                      type="checkbox"
                      checked={isAllFilteredSelected}
                      onChange={(e) => {
                        if (e.target.checked) {
                          const allFilteredIds = filteredPendingProducts.map(p => p.id);
                          setSelectedProductIds([...new Set([...selectedProductIds, ...allFilteredIds])]);
                        } else {
                          const filteredIdsSet = new Set(filteredPendingProducts.map(p => p.id));
                          setSelectedProductIds(selectedProductIds.filter(id => !filteredIdsSet.has(id)));
                        }
                      }}
                      style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                    />
                    Select All Screen Items ({filteredPendingProducts.length})
                  </label>

                  {selectedProductIds.length > 0 && (
                    <span style={{ background: '#9c5a33', color: '#fff', padding: '3px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 800 }}>
                      {selectedProductIds.length} Selected
                    </span>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => {
                      const idsToApprove = selectedProductIds.length > 0
                        ? selectedProductIds
                        : filteredPendingProducts.map(p => p.id);

                      if (idsToApprove.length === 0) {
                        alert('No products available to approve.');
                        return;
                      }

                      const countLabel = selectedProductIds.length > 0 ? `${selectedProductIds.length} selected` : `all ${filteredPendingProducts.length} visible`;
                      if (window.confirm(`🎉 Are you sure you want to ACCEPT & PUBLISH ${countLabel} pending products to the storefront?`)) {
                        handleApproveProductBatch(null, idsToApprove);
                      }
                    }}
                    style={{
                      background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
                      color: '#ffffff',
                      border: 'none',
                      padding: '9px 16px',
                      borderRadius: '8px',
                      fontSize: '12.5px',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      boxShadow: '0 4px 12px rgba(22, 163, 74, 0.25)'
                    }}
                  >
                    <FaCheck /> {selectedProductIds.length > 0 ? `Accept Selected (${selectedProductIds.length})` : `Accept All (${filteredPendingProducts.length})`}
                  </button>

                  <button
                    onClick={() => {
                      const idsToReject = selectedProductIds.length > 0
                        ? selectedProductIds
                        : filteredPendingProducts.map(p => p.id);

                      if (idsToReject.length === 0) {
                        alert('No products available to delete/reject.');
                        return;
                      }

                      const countLabel = selectedProductIds.length > 0 ? `${selectedProductIds.length} selected` : `all ${filteredPendingProducts.length} visible`;
                      if (window.confirm(`⚠️ Are you sure you want to REJECT & DELETE ${countLabel} pending products?`)) {
                        handleRejectProductBatch(null, idsToReject);
                      }
                    }}
                    style={{
                      background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
                      color: '#ffffff',
                      border: 'none',
                      padding: '9px 16px',
                      borderRadius: '8px',
                      fontSize: '12.5px',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      boxShadow: '0 4px 12px rgba(220, 38, 38, 0.25)'
                    }}
                  >
                    <FaExclamationTriangle /> {selectedProductIds.length > 0 ? `Delete Selected (${selectedProductIds.length})` : `Delete All (${filteredPendingProducts.length})`}
                  </button>
                </div>
              </div>
            </div>

            {pendingLoading ? (
              <p style={{ fontSize: '13px', color: '#64748b' }}>Loading pending uploads...</p>
            ) : filteredPendingProducts.length === 0 ? (
              <div style={{ padding: '40px', textAlign: 'center', background: '#faf6f0', borderRadius: '12px', color: '#6b5545' }}>
                <p style={{ margin: 0, fontWeight: 700 }}>
                  {pendingProducts.length === 0 ? '🎉 No products pending approval!' : '🔍 No products match your search/filter criteria.'}
                </p>
                <small>
                  {pendingProducts.length === 0 
                    ? 'When developers or partners upload products via CSV, JSON, or API, they will appear here for review.' 
                    : 'Try clearing your search term or batch filter dropdown.'}
                </small>
              </div>
            ) : (
              <div className="table-responsive-box">
                <table className="schema-table" style={{ width: '100%', fontSize: '13px' }}>
                  <thead>
                    <tr style={{ background: '#faf6f0' }}>
                      <th style={{ padding: '10px 14px', width: '40px', textAlign: 'center' }}>
                        <input 
                          type="checkbox"
                          checked={isAllFilteredSelected}
                          onChange={(e) => {
                            if (e.target.checked) {
                              const allFilteredIds = filteredPendingProducts.map(p => p.id);
                              setSelectedProductIds([...new Set([...selectedProductIds, ...allFilteredIds])]);
                            } else {
                              const filteredIdsSet = new Set(filteredPendingProducts.map(p => p.id));
                              setSelectedProductIds(selectedProductIds.filter(id => !filteredIdsSet.has(id)));
                            }
                          }}
                          style={{ cursor: 'pointer' }}
                        />
                      </th>
                      <th style={{ padding: '10px 14px', textAlign: 'left' }}>#</th>
                      <th style={{ padding: '10px 14px', textAlign: 'left' }}>Product Name</th>
                      <th style={{ padding: '10px 14px', textAlign: 'left' }}>Price</th>
                      <th style={{ padding: '10px 14px', textAlign: 'left' }}>Stock</th>
                      <th style={{ padding: '10px 14px', textAlign: 'left' }}>Uploader Email</th>
                      <th style={{ padding: '10px 14px', textAlign: 'left' }}>Batch ID</th>
                      <th style={{ padding: '10px 14px', textAlign: 'right' }}>Moderation Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPendingProducts.map((p, idx) => {
                      const isSelected = selectedProductIds.includes(p.id);
                      return (
                        <tr key={p.id} style={{ borderBottom: '1px solid #f1f5f9', background: isSelected ? '#f0fdf4' : 'transparent' }}>
                          <td style={{ padding: '10px 14px', textAlign: 'center' }}>
                            <input 
                              type="checkbox"
                              checked={isSelected}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedProductIds([...selectedProductIds, p.id]);
                                } else {
                                  setSelectedProductIds(selectedProductIds.filter(id => id !== p.id));
                                }
                              }}
                              style={{ cursor: 'pointer' }}
                            />
                          </td>
                          <td style={{ padding: '10px 14px' }}>{idx + 1}</td>
                          <td style={{ padding: '10px 14px', fontWeight: 700 }}>
                            {p.name}
                            {p.categoryName && <small style={{ display: 'block', color: '#64748b', fontWeight: 400 }}>{p.categoryName}</small>}
                          </td>
                          <td style={{ padding: '10px 14px' }}>Rs. {p.new_price || p.salePrice || 0}</td>
                          <td style={{ padding: '10px 14px' }}>{p.stock || 0}</td>
                          <td style={{ padding: '10px 14px' }}><code>{p.uploader_email || 'API Uploader'}</code></td>
                          <td style={{ padding: '10px 14px', fontSize: '11px', color: '#64748b' }}>{p.batch_id || 'N/A'}</td>
                          <td style={{ padding: '10px 14px', textAlign: 'right' }}>
                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                              <button 
                                onClick={() => handleApproveProductBatch(p.batch_id, [p.id])}
                                style={{ background: '#16a34a', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}
                              >
                                Approve & Publish
                              </button>
                              <button 
                                onClick={() => handleRejectProductBatch(p.batch_id, [p.id])}
                                style={{ background: '#dc2626', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}
                              >
                                Reject & Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        );
      })()}

      {/* TAB 3: API TOKEN REQUESTS APPROVALS */}
      {activeTab === 'requests' && (
        <div className="requests-pane" style={{ padding: '24px', background: '#fff', borderRadius: '14px', border: '1px solid rgba(156, 90, 51, 0.15)' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '18px' }}>
            <div style={{ flex: '1 1 300px', minWidth: 0 }}>
              <h3 style={{ margin: 0, fontSize: '18px', color: '#1c120c', fontWeight: 800 }}>🔑 API Access Token Requests</h3>
              <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#6b5545', lineHeight: '1.5' }}>
                Review developer requests for API access. Click <strong>Approve & Send Email</strong> to generate a Bearer Token and send it directly to the applicant via email.
              </p>
            </div>
            <button 
              type="button"
              onClick={fetchTokenRequests}
              disabled={requestsLoading}
              style={{ 
                background: 'linear-gradient(135deg, #1c120c 0%, #3a2618 100%)', 
                color: '#ffffff', 
                border: '1px solid rgba(212, 175, 55, 0.35)', 
                padding: '9px 18px', 
                borderRadius: '10px', 
                cursor: requestsLoading ? 'not-allowed' : 'pointer', 
                fontSize: '12.5px', 
                fontWeight: 700, 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '8px',
                boxShadow: '0 4px 14px rgba(0, 0, 0, 0.12)',
                whiteSpace: 'nowrap',
                flexShrink: 0,
                transition: 'all 0.25s ease'
              }}
            >
              <FaSync className={requestsLoading ? 'spin' : ''} style={{ color: '#f5e3c3', fontSize: '13px' }} /> 
              <span>{requestsLoading ? 'Refreshing...' : 'Refresh List'}</span>
            </button>
          </div>

          {requestActionFeedback && (
            <div style={{ padding: '12px 16px', borderRadius: '8px', marginBottom: '16px', fontSize: '13px', background: requestActionFeedback.type === 'success' ? '#f0fdf4' : '#fef2f2', border: requestActionFeedback.type === 'success' ? '1px solid #bbf7d0' : '1px solid #fecaca', color: requestActionFeedback.type === 'success' ? '#166534' : '#991b1b' }}>
              {requestActionFeedback.message}
            </div>
          )}

          {requestsLoading ? (
            <p style={{ fontSize: '13px', color: '#64748b' }}>Loading requests...</p>
          ) : tokenRequests.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', background: '#faf6f0', borderRadius: '12px', color: '#6b5545' }}>
              <p style={{ margin: 0, fontWeight: 700 }}>No API token access requests found.</p>
              <small>Developers can submit access requests on the <code>/api-docs</code> page.</small>
            </div>
          ) : (
            <div className="table-responsive-box">
              <table className="schema-table" style={{ width: '100%', fontSize: '13px' }}>
                <thead>
                  <tr style={{ background: '#faf6f0' }}>
                    <th style={{ padding: '10px 14px', textAlign: 'left' }}>#</th>
                    <th style={{ padding: '10px 14px', textAlign: 'left' }}>Applicant</th>
                    <th style={{ padding: '10px 14px', textAlign: 'left' }}>Email</th>
                    <th style={{ padding: '10px 14px', textAlign: 'left' }}>Reason</th>
                    <th style={{ padding: '10px 14px', textAlign: 'left' }}>Date</th>
                    <th style={{ padding: '10px 14px', textAlign: 'left' }}>Status</th>
                    <th style={{ padding: '10px 14px', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tokenRequests.map((req, idx) => (
                    <tr key={req.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '10px 14px' }}>{idx + 1}</td>
                      <td style={{ padding: '10px 14px', fontWeight: 700 }}>{req.name}</td>
                      <td style={{ padding: '10px 14px' }}><code>{req.email}</code></td>
                      <td style={{ padding: '10px 14px', color: '#5c483a' }}>{req.reason || 'Bulk product upload'}</td>
                      <td style={{ padding: '10px 14px', fontSize: '12px', color: '#64748b' }}>{new Date(req.created_at).toLocaleDateString()}</td>
                      <td style={{ padding: '10px 14px' }}>
                        <span style={{ 
                          padding: '3px 9px', 
                          borderRadius: '12px', 
                          fontSize: '11px', 
                          fontWeight: 800,
                          background: req.status === 'approved' ? '#dcfce7' : req.status === 'rejected' ? '#fee2e2' : req.status === 'revoked' ? '#f3f4f6' : '#fef3c7',
                          color: req.status === 'approved' ? '#15803d' : req.status === 'rejected' ? '#b91c1c' : req.status === 'revoked' ? '#6b7280' : '#b45309'
                        }}>
                          {(req.status || 'PENDING').toUpperCase()}
                        </span>
                      </td>
                      <td style={{ padding: '10px 14px', textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end', alignItems: 'center' }}>
                          {req.status === 'pending' && (
                            <>
                              <button 
                                onClick={() => handleApproveTokenRequest(req.id, req.email)}
                                style={{ background: '#16a34a', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}
                              >
                                Approve & Send Token
                              </button>
                              <button 
                                onClick={() => handleRejectTokenRequest(req.id, req.email)}
                                style={{ background: '#dc2626', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}
                              >
                                Reject
                              </button>
                            </>
                          )}
                          {req.status === 'approved' && (
                            <>
                              <button 
                                onClick={() => handleRevokeTokenRequest(req.id, req.email)}
                                style={{ background: '#d97706', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}
                              >
                                Revoke Access
                              </button>
                              <button 
                                onClick={() => handleDeleteTokenRequest(req.id)}
                                style={{ background: '#94a3b8', color: '#fff', border: 'none', padding: '6px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}
                                title="Delete Record"
                              >
                                Delete
                              </button>
                            </>
                          )}
                          {(req.status === 'rejected' || req.status === 'revoked') && (
                            <button 
                              onClick={() => handleDeleteTokenRequest(req.id)}
                              style={{ background: '#94a3b8', color: '#fff', border: 'none', padding: '6px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}
                            >
                              Delete Record
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: TEMPLATES & CATEGORY MAPPING */}
      {activeTab === 'templates' && (
        <div className="templates-pane">
          <div className="template-cards-grid">
            <div className="template-card">
              <FaFileCode className="tmpl-icon json" />
              <h3>JSON Bulk Format</h3>
              <p>Standard JSON array format with auto-category matching by category name.</p>
              <button 
                className="btn-download-tmpl"
                onClick={() => downloadFile('products_bulk_template.json', JSON.stringify(SAMPLE_JSON_TEMPLATE, null, 2), 'application/json')}
              >
                <FaDownload /> Download Sample JSON
              </button>
            </div>

            <div className="template-card">
              <FaFileCsv className="tmpl-icon csv" />
              <h3>CSV Spreadsheet Format</h3>
              <p>CSV format compatible with Microsoft Excel, Google Sheets, or custom ERP exports.</p>
              <button 
                className="btn-download-tmpl"
                onClick={() => downloadFile('products_bulk_template.csv', SAMPLE_CSV_TEMPLATE, 'text/csv')}
              >
                <FaDownload /> Download Sample CSV
              </button>
            </div>
          </div>

          {/* Active Categories Reference List */}
          <div className="categories-reference-card">
            <div className="ref-header">
              <FaTags />
              <h3>Active Database Categories Reference</h3>
              <span>Use these category names or IDs in your upload files for automatic categorization</span>
            </div>

            {categoriesLoading ? (
              <p>Loading database categories...</p>
            ) : (
              <div className="categories-badge-grid">
                {categories.map((c) => (
                  <div className="cat-ref-badge" key={c.id}>
                    <strong>ID: {c.id}</strong>
                    <span>{c.name}</span>
                    <small>({c.slug || 'slug'})</small>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: API INTEGRATION DOCS */}
      {activeTab === 'apidocs' && (
        <div className="apidocs-pane">
          <div className="api-endpoint-badge">
            <span className="method-post">POST</span>
            <code>{API_BASE_URL}/api/products/bulk-upload</code>
          </div>

          <div className="code-snippet-box">
            <div className="snippet-header">
              <span>cURL Command</span>
              <button onClick={() => handleCopy(curlCode, 1)}>
                {copiedIndex === 1 ? <FaCheck /> : <FaCopy />} Copy
              </button>
            </div>
            <pre><code>{curlCode}</code></pre>
          </div>

          <div className="code-snippet-box">
            <div className="snippet-header">
              <span>JavaScript / Node.js Fetch Code</span>
              <button onClick={() => handleCopy(fetchCode, 2)}>
                {copiedIndex === 2 ? <FaCheck /> : <FaCopy />} Copy
              </button>
            </div>
            <pre><code>{fetchCode}</code></pre>
          </div>

          <div className="schema-reference-card">
            <h3>Accepted JSON Product Fields Reference</h3>
            <table className="schema-table">
              <thead>
                <tr>
                  <th>Field Name</th>
                  <th>Type</th>
                  <th>Required</th>
                  <th>Description & Fallbacks</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><code>name</code> / <code>title</code></td>
                  <td>String</td>
                  <td><span className="req-yes">Required</span></td>
                  <td>Product title or name</td>
                </tr>
                <tr>
                  <td><code>price</code> / <code>new_price</code></td>
                  <td>Number</td>
                  <td><span className="req-yes">Required</span></td>
                  <td>Selling price in NPR</td>
                </tr>
                <tr>
                  <td><code>category_name</code> / <code>categoryId</code></td>
                  <td>String/Number</td>
                  <td><span className="req-opt">Optional</span></td>
                  <td>Auto-matches active database categories by Name, Slug, or ID</td>
                </tr>
                <tr>
                  <td><code>old_price</code> / <code>discount_price</code></td>
                  <td>Number</td>
                  <td><span className="req-opt">Optional</span></td>
                  <td>Original price before discount</td>
                </tr>
                <tr>
                  <td><code>stock</code></td>
                  <td>Number</td>
                  <td><span className="req-opt">Optional</span></td>
                  <td>Available inventory quantity (default: 0)</td>
                </tr>
                <tr>
                  <td><code>wooden_type</code> / <code>woodType</code></td>
                  <td>String</td>
                  <td><span className="req-opt">Optional</span></td>
                  <td>e.g. Teak Wood, Sisau Wood, Sal Wood</td>
                </tr>
                <tr>
                  <td><code>sku</code></td>
                  <td>String</td>
                  <td><span className="req-opt">Optional</span></td>
                  <td>Unique SKU (auto-generated if omitted)</td>
                </tr>
                <tr>
                  <td><code>images</code></td>
                  <td>Array of Strings</td>
                  <td><span className="req-opt">Optional</span></td>
                  <td>Cloudinary or public image URLs</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default BulkUploadTool;
