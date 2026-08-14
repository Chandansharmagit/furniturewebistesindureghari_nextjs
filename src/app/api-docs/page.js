'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  FaShieldAlt, 
  FaLock, 
  FaKey, 
  FaTerminal, 
  FaFileCode, 
  FaFileCsv, 
  FaDownload, 
  FaCopy, 
  FaCheck, 
  FaExclamationTriangle, 
  FaCloudUploadAlt,
  FaCheckCircle,
  FaSync,
  FaTags,
  FaBox,
  FaExternalLinkAlt,
  FaCode,
  FaSearch,
  FaServer,
  FaDatabase,
  FaEye,
  FaEyeSlash
} from 'react-icons/fa';
import authService from '../../services/authService';
import { API_BASE_URL } from '../../config/api';
import './api-docs.css';

const SAMPLE_JSON = [
  {
    "name": "Royal Solid Teak Dining Table 6-Seater",
    "price": 85000,
    "old_price": 95000,
    "stock": 10,
    "description": "Handcrafted solid teak table with ergonomic chairs.",
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
    "description": "High-density foam accent lounge chair.",
    "category_name": "Living Room",
    "sku": "SIND-LIV-002",
    "wooden_type": "Sal Wood",
    "images": ["https://images.unsplash.com/photo-1555041469-a586c61ea9bc"]
  }
];

const SAMPLE_CSV = `name,price,old_price,stock,description,category_name,sku,wooden_type,images
"Royal Solid Teak Dining Table",85000,95000,10,"Handcrafted 6-seater solid teak table","Dining Room","SIND-DIN-001","Teak Wood","https://images.unsplash.com/photo-1617806118233-18e1de247200"
"Modern King Size Bed Frame",65000,75000,8,"Solid timber bed with upholstered headboard","Modern Beds","SIND-BED-002","Shisham Wood","https://images.unsplash.com/photo-1616594039964-ae9021a400a0"`;

