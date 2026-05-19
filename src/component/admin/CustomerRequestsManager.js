import React, { useState, useEffect, useCallback } from 'react';
import { 
  FaSearch, 
  FaEye, 
  FaReply, 
  FaCheck, 
  FaTimes, 
  FaFilter,
  FaDownload,
  FaStar,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaCalendar,
  FaImage,
  FaComment
} from 'react-icons/fa';
import './CustomerRequestsManager.css';

const CustomerRequestsManager = () => {
  const [activeTab, setActiveTab] = useState('orders');
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [replyText, setReplyText] = useState('');

  // Mock data - replace with actual API calls
  const mockOrderRequests = [
    {
      id: 1,
      type: 'order',
      customerName: 'John Doe',
      email: 'john@example.com',
      phone: '+1234567890',
      furnitureType: 'sofa',
      description: 'Looking for a modern 3-seater sofa in gray color',
      budget: '$1000-1500',
      timeline: '2-3 weeks',
      images: ['image1.jpg', 'image2.jpg'],
      status: 'pending',
      priority: 'high',
      timestamp: '2024-01-15T10:30:00Z',
      isRead: false
    },
    {
      id: 2,
      type: 'order',
      customerName: 'Jane Smith',
      email: 'jane@example.com',
      phone: '+1234567891',
      furnitureType: 'dining-table',
      description: 'Need a wooden dining table for 6 people',
      budget: '$800-1200',
      timeline: '1-2 weeks',
      images: ['image3.jpg'],
      status: 'in-progress',
      priority: 'medium',
      timestamp: '2024-01-14T15:45:00Z',
      isRead: true
    }
  ];

  const mockContactRequests = [
    {
      id: 3,
      type: 'contact',
      customerName: 'Mike Johnson',
      email: 'mike@example.com',
      phone: '+1234567892',
      subject: 'Delivery Inquiry',
      message: 'When will my order be delivered?',
      status: 'pending',
      priority: 'medium',
      timestamp: '2024-01-15T09:15:00Z',
      isRead: false
    }
  ];

  const mockFeedbackRequests = [
    {
      id: 4,
      type: 'feedback',
      customerName: 'Sarah Wilson',
      email: 'sarah@example.com',
      rating: 5,
      feedbackType: 'product-quality',
      subject: 'Excellent Service',
      message: 'Very satisfied with the quality and service',
      suggestions: 'Keep up the good work!',
      wouldRecommend: 'definitely',
      status: 'pending',
      priority: 'low',
      timestamp: '2024-01-14T12:20:00Z',
      isRead: false
    }
  ];

  const loadRequests = useCallback(() => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      let data = [];
      switch (activeTab) {
        case 'orders':
          data = mockOrderRequests;
          break;
        case 'contacts':
          data = mockContactRequests;
          break;
        case 'feedback':
          data = mockFeedbackRequests;
          break;
        default:
          data = [...mockOrderRequests, ...mockContactRequests, ...mockFeedbackRequests];
      }
      
      // Apply filters
      if (statusFilter !== 'all') {
        data = data.filter(item => item.status === statusFilter);
      }
      if (priorityFilter !== 'all') {
        data = data.filter(item => item.priority === priorityFilter);
      }
      if (searchTerm) {
        data = data.filter(item => 
          item.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (item.subject && item.subject.toLowerCase().includes(searchTerm.toLowerCase()))
        );
      }
      
      setRequests(data);
      setLoading(false);
    }, 1000);
  }, [activeTab, statusFilter, priorityFilter, searchTerm]);

  useEffect(() => {
    loadRequests();
  }, [loadRequests]);

  const handleStatusChange = (requestId, newStatus) => {
    setRequests(prev => prev.map(req => 
      req.id === requestId ? { ...req, status: newStatus } : req
    ));
  };

  const handleMarkAsRead = (requestId) => {
    setRequests(prev => prev.map(req => 
      req.id === requestId ? { ...req, isRead: true } : req
    ));
  };

  const handleViewDetails = (request) => {
    setSelectedRequest(request);
    setShowModal(true);
    handleMarkAsRead(request.id);
  };

  const handleReply = () => {
    if (replyText.trim()) {
      // Simulate sending reply
      alert(`Reply sent to ${selectedRequest.customerName}: ${replyText}`);
      setReplyText('');
      setShowModal(false);
      handleStatusChange(selectedRequest.id, 'replied');
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: '#ff9800', text: 'Pending' },
      'in-progress': { color: '#2196f3', text: 'In Progress' },
      completed: { color: '#4caf50', text: 'Completed' },
      replied: { color: '#9c27b0', text: 'Replied' },
      cancelled: { color: '#f44336', text: 'Cancelled' }
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    return (
      <span 
        className="status-badge" 
        style={{ backgroundColor: config.color }}
      >
        {config.text}
      </span>
    );
  };

  const getPriorityBadge = (priority) => {
    const priorityConfig = {
      high: { color: '#f44336', text: 'High' },
      medium: { color: '#ff9800', text: 'Medium' },
      low: { color: '#4caf50', text: 'Low' }
    };
    
    const config = priorityConfig[priority] || priorityConfig.medium;
    return (
      <span 
        className="priority-badge" 
        style={{ backgroundColor: config.color }}
      >
        {config.text}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const exportData = () => {
    const dataStr = JSON.stringify(requests, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${activeTab}-requests-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  return (
    <div className="customer-requests-manager">
      <div className="manager-header">
        <h2>Customer Requests Management</h2>
      </div>

      <div className="manager-tabs">
        <button 
          className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          Order Requests
        </button>
        <button 
          className={`tab-btn ${activeTab === 'contacts' ? 'active' : ''}`}
          onClick={() => setActiveTab('contacts')}
        >
          Contact Messages
        </button>
        <button 
          className={`tab-btn ${activeTab === 'feedback' ? 'active' : ''}`}
          onClick={() => setActiveTab('feedback')}
        >
          Feedback
        </button>
      </div>

      <div className="manager-controls">
        <div className="search-box">
          <FaSearch />
          <input
            type="text"
            placeholder="Search by name, email, or subject..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filters">
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="replied">Replied</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <select 
            value={priorityFilter} 
            onChange={(e) => setPriorityFilter(e.target.value)}
          >
            <option value="all">All Priority</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          <button className="export-btn" onClick={exportData}>
            <FaDownload /> Export
          </button>
        </div>
      </div>

      <div className="requests-list">
        {loading ? (
          <div className="loading-spinner">Loading...</div>
        ) : requests.length === 0 ? (
          <div className="no-requests">No requests found</div>
        ) : (
          requests.map(request => (
            <div 
              key={request.id} 
              className={`request-card ${!request.isRead ? 'unread' : ''}`}
            >
              <div className="request-header">
                <div className="customer-info">
                  <FaUser />
                  <span className="customer-name">{request.customerName}</span>
                  {!request.isRead && <span className="unread-indicator">NEW</span>}
                </div>
                <div className="request-meta">
                  {getStatusBadge(request.status)}
                  {getPriorityBadge(request.priority)}
                </div>
              </div>

              <div className="request-content">
                <div className="contact-details">
                  <span><FaEnvelope /> {request.email}</span>
                  {request.phone && <span><FaPhone /> {request.phone}</span>}
                  <span><FaCalendar /> {formatDate(request.timestamp)}</span>
                </div>

                {request.type === 'order' && (
                  <div className="order-details">
                    <p><strong>Furniture Type:</strong> {request.furnitureType}</p>
                    <p><strong>Budget:</strong> {request.budget}</p>
                    <p><strong>Timeline:</strong> {request.timeline}</p>
                    <p><strong>Description:</strong> {request.description}</p>
                    {request.images && request.images.length > 0 && (
                      <p><FaImage /> {request.images.length} image(s) attached</p>
                    )}
                  </div>
                )}

                {request.type === 'contact' && (
                  <div className="contact-details">
                    <p><strong>Subject:</strong> {request.subject}</p>
                    <p><strong>Message:</strong> {request.message}</p>
                  </div>
                )}

                {request.type === 'feedback' && (
                  <div className="feedback-details">
                    <p><strong>Rating:</strong> 
                      {[...Array(5)].map((_, i) => (
                        <FaStar 
                          key={i} 
                          className={i < request.rating ? 'star-filled' : 'star-empty'} 
                        />
                      ))}
                    </p>
                    <p><strong>Type:</strong> {request.feedbackType}</p>
                    <p><strong>Subject:</strong> {request.subject}</p>
                    <p><strong>Message:</strong> {request.message}</p>
                  </div>
                )}
              </div>

              <div className="request-actions">
                <button 
                  className="action-btn view-btn"
                  onClick={() => handleViewDetails(request)}
                >
                  <FaEye /> View Details
                </button>
                
                <button 
                  className="action-btn reply-btn"
                  onClick={() => handleViewDetails(request)}
                >
                  <FaReply /> Reply
                </button>

                <select 
                  value={request.status}
                  onChange={(e) => handleStatusChange(request.id, e.target.value)}
                  className="status-select"
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="replied">Replied</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal for viewing details and replying */}
      {showModal && selectedRequest && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Request Details</h3>
              <button 
                className="close-btn"
                onClick={() => setShowModal(false)}
              >
                <FaTimes />
              </button>
            </div>

            <div className="modal-body">
              <div className="request-full-details">
                <h4>Customer Information</h4>
                <p><strong>Name:</strong> {selectedRequest.customerName}</p>
                <p><strong>Email:</strong> {selectedRequest.email}</p>
                {selectedRequest.phone && (
                  <p><strong>Phone:</strong> {selectedRequest.phone}</p>
                )}
                <p><strong>Date:</strong> {formatDate(selectedRequest.timestamp)}</p>

                {selectedRequest.type === 'order' && (
                  <>
                    <h4>Order Details</h4>
                    <p><strong>Furniture Type:</strong> {selectedRequest.furnitureType}</p>
                    <p><strong>Description:</strong> {selectedRequest.description}</p>
                    <p><strong>Budget:</strong> {selectedRequest.budget}</p>
                    <p><strong>Timeline:</strong> {selectedRequest.timeline}</p>
                    {selectedRequest.images && selectedRequest.images.length > 0 && (
                      <div>
                        <strong>Attached Images:</strong>
                        <div className="image-list">
                          {selectedRequest.images.map((image, index) => (
                            <span key={index} className="image-item">{image}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}

                {selectedRequest.type === 'feedback' && (
                  <>
                    <h4>Feedback Details</h4>
                    <p><strong>Rating:</strong> {selectedRequest.rating}/5 stars</p>
                    <p><strong>Type:</strong> {selectedRequest.feedbackType}</p>
                    <p><strong>Would Recommend:</strong> {selectedRequest.wouldRecommend}</p>
                    {selectedRequest.suggestions && (
                      <p><strong>Suggestions:</strong> {selectedRequest.suggestions}</p>
                    )}
                  </>
                )}
              </div>

              <div className="reply-section">
                <h4>Send Reply</h4>
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type your reply here..."
                  rows="4"
                />
                <button 
                  className="send-reply-btn"
                  onClick={handleReply}
                  disabled={!replyText.trim()}
                >
                  <FaReply /> Send Reply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerRequestsManager;