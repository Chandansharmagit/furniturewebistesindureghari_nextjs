import React, { useState } from 'react';
import { MdClose, MdEmail, MdSend } from 'react-icons/md';
import { API_BASE_URL } from '../../../config/api';
import authService from '../../../services/authService';

const ReplyEmailModal = ({ isOpen, onClose, to, defaultSubject, referenceType, referenceId, onReplySuccess }) => {
  const [subject, setSubject] = useState(defaultSubject || 'Response from Sindureghari Furniture');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) {
      setError('Message content is required');
      return;
    }

    try {
      setSending(true);
      setError('');
      setSuccess('');
      
      const credentials = authService.getCredentials();
      const response = await fetch(`${API_BASE_URL}/api/customer-data/reply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...credentials
        },
        body: JSON.stringify({
          to,
          subject,
          message,
          referenceType,
          referenceId
        })
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setSuccess('Reply email sent successfully!');
        setMessage('');
        if (onReplySuccess) onReplySuccess(message);
        setTimeout(() => {
          onClose();
          setSuccess('');
        }, 1500);
      } else {
        setError(data.error || 'Failed to send reply email');
      }
    } catch (err) {
      console.error('Send reply error:', err);
      setError('An error occurred while sending the email');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="reply-modal-overlay" onClick={onClose}>
      <div className="reply-modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="reply-modal-header">
          <div className="title-area">
            <MdEmail className="header-icon" />
            <h3>Send Email Reply</h3>
          </div>
          <button className="close-btn" onClick={onClose} aria-label="Close modal">
            <MdClose />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="reply-modal-form">
          {error && <div className="reply-alert reply-alert-error">{error}</div>}
          {success && <div className="reply-alert reply-alert-success">{success}</div>}

          <div className="form-group-royal">
            <label>To:</label>
            <input type="email" value={to} disabled className="disabled-input" />
          </div>

          <div className="form-group-royal">
            <label>Subject:</label>
            <input 
              type="text" 
              value={subject} 
              onChange={(e) => setSubject(e.target.value)} 
              required 
            />
          </div>

          <div className="form-group-royal">
            <label>Message Reply:</label>
            <textarea 
              rows={6} 
              value={message} 
              onChange={(e) => setMessage(e.target.value)} 
              placeholder="Write your email response here..."
              required
            />
          </div>

          <div className="reply-modal-actions">
            <button type="button" className="btn-outline" onClick={onClose} disabled={sending}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={sending}>
              {sending ? 'Sending...' : <><MdSend /> Send Reply</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReplyEmailModal;