export default function ApiDocsPage() {
  const [activeTab, setActiveTab] = useState('docs'); // 'docs' | 'sandbox' | 'templates' | 'categories'
  const [codeLanguage, setCodeLanguage] = useState('curl'); // 'curl' | 'js' | 'node' | 'python' | 'php' | 'go'
  const [adminToken, setAdminToken] = useState('');
  const [showToken, setShowToken] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Sandbox State
  const [rawInput, setRawInput] = useState(JSON.stringify(SAMPLE_JSON, null, 2));
  const [parsedProducts, setParsedProducts] = useState(SAMPLE_JSON);
  const [parseError, setParseError] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  
  // Categories
  const [categories, setCategories] = useState([]);

  // Token Request Form State
  const [reqName, setReqName] = useState('');
  const [reqEmail, setReqEmail] = useState('');
  const [reqReason, setReqReason] = useState('');
  const [reqSubmitting, setReqSubmitting] = useState(false);
  const [reqFeedback, setReqFeedback] = useState(null);

  const handleTokenRequestSubmit = async (e) => {
    e.preventDefault();
    if (!reqName.trim() || !reqEmail.trim()) {
      alert('Please provide your name and email address.');
      return;
    }

    setReqSubmitting(true);
    setReqFeedback(null);

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/request-api-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: reqName.trim(),
          email: reqEmail.trim(),
          reason: reqReason.trim()
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setReqFeedback({
          type: 'success',
          message: '🎉 Token Access Request Submitted! The admin will review your request. Upon admin approval, your API Bearer Token will be emailed directly to ' + reqEmail.trim() + '.'
        });
        setReqName('');
        setReqEmail('');
        setReqReason('');
      } else {
        setReqFeedback({
          type: 'error',
          message: data.error || 'Failed to submit request.'
        });
      }
    } catch (err) {
      setReqFeedback({
        type: 'error',
        message: 'Network error: ' + err.message
      });
    } finally {
      setReqSubmitting(false);
    }
  };

  useEffect(() => {
    // Auto-detect admin session if logged in
    if (authService.isAuthenticatedWithContext()) {
      const creds = authService.getCredentials();
      if (creds.Authorization) {
        setAdminToken(creds.Authorization.replace('Bearer ', ''));
      }
      const user = authService.getCurrentUser();
      if (user) setUserRole(user.role || 'admin');
    }

    // Fetch database categories
    fetch(`${API_BASE_URL}/api/categories`)
      .then(res => res.json())
      .then(data => {
        setCategories(Array.isArray(data) ? data : data.data || []);
      })
      .catch(err => console.warn('Failed to load categories:', err));
  }, []);

  const handleInputChange = (text) => {
    setRawInput(text);
    setParseError('');
    setUploadResult(null);

    if (!text.trim()) {
      setParsedProducts([]);
      return;
    }

    try {
      if (text.trim().startsWith('[') || text.trim().startsWith('{')) {
        const parsed = JSON.parse(text);
        setParsedProducts(Array.isArray(parsed) ? parsed : [parsed]);
      } else {
        const lines = text.trim().split('\n');
        if (lines.length < 2) return;
        const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
        const list = [];
        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(',').map(v => v.trim().replace(/^"|"$/g, ''));
          if (values.length < headers.length) continue;
          const obj = {};
          headers.forEach((h, idx) => { obj[h] = values[idx]; });
          list.push(obj);
        }
        setParsedProducts(list);
      }
    } catch (err) {
      setParseError('JSON format error: ' + err.message);
      setParsedProducts([]);
    }
  };

  const handleExecuteUpload = async () => {
    if (!adminToken.trim()) {
      alert('Security Alert: You must enter a valid Admin Bearer Token to perform bulk upload.');
      return;
    }

    if (parsedProducts.length === 0) {
      alert('No valid products to upload.');
      return;
    }

    setIsUploading(true);
    setUploadResult(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/products/bulk-upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${adminToken.trim()}`,
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
          message: data.error || data.message || `HTTP ${response.status}: Unauthorized / Permission Denied.`
        });
      }
    } catch (err) {
      setUploadResult({
        success: false,
        message: 'Network error: ' + err.message
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleCopy = (str, idx) => {
    navigator.clipboard.writeText(str);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

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

  const displayToken = adminToken.trim() ? adminToken.trim() : 'YOUR_BEARER_TOKEN';

  const curlCode = `curl -X POST "${API_BASE_URL}/api/products/bulk-upload" \\
  -H "Authorization: Bearer ${displayToken}" \\
  -H "Content-Type: application/json" \\
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

  const jsFetchCode = `// JavaScript / Fetch (Browser & Node.js 18+)
async function uploadProductsBulk(productsArray) {
  try {
    const response = await fetch('${API_BASE_URL}/api/products/bulk-upload', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ${displayToken}',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ products: productsArray })
    });

    const data = await response.json();
    console.log('Bulk Upload Result:', data);
    return data;
  } catch (error) {
    console.error('Fetch Error:', error);
  }
}`;

  const nodeCode = `// Node.js (Axios) Bulk Import Script
const axios = require('axios');

async function uploadProductsBulk(productsArray) {
  try {
    const response = await axios.post('${API_BASE_URL}/api/products/bulk-upload', {
      products: productsArray
    }, {
      headers: {
        'Authorization': 'Bearer ${displayToken}',
        'Content-Type': 'application/json'
      }
    });

    console.log('Bulk Upload Result:', response.data);
  } catch (error) {
    console.error('Upload Error:', error.response ? error.response.data : error.message);
  }
}`;

  const pythonCode = `# Python (requests) Bulk Ingestion Script
import requests

url = "${API_BASE_URL}/api/products/bulk-upload"
headers = {
    "Authorization": "Bearer ${displayToken}",
    "Content-Type": "application/json"
}

payload = {
    "products": [
        {
            "name": "Solid Wood Coffee Table",
            "price": 24000,
            "category_name": "Living Room",
            "stock": 10
        }
    ]
}

response = requests.post(url, json=payload, headers=headers)
print("Status Code:", response.status_code)
print("Response:", response.json())`;

  const phpCode = `<?php
// PHP cURL Bulk Import Script
$ch = curl_init("${API_BASE_URL}/api/products/bulk-upload");
$data = array(
  "products" => array(
    array(
      "name" => "Solid Wood Coffee Table",
      "price" => 24000,
      "category_name" => "Living Room",
      "stock" => 10
    )
  )
);

curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
curl_setopt($ch, CURLOPT_HTTPHEADER, array(
  'Content-Type: application/json',
  'Authorization: Bearer ${displayToken}'
));

$response = curl_exec($ch);
curl_close($ch);
echo $response;
?>`;

  const goCode = `// Go (Golang) Bulk Import Script
package main

import (
    "bytes"
    "fmt"
    "io/ioutil"
    "net/http"
)

func main() {
    url := "${API_BASE_URL}/api/products/bulk-upload"
    var jsonStr = []byte(\`{
        "products": [
            {
                "name": "Solid Wood Coffee Table",
                "price": 24000,
                "category_name": "Living Room",
                "stock": 10
            }
        ]
    }\`)

    req, err := http.NewRequest("POST", url, bytes.NewBuffer(jsonStr))
    req.Header.Set("Authorization", "Bearer ${displayToken}")
    req.Header.Set("Content-Type", "application/json")

    client := &http.Client{}
    resp, err := client.Do(req)
    if err != nil {
        panic(err)
    }
    defer resp.Body.Close()

    body, _ := ioutil.ReadAll(resp.Body)
    fmt.Println("Response:", string(body))
}`;

  const getCodeSnippet = () => {
    switch (codeLanguage) {
      case 'js': return jsFetchCode;
      case 'node': return nodeCode;
      case 'python': return pythonCode;
      case 'php': return phpCode;
      case 'go': return goCode;
      default: return curlCode;
    }
  };

  return (
    <div className="api-docs-page-wrapper">
      
      {/* Executive Hero Banner */}
      <section className="api-docs-hero">
        <div className="api-docs-hero-inner">
          <div className="hero-kicker-pill">
            <span className="sparkle">✨</span> DEVELOPER API HUB
          </div>
          <h1 className="hero-main-title">Bulk Product Ingestion API</h1>
          <p className="hero-subline">
            Synchronize catalog items, ERP stock levels, and custom furniture product data into Sindureghari’s database in high-speed 250-item batch chunks.
          </p>

          <div className="hero-quick-meta">
            <div className="meta-pill">
              <span className="meta-label">Endpoint:</span>
              <code className="meta-endpoint">POST /api/products/bulk-upload</code>
            </div>
            <div className="meta-pill">
              <span className="meta-label">Security:</span>
              <span className="meta-auth-badge"><FaShieldAlt /> Bearer Token (Admin)</span>
            </div>
            <div className="meta-pill">
              <span className="meta-label">Chunk Speed:</span>
              <span className="meta-speed-badge"><FaServer /> 250 items/batch</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Grid Container */}
      <main className="api-docs-main-container">
        
        {/* Left Column: Navigation & Quick Actions */}
        <aside className="api-docs-sidebar">
          
          <div className="sidebar-widget nav-widget">
            <h3 className="widget-title">Documentation Menu</h3>
            <div className="nav-buttons-list">
              <button 
                className={`nav-item-btn ${activeTab === 'docs' ? 'active' : ''}`}
                onClick={() => setActiveTab('docs')}
              >
                <FaFileCode className="btn-icon" /> Endpoint Reference
              </button>
              <button 
                className={`nav-item-btn ${activeTab === 'sandbox' ? 'active' : ''}`}
                onClick={() => setActiveTab('sandbox')}
              >
                <FaTerminal className="btn-icon" /> Testing Sandbox
              </button>
              <button 
                className={`nav-item-btn ${activeTab === 'templates' ? 'active' : ''}`}
                onClick={() => setActiveTab('templates')}
              >
                <FaDownload className="btn-icon" /> Templates & CSVs
              </button>
              <button 
                className={`nav-item-btn ${activeTab === 'categories' ? 'active' : ''}`}
                onClick={() => setActiveTab('categories')}
              >
                <FaTags className="btn-icon" /> Database Categories
              </button>
              <button 
                className={`nav-item-btn ${activeTab === 'blanxer' ? 'active' : ''}`}
                onClick={() => setActiveTab('blanxer')}
                style={{ color: '#b08a2e', fontWeight: 800 }}
              >
                <FaServer className="btn-icon" /> ⚡ Blanxer.com Integration
              </button>
            </div>
          </div>

          {/* Security Card */}
          <div className="sidebar-widget security-card-widget">
            <div className="sec-card-header">
              <FaLock className="lock-icon" />
              <h4>Admin Token Security</h4>
            </div>
            <p>
              To protect database integrity, the bulk upload endpoint requires an authenticated Admin Bearer token header.
            </p>
            {authService.isAuthenticatedWithContext() ? (
              <div className="auth-status-badge active">
                <FaCheckCircle /> Session Active (Role: {userRole || 'Admin'})
              </div>
            ) : (
              <Link href="/login" className="btn-login-small">
                Admin Login to Test
              </Link>
            )}
          </div>

          {/* Quick Admin Navigation */}
          <div className="sidebar-widget admin-link-widget">
            <h4>Admin Tools</h4>
            <p>Access the full administrative dashboard to manage orders, inventory, and users.</p>
            <Link href="/admin" className="btn-open-dashboard">
              <FaBox /> Open Admin Panel <FaExternalLinkAlt className="ext-icon" />
            </Link>
          </div>

        </aside>

        {/* Right Column: Documentation Content Panel */}
        <article className="api-docs-content-panel">

          {/* Security Banner */}
          <div className="security-banner">
            <div className="banner-icon"><FaLock /></div>
            <div className="banner-text">
              <strong>Security Protocol: Bearer Token & Admin Approval Enforced</strong>
              <p>
                All bulk product upload requests require an Admin-approved Bearer Token header (<code>Authorization: Bearer &lt;TOKEN&gt;</code>). Tokens are issued via email only after explicit Admin approval.
              </p>
            </div>
          </div>

          {/* Copy Backend API Full Base URL & Endpoints Section */}
          <section className="docs-panel-section" style={{ background: '#faf6f0', border: '1px solid rgba(156, 90, 51, 0.25)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '16.5px', color: '#1c120c', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800 }}>
                  <FaServer style={{ color: '#9c5a33' }} /> Backend API Base URL & Endpoint Reference
                </h3>
                <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#6b5545' }}>
                  Quickly copy full API base URLs and endpoints for cURL, Postman collections, or environment configuration.
                </p>
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <button 
                  onClick={() => handleCopy(API_BASE_URL, 'base_url')}
                  style={{ background: '#1c120c', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  {copiedIndex === 'base_url' ? <><FaCheck /> Base URL Copied!</> : <><FaCopy /> Copy API Base URL</>}
                </button>
                <button 
                  onClick={() => handleCopy(`${API_BASE_URL}/api/products/bulk-upload`, 'bulk_endpoint')}
                  style={{ background: '#9c5a33', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  {copiedIndex === 'bulk_endpoint' ? <><FaCheck /> Endpoint Copied!</> : <><FaCopy /> Copy Bulk Upload URL</>}
                </button>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))', gap: '10px', marginTop: '14px' }}>
              <div style={{ background: '#fff', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(156, 90, 51, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ minWidth: 0, overflow: 'hidden' }}>
                  <small style={{ display: 'block', color: '#64748b', fontSize: '10.5px', fontWeight: 800 }}>BULK UPLOAD API</small>
                  <code style={{ fontSize: '12px', color: '#16a34a', fontWeight: 700 }}>POST {API_BASE_URL}/api/products/bulk-upload</code>
                </div>
                <button onClick={() => handleCopy(`${API_BASE_URL}/api/products/bulk-upload`, 'ep1')} style={{ background: 'none', border: 'none', color: '#9c5a33', cursor: 'pointer', padding: '4px' }} title="Copy URL">
                  {copiedIndex === 'ep1' ? <FaCheck style={{ color: '#16a34a' }} /> : <FaCopy />}
                </button>
              </div>

              <div style={{ background: '#fff', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(156, 90, 51, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ minWidth: 0, overflow: 'hidden' }}>
                  <small style={{ display: 'block', color: '#64748b', fontSize: '10.5px', fontWeight: 800 }}>PENDING APPROVALS</small>
                  <code style={{ fontSize: '12px', color: '#2563eb', fontWeight: 700 }}>GET {API_BASE_URL}/api/products/pending-approvals</code>
                </div>
                <button onClick={() => handleCopy(`${API_BASE_URL}/api/products/pending-approvals`, 'ep2')} style={{ background: 'none', border: 'none', color: '#9c5a33', cursor: 'pointer', padding: '4px' }} title="Copy URL">
                  {copiedIndex === 'ep2' ? <FaCheck style={{ color: '#16a34a' }} /> : <FaCopy />}
                </button>
              </div>

              <div style={{ background: '#fff', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(156, 90, 51, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ minWidth: 0, overflow: 'hidden' }}>
                  <small style={{ display: 'block', color: '#64748b', fontSize: '10.5px', fontWeight: 800 }}>CATALOG PRODUCTS</small>
                  <code style={{ fontSize: '12px', color: '#2563eb', fontWeight: 700 }}>GET {API_BASE_URL}/api/products</code>
                </div>
                <button onClick={() => handleCopy(`${API_BASE_URL}/api/products`, 'ep3')} style={{ background: 'none', border: 'none', color: '#9c5a33', cursor: 'pointer', padding: '4px' }} title="Copy URL">
                  {copiedIndex === 'ep3' ? <FaCheck style={{ color: '#16a34a' }} /> : <FaCopy />}
                </button>
              </div>

              <div style={{ background: '#fff', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(156, 90, 51, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ minWidth: 0, overflow: 'hidden' }}>
                  <small style={{ display: 'block', color: '#64748b', fontSize: '10.5px', fontWeight: 800 }}>CATEGORIES REFERENCE</small>
                  <code style={{ fontSize: '12px', color: '#2563eb', fontWeight: 700 }}>GET {API_BASE_URL}/api/categories</code>
                </div>
                <button onClick={() => handleCopy(`${API_BASE_URL}/api/categories`, 'ep4')} style={{ background: 'none', border: 'none', color: '#9c5a33', cursor: 'pointer', padding: '4px' }} title="Copy URL">
                  {copiedIndex === 'ep4' ? <FaCheck style={{ color: '#16a34a' }} /> : <FaCopy />}
                </button>
              </div>
            </div>
          </section>

          {/* Request API Token Form Card */}
          <section className="docs-panel-section request-token-section" style={{ borderLeft: '4px solid #9c5a33', background: '#fffcf7' }}>
            <h3 className="section-h3" style={{ marginTop: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FaKey style={{ color: '#9c5a33' }} /> Request API Token Access (Requires Admin Approval)
            </h3>
            <p className="section-lead" style={{ fontSize: '13.5px' }}>
              Need an API Bearer token for ERP integration or mass catalog uploads? Submit your details below. Once approved by the Admin, your token will be generated and emailed directly to your inbox.
            </p>

            <form onSubmit={handleTokenRequestSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginTop: '6px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#1c120c', display: 'block', marginBottom: '4px' }}>
                  Applicant Full Name *
                </label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. John Doe"
                  value={reqName}
                  onChange={(e) => setReqName(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#1c120c', display: 'block', marginBottom: '4px' }}>
                  Email Address (Token will be sent here) *
                </label>
                <input 
                  type="email" 
                  required
                  placeholder="e.g. developer@company.com"
                  value={reqEmail}
                  onChange={(e) => setReqEmail(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#1c120c', display: 'block', marginBottom: '4px' }}>
                  Reason / Usage Description
                </label>
                <input 
                  type="text" 
                  placeholder="e.g. Syncing 500+ wooden furniture products from local ERP catalog"
                  value={reqReason}
                  onChange={(e) => setReqReason(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '6px' }}>
                <button 
                  type="submit" 
                  disabled={reqSubmitting}
                  style={{ 
                    background: 'linear-gradient(135deg, #b87333 0%, #9c5a33 100%)', 
                    color: '#ffffff', 
                    padding: '10px 22px', 
                    borderRadius: '8px', 
                    border: 'none', 
                    fontWeight: 700, 
                    fontSize: '13px',
                    cursor: reqSubmitting ? 'not-allowed' : 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  {reqSubmitting ? <><FaSync className="spin" /> Submitting Request...</> : <><FaKey /> Submit API Access Request</>}
                </button>
              </div>
            </form>

            {reqFeedback && (
              <div 
                style={{ 
                  marginTop: '12px', 
                  padding: '12px 16px', 
                  borderRadius: '8px', 
                  fontSize: '13px', 
                  lineHeight: '1.5',
                  background: reqFeedback.type === 'success' ? '#f0fdf4' : '#fef2f2',
                  border: reqFeedback.type === 'success' ? '1px solid #bbf7d0' : '1px solid #fecaca',
                  color: reqFeedback.type === 'success' ? '#166534' : '#991b1b'
                }}
              >
                {reqFeedback.message}
              </div>
            )}
          </section>

          {/* TAB 1: ENDPOINT SPECIFICATION */}
          {activeTab === 'docs' && (
            <section className="docs-panel-section">
              <div className="section-title-bar">
                <span className="http-badge post">POST</span>
                <h2>/api/products/bulk-upload</h2>
              </div>
              <p className="section-lead">
                Ingests single products or large arrays of products into the database. Category names are automatically resolved and mapped to internal database category IDs.
              </p>

              <h3 className="section-h3">Request Headers</h3>
              <div className="table-responsive-box">
                <table className="api-spec-table">
                  <thead>
                    <tr>
                      <th>Header</th>
                      <th>Type</th>
                      <th>Status</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><code>Authorization</code></td>
                      <td>String</td>
                      <td><span className="badge-req">Required</span></td>
                      <td>Format: <code>Bearer &lt;YOUR_ADMIN_JWT_TOKEN&gt;</code></td>
                    </tr>
                    <tr>
                      <td><code>Content-Type</code></td>
                      <td>String</td>
                      <td><span className="badge-req">Required</span></td>
                      <td>Must be <code>application/json</code></td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3 className="section-h3">Request Body Schema</h3>
              <div className="table-responsive-box">
                <table className="api-spec-table">
                  <thead>
                    <tr>
                      <th>Field</th>
                      <th>Type</th>
                      <th>Status</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><code>name</code> / <code>title</code></td>
                      <td>String</td>
                      <td><span className="badge-req">Required</span></td>
                      <td>Product name or title</td>
                    </tr>
                    <tr>
                      <td><code>price</code> / <code>new_price</code></td>
                      <td>Number</td>
                      <td><span className="badge-req">Required</span></td>
                      <td>Selling price in NPR</td>
                    </tr>
                    <tr>
                      <td><code>category_name</code> / <code>categoryId</code></td>
                      <td>String/Number</td>
                      <td><span className="badge-opt">Optional</span></td>
                      <td>Auto-matches active database categories by Name, Slug, or ID</td>
                    </tr>
                    <tr>
                      <td><code>old_price</code> / <code>discount_price</code></td>
                      <td>Number</td>
                      <td><span className="badge-opt">Optional</span></td>
                      <td>Original price before discount</td>
                    </tr>
                    <tr>
                      <td><code>stock</code></td>
                      <td>Number</td>
                      <td><span className="badge-opt">Optional</span></td>
                      <td>Inventory count (default: 0)</td>
                    </tr>
                    <tr>
                      <td><code>wooden_type</code></td>
                      <td>String</td>
                      <td><span className="badge-opt">Optional</span></td>
                      <td>e.g. Teak Wood, Sisau Wood, Sal Wood</td>
                    </tr>
                    <tr>
                      <td><code>sku</code></td>
                      <td>String</td>
                      <td><span className="badge-opt">Optional</span></td>
                      <td>Unique SKU (auto-generated if omitted)</td>
                    </tr>
                    <tr>
                      <td><code>images</code></td>
                      <td>Array[String]</td>
                      <td><span className="badge-opt">Optional</span></td>
                      <td>Array of image URLs</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Code Snippets Section */}
              <h3 className="section-h3">Client Code Integration Snippets</h3>
              <div className="code-snippets-wrapper">
                <div className="code-tabs-header">
                  <div className="lang-tabs">
                    <button className={`lang-tab ${codeLanguage === 'curl' ? 'active' : ''}`} onClick={() => setCodeLanguage('curl')}>cURL</button>
                    <button className={`lang-tab ${codeLanguage === 'js' ? 'active' : ''}`} onClick={() => setCodeLanguage('js')}>JS (Fetch)</button>
                    <button className={`lang-tab ${codeLanguage === 'node' ? 'active' : ''}`} onClick={() => setCodeLanguage('node')}>Node.js</button>
                    <button className={`lang-tab ${codeLanguage === 'python' ? 'active' : ''}`} onClick={() => setCodeLanguage('python')}>Python</button>
                    <button className={`lang-tab ${codeLanguage === 'php' ? 'active' : ''}`} onClick={() => setCodeLanguage('php')}>PHP</button>
                    <button className={`lang-tab ${codeLanguage === 'go' ? 'active' : ''}`} onClick={() => setCodeLanguage('go')}>Go</button>
                  </div>

                  <button className="btn-copy-code" onClick={() => handleCopy(getCodeSnippet(), 10)}>
                    {copiedIndex === 10 ? <><FaCheck /> Copied!</> : <><FaCopy /> Copy Code</>}
                  </button>
                </div>

                <div className="code-display-box">
                  <pre><code>{getCodeSnippet()}</code></pre>
                </div>
              </div>

            </section>
          )}

          {/* TAB 2: INTERACTIVE TESTING SANDBOX */}
          {activeTab === 'sandbox' && (
            <section className="docs-panel-section">
              <h2 className="panel-h2"><FaTerminal /> Interactive API Sandbox</h2>
              <p className="panel-p">Test live batch product ingestion directly against the server endpoint.</p>

              {/* Admin Token Security Input */}
              <div className="sandbox-token-card">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                  <label style={{ margin: 0 }}><FaKey /> Admin / Developer Bearer Token:</label>
                  {authService.isAuthenticatedWithContext() && (
                    <button 
                      type="button"
                      onClick={() => {
                        const creds = authService.getCredentials();
                        if (creds.Authorization) {
                          setAdminToken(creds.Authorization.replace('Bearer ', ''));
                        }
                      }}
                      style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#15803d', fontSize: '11px', fontWeight: 800, padding: '4px 10px', borderRadius: '6px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                    >
                      <FaCheckCircle /> Auto-Fill Active Admin Session Token
                    </button>
                  )}
                </div>

                <div style={{ position: 'relative', display: 'flex', alignItems: 'center', marginTop: '4px' }}>
                  <input 
                    type={showToken ? 'text' : 'password'} 
                    placeholder="Paste your Admin Bearer Token here..."
                    value={adminToken}
                    onChange={(e) => setAdminToken(e.target.value)}
                    style={{ paddingRight: '75px' }}
                  />
                  <button 
                    type="button"
                    onClick={() => setShowToken(!showToken)}
                    style={{ position: 'absolute', right: '42px', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '14px', padding: '4px' }}
                    title={showToken ? 'Hide Token' : 'Show Token'}
                  >
                    {showToken ? <FaEyeSlash /> : <FaEye />}
                  </button>
                  {adminToken && (
                    <button 
                      type="button"
                      onClick={() => handleCopy(adminToken, 'sandbox_token')}
                      style={{ position: 'absolute', right: '12px', background: 'none', border: 'none', color: '#9c5a33', cursor: 'pointer', fontSize: '14px', padding: '4px' }}
                      title="Copy Token"
                    >
                      {copiedIndex === 'sandbox_token' ? <FaCheck style={{ color: '#16a34a' }} /> : <FaCopy />}
                    </button>
                  )}
                </div>

                {!adminToken ? (
                  <small className="warn-text">
                    <FaExclamationTriangle /> No token provided. Enter your Bearer Token or request access above to test endpoint requests.
                  </small>
                ) : (
                  <small className="success-text">
                    <FaCheckCircle /> Bearer token loaded. Code snippets and live testing sandbox automatically use this token.
                  </small>
                )}
              </div>

              <div className="sandbox-grid-container">
                <div className="sandbox-card">
                  <h3>Payload JSON / CSV Input</h3>
                  <textarea 
                    className="sandbox-textarea"
                    rows={12}
                    value={rawInput}
                    onChange={(e) => handleInputChange(e.target.value)}
                  />
                  {parseError && <div className="parse-error">{parseError}</div>}
                </div>

                <div className="sandbox-card">
                  <h3>Execution Control & Response</h3>
                  <div className="batch-status-row">
                    <span>Parsed Rows: <strong>{parsedProducts.length}</strong></span>
                    <span>Chunk Size: <strong>250/batch</strong></span>
                  </div>

                  <button 
                    className="btn-execute-test"
                    disabled={parsedProducts.length === 0 || isUploading}
                    onClick={handleExecuteUpload}
                  >
                    {isUploading ? <><FaSync className="spin" /> Executing Bulk Upload...</> : <><FaCloudUploadAlt /> Execute Live Request ({parsedProducts.length} Items)</>}
                  </button>

                  {uploadResult && (
                    <div className={`response-output ${uploadResult.success ? 'success' : 'error'}`}>
                      <h4>Response Status: {uploadResult.success ? '201 Created' : 'Error'}</h4>
                      <pre><code>{JSON.stringify(uploadResult, null, 2)}</code></pre>
                    </div>
                  )}
                </div>
              </div>
            </section>
          )}

          {/* TAB 3: TEMPLATES & DOWNLOADS */}
          {activeTab === 'templates' && (
            <section className="docs-panel-section">
              <h2 className="panel-h2"><FaDownload /> Downloadable Bulk Templates</h2>
              <p className="panel-p">Download pre-formatted sample files to quickly prepare your inventory uploads.</p>

              <div className="template-cards-grid">
                <div className="tmpl-download-card">
                  <div className="tmpl-card-header">
                    <FaFileCode className="tmpl-icon json" />
                    <div>
                      <h3>JSON Bulk Template</h3>
                      <p>Standard JSON array format supporting nested image arrays and custom fields.</p>
                    </div>
                  </div>
                  <button 
                    className="btn-download-action"
                    onClick={() => downloadFile('products_bulk_template.json', JSON.stringify(SAMPLE_JSON, null, 2), 'application/json')}
                  >
                    <FaDownload /> Download JSON Template
                  </button>
                </div>

                <div className="tmpl-download-card">
                  <div className="tmpl-card-header">
                    <FaFileCsv className="tmpl-icon csv" />
                    <div>
                      <h3>CSV Spreadsheet Template</h3>
                      <p>CSV format compatible with Microsoft Excel, Google Sheets, or ERP exports.</p>
                    </div>
                  </div>
                  <button 
                    className="btn-download-action"
                    onClick={() => downloadFile('products_bulk_template.csv', SAMPLE_CSV, 'text/csv')}
                  >
                    <FaDownload /> Download CSV Template
                  </button>
                </div>
              </div>
            </section>
          )}

          {/* TAB 4: CATEGORIES REFERENCE */}
          {(activeTab === 'categories' || activeTab === 'templates') && (
            <section className="docs-panel-section">
              <h2 className="panel-h2"><FaTags /> Active Database Categories Reference</h2>
              <p className="panel-p">Use any of these category names or slugs in your upload files for automatic category assignment.</p>

              <div className="categories-grid-cards">
                {categories.map((cat) => (
                  <div className="cat-reference-card" key={cat.id}>
                    <div className="cat-card-top">
                      <span className="cat-id-badge">ID: {cat.id}</span>
                      <strong className="cat-name">{cat.name}</strong>
                    </div>
                    <code className="cat-slug-code">slug: "{cat.slug}"</code>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* TAB 5: BLANXER.COM AGENCY INTEGRATION */}
          {activeTab === 'blanxer' && (
            <section className="docs-panel-section" style={{ borderLeft: '4px solid #b08a2e' }}>
              <div className="section-title-bar">
                <span className="http-badge post" style={{ background: '#b08a2e' }}>BLANXER AGENCY</span>
                <h2>Blanxer.com Store Sync & Data Analytics Integration</h2>
              </div>
              <p className="section-lead">
                Official API specifications for partner agency <strong>Blanxer.com</strong> to sync product inventory, live stock availability, and catalog analytics into external agency storefronts.
              </p>

              <div style={{ background: '#fffdf5', border: '1px solid rgba(212,175,55,0.3)', padding: '18px', borderRadius: '12px' }}>
                <h3 style={{ margin: '0 0 6px', color: '#87661c', fontSize: '15px' }}>⚡ Step 1: Request Agency Access Token</h3>
                <p style={{ margin: 0, fontSize: '13px', color: '#5c483a' }}>
                  Blanxer developers should submit an access request using the <strong>Request API Token Access</strong> form above with email <code>developer@blanxer.com</code>. Once approved by the Admin, your dedicated Bearer token will be issued.
                </p>
              </div>

              {/* Dedicated vs Shared Token Callout */}
              <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '16px', borderRadius: '12px', marginTop: '12px' }}>
                <h4 style={{ margin: '0 0 4px', color: '#166534', fontSize: '14px', fontWeight: 800 }}>💡 Do you need a separate token for Blanxer.com?</h4>
                <p style={{ margin: 0, fontSize: '13px', color: '#15803d', lineHeight: '1.5' }}>
                  <strong>Architecture Note:</strong> The underlying authentication system uses standard JWT Bearer Tokens (<code>Authorization: Bearer &lt;TOKEN&gt;</code>) for all bulk uploads. While a single admin token technically works everywhere, issuing a <strong>separate token tagged specifically for Blanxer</strong> is strongly recommended for security isolation (independent revocation) and audit logging in the Pending Approvals dashboard.
                </p>
              </div>

              <h3 className="section-h3">1. Live Product & Stock Feed Endpoint</h3>
              <p className="section-lead" style={{ fontSize: '13.5px' }}>
                Blanxer can poll this cached endpoint to fetch live product details, stock counts, prices, and images for store displays and sales analytics:
              </p>
              <div className="code-snippets-wrapper">
                <div className="code-tabs-header">
                  <span>GET /api/products/external-feed</span>
                  <button className="btn-copy-code" onClick={() => handleCopy(`${API_BASE_URL}/api/products/external-feed`, 99)}>
                    {copiedIndex === 99 ? <><FaCheck /> Copied!</> : <><FaCopy /> Copy Endpoint URL</>}
                  </button>
                </div>
                <div className="code-display-box">
                  <pre><code>{`curl -X GET "${API_BASE_URL}/api/products/external-feed"`}</code></pre>
                </div>
              </div>

              <h3 className="section-h3">2. Bulk Product Upload & Inventory Sync</h3>
              <p className="section-lead" style={{ fontSize: '13.5px' }}>
                To push new inventory or updated price changes back to Sindureghari Furniture, execute chunked batch uploads with your approved Bearer token:
              </p>
              <div className="code-snippets-wrapper">
                <div className="code-tabs-header">
                  <span>POST /api/products/bulk-upload</span>
                </div>
                <div className="code-display-box">
                  <pre><code>{`curl -X POST "${API_BASE_URL}/api/products/bulk-upload" \\
  -H "Authorization: Bearer <APPROVED_BLANXER_TOKEN>" \\
  -H "Content-Type: application/json" \\
  -d '{
    "products": [
      {
        "name": "Luxury Solid Teak Bed",
        "price": 72000,
        "category_name": "Modern Beds",
        "stock": 5
      }
    ]
  }'`}</code></pre>
                </div>
              </div>
            </section>
          )}

        </article>
      </main>
    </div>
  );
}
