import React, { useState, useEffect, useCallback } from 'react';
import { FaPlus, FaTrash, FaEdit } from 'react-icons/fa';
import blogService from '../../services/blogService';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const UserBlogsTab = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isWriting, setIsWriting] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [currentBlog, setCurrentBlog] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    category: 'Interior Design',
    excerpt: '',
    content: '',
    image: null
  });

  const loadMyBlogs = useCallback(async () => {
    try {
      setLoading(true);
      const result = await blogService.getMyBlogs();
      if (result.success) {
        setBlogs(result.data || []);
      }
    } catch (err) {
      console.error('Failed to load journal entries:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMyBlogs();
  }, [loadMyBlogs]);

  const handleAddNew = () => {
    setCurrentBlog(null);
    setFormData({
      title: '',
      category: 'Interior Design',
      excerpt: '',
      content: '',
      image: null
    });
    setIsWriting(true);
  };

  const handleEdit = (blog) => {
    setCurrentBlog(blog);
    setFormData({
      title: blog.title,
      category: blog.category,
      excerpt: blog.excerpt,
      content: blog.content,
      image: null
    });
    setIsWriting(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this entry?')) {
      const result = await blogService.deleteBlog(id);
      if (result.success) loadMyBlogs();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);

    const data = new FormData();
    data.append('title', formData.title);
    data.append('category', formData.category);
    data.append('excerpt', formData.excerpt);
    data.append('content', formData.content);
    if (formData.image) data.append('image', formData.image);

    const result = currentBlog 
      ? await blogService.updateBlog(currentBlog.id, data)
      : await blogService.createBlog(data);

    if (result.success) {
      setIsWriting(false);
      loadMyBlogs();
    } else {
      alert(result.error);
    }
    setFormLoading(false);
  };

  if (loading && blogs.length === 0) return <LoadingSpinner message="Opening your journal..." />;

  if (isWriting) {
    return (
      <div className="user-blog-writer">
        <div className="user-profile-orders-header">
          <h2>{currentBlog ? 'Edit Your Story' : 'New Journal Entry'}</h2>
          <button onClick={() => setIsWriting(false)} className="user-profile-page-btn">
             Cancel
          </button>
        </div>

        <form onSubmit={handleSubmit} className="user-profile-form-container">
          <div className="user-profile-form-group" style={{ gridColumn: '1 / -1' }}>
            <label>Title</label>
            <input 
              type="text" 
              className="user-profile-form-input"
              value={formData.title} 
              onChange={(e) => setFormData({...formData, title: e.target.value})} 
              required 
              placeholder="Give your story a name..."
            />
          </div>

          <div className="user-profile-form-group">
            <label>Category</label>
            <select 
              className="user-profile-filter-select"
              value={formData.category} 
              onChange={(e) => setFormData({...formData, category: e.target.value})}
            >
              <option value="Interior Design">Interior Design</option>
              <option value="Craftsmanship">Craftsmanship</option>
              <option value="Care Guide">Care Guide</option>
              <option value="Trends">Trends</option>
            </select>
          </div>

          <div className="user-profile-form-group">
            <label>Feature Image</label>
            <input 
              type="file" 
              className="user-profile-form-input"
              onChange={(e) => setFormData({...formData, image: e.target.files[0]})} 
              accept="image/*"
            />
          </div>

          <div className="user-profile-form-group" style={{ gridColumn: '1 / -1' }}>
            <label>Short Excerpt</label>
            <textarea 
              className="user-profile-form-textarea"
              value={formData.excerpt} 
              onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
              rows="2"
              placeholder="A brief summary for the preview card..."
            ></textarea>
          </div>

          <div className="user-profile-form-group" style={{ gridColumn: '1 / -1' }}>
            <label>Full Content (HTML allowed)</label>
            <textarea 
              className="user-profile-form-textarea"
              value={formData.content} 
              onChange={(e) => setFormData({...formData, content: e.target.value})}
              rows="12"
              required
              placeholder="Share your design insights with our community..."
            ></textarea>
          </div>

          <div className="user-profile-actions-section" style={{ gridColumn: '1 / -1', textAlign: 'right' }}>
            <button type="submit" disabled={formLoading} className="user-profile-view-details-btn">
              {formLoading ? 'Submitting...' : currentBlog ? 'Update Entry' : 'Submit for Review'}
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="user-blogs-section">
      <div className="user-profile-orders-header">
        <div>
          <h2>My Contributions</h2>
          <p className="user-profile-email-display">Share your thoughts with the Bishwokarma community</p>
        </div>
        <button onClick={handleAddNew} className="user-profile-view-details-btn" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FaPlus size={12} /> Write Entry
        </button>
      </div>

      <div className="user-profile-orders-list">
        {blogs.length === 0 ? (
          <div className="user-profile-no-orders">
            <p>You haven't shared any journal entries yet. Be the first to start a conversation!</p>
          </div>
        ) : (
          blogs.map(blog => (
            <div key={blog.id} className="user-profile-order-card">
              <div className="user-profile-order-header">
                <div className="user-profile-order-info" style={{ display: 'flex', gap: '15px' }}>
                  {blog.image_url && <img src={blog.image_url} alt="" style={{ width: '60px', height: '60px', borderRadius: '12px', objectFit: 'cover' }} />}
                  <div>
                    <h3>{blog.title}</h3>
                    <p className="user-profile-order-date"> {new Date(blog.created_at).toLocaleDateString()} • {blog.category}</p>
                  </div>
                </div>
                <div className="user-profile-order-status">
                  <span className={`user-profile-status-badge`} style={{ 
                    backgroundColor: blog.status === 'published' ? '#22c55e' : blog.status === 'pending' ? '#f59e0b' : '#64748b'
                  }}>
                    {blog.status}
                  </span>
                </div>
              </div>
              <div className="user-profile-order-details" style={{ marginTop: '15px' }}>
                 <div className="user-profile-order-summary">
                   <p>{blog.views} People have read this</p>
                 </div>
                 <div className="user-profile-order-actions">
                   <button onClick={() => handleEdit(blog)} className="user-profile-page-btn">
                     <FaEdit /> Edit
                   </button>
                   <button onClick={() => handleDelete(blog.id)} className="user-profile-cancel-order-btn">
                     <FaTrash /> Remove
                   </button>
                 </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default UserBlogsTab;
