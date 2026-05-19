import React from 'react';
import { FaPhone, FaCommentDots, FaShoppingCart } from 'react-icons/fa';

const SubmissionsTab = ({ 
  contactSubmissions, 
  feedbackSubmissions, 
  orderRequestSubmissions 
}) => {
  return (
    <div className="pu-tab-content-royal">
      <div className="pu-section-header-royal">
        <div className="header-main">
          <h2>Customer Inquiries & Submissions</h2>
          <p>Review contact forms, feedback, and custom order requests</p>
        </div>
      </div>

      <div className="pu-submissions-grid-royal">
        {/* Contact Submissions */}
        <div className="pu-submission-section-royal">
          <div className="pu-submission-header-royal">
            <div className="header-info">
              <div className="icon-box-royal"><FaPhone /></div>
              <div>
                <h3>Contact Submissions</h3>
                <p>Direct inquiries from contact forms</p>
              </div>
            </div>
          </div>
          <div className="pu-table-container-royal">
            <table className="pu-royal-data-table">
              <thead>
                <tr>
                  <th>DATE</th>
                  <th>NAME</th>
                  <th>SUBJECT</th>
                  <th>STATUS</th>
                </tr>
              </thead>
              <tbody>
                {(contactSubmissions || []).length > 0 ? contactSubmissions.map((sub, i) => (
                  <tr key={i}>
                    <td>{new Date(sub.created_at).toLocaleDateString()}</td>
                    <td>{sub.name}</td>
                    <td>{sub.subject}</td>
                    <td><span className={`pu-status-royal ${sub.status || 'new'}`}>{sub.status || 'New'}</span></td>
                  </tr>
                )) : (
                  <tr><td colSpan="4" className="pu-no-data-td">No contact inquiries found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Feedback Submissions */}
        <div className="pu-submission-section-royal" style={{ marginTop: '30px' }}>
          <div className="pu-submission-header-royal">
            <div className="header-info">
              <div className="icon-box-royal"><FaCommentDots /></div>
              <div>
                <h3>Feedback & Reviews</h3>
                <p>Customer testimonials and service feedback</p>
              </div>
            </div>
          </div>
          <div className="pu-table-container-royal">
            <table className="pu-royal-data-table">
              <thead>
                <tr>
                  <th>DATE</th>
                  <th>NAME</th>
                  <th>RATING</th>
                  <th>FEEDBACK</th>
                </tr>
              </thead>
              <tbody>
                {(feedbackSubmissions || []).length > 0 ? feedbackSubmissions.map((sub, i) => (
                  <tr key={i}>
                    <td>{new Date(sub.created_at).toLocaleDateString()}</td>
                    <td>{sub.name}</td>
                    <td>{'★'.repeat(sub.rating || 0)}{'☆'.repeat(5 - (sub.rating || 0))}</td>
                    <td title={sub.message || sub.feedback}>{sub.message || sub.feedback}</td>
                  </tr>
                )) : (
                  <tr><td colSpan="4" className="pu-no-data-td">No feedback submissions found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Order Requests */}
        <div className="pu-submission-section-royal" style={{ marginTop: '30px' }}>
          <div className="pu-submission-header-royal">
            <div className="header-info">
              <div className="icon-box-royal"><FaShoppingCart /></div>
              <div>
                <h3>Order Request Submissions</h3>
                <p>Custom furniture inquiries and requests</p>
              </div>
            </div>
          </div>
          <div className="pu-table-container-royal">
            <table className="pu-royal-data-table">
              <thead>
                <tr>
                  <th>DATE</th>
                  <th>NAME</th>
                  <th>PRODUCT TYPE</th>
                  <th>BUDGET</th>
                </tr>
              </thead>
              <tbody>
                {(orderRequestSubmissions || []).length > 0 ? orderRequestSubmissions.map((sub, i) => (
                  <tr key={i}>
                    <td>{new Date(sub.created_at).toLocaleDateString()}</td>
                    <td>{sub.name}</td>
                    <td>{sub.product_name || 'Custom Rendering'}</td>
                    <td>₹{(sub.budget_range || 0).toLocaleString()}</td>
                  </tr>
                )) : (
                  <tr><td colSpan="4" className="pu-no-data-td">No order requests found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmissionsTab;
