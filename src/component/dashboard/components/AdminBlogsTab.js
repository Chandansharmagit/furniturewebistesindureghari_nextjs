import React, { useState, useEffect, useCallback } from 'react';
import { FaPlus, FaTrash, FaEdit, FaCheck, FaTimes } from 'react-icons/fa';
import blogService from '../../../services/blogService';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import './AdminBlogsTab.css';

const AdminBlogsTab = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [currentBlog, setCurrentBlog] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    title: '',
    category: 'Interior Design',
    excerpt: '',
    content: '',
    image: null
  });

  const loadBlogs = useCallback(async () => {
    try {
      setLoading(true);
      const result = await blogService.getAdminBlogs();
      if (result.success) {
        setBlogs(result.data || []);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Failed to load blogs');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBlogs();
  }, [loadBlogs]);

  const handleStatusToggle = async (id, currentStatus) => {
    const newStatus = currentStatus === 'published' ? 'draft' : 'published';
    const result = await blogService.updateBlog(id, { status: newStatus });
    if (result.success) {
      loadBlogs();
    } else {
      alert(result.error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      const result = await blogService.deleteBlog(id);
      if (result.success) {
        loadBlogs();
      } else {
        alert(result.error);
      }
    }
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
    setIsEditing(true);
  };

  const handleAddNew = () => {
    setCurrentBlog(null);
    setFormData({
      title: '',
      category: 'Interior Design',
      excerpt: '',
      content: '',
      image: null
    });
    setIsEditing(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);

    const data = new FormData();
    data.append('title', formData.title);
    data.append('category', formData.category);
    data.append('excerpt', formData.excerpt);
    data.append('content', formData.content);
    if (formData.image) {
      data.append('image', formData.image);
    }

    let result;
    if (currentBlog) {
      result = await blogService.updateBlog(currentBlog.id, data);
    } else {
      result = await blogService.createBlog(data);
    }

    if (result.success) {
      setIsEditing(false);
      loadBlogs();
    } else {
      alert(result.error);
    }
    setFormLoading(false);
  };

  if (loading) return <LoadingSpinner message="Curating your content..." />;

  if (error) {
    return (
      <div className="admin-blogs-container">
        <div className="error-container">
          <div className="error-message">
            <h2>{error.includes('Unauthorized') || error.includes('token') ? 'Access Denied' : 'System Insight Lost'}</h2>
            <p>{error}</p>
            <button onClick={loadBlogs} className="add-blog-btn" style={{ margin: '0 auto' }}>Retry Fetch</button>
          </div>
        </div>
      </div>
    );
  }

  if (isEditing) {
    return (
      <div className="admin-blog-editor">
        <div className="pu-section-header-royal">
          <h2>{currentBlog ? 'Refine Masterpiece' : 'Draft New Inspiration'}</h2>
          <button onClick={() => setIsEditing(false)} className="cancel-btn">Back to Library</button>
        </div>

        <form onSubmit={handleSubmit} className="blog-form-royal">
          <div className="form-grid">
            <div className="form-group full-width">
              <label>Article Title</label>
              <input 
                type="text" 
                value={formData.title} 
                onChange={(e) => setFormData({...formData, title: e.target.value})} 
                required 
                placeholder="The Architecture of Comfort..."
              />
            </div>

            <div className="form-group">
              <label>Category</label>
              <select 
                value={formData.category} 
                onChange={(e) => setFormData({...formData, category: e.target.value})}
              >
                <option value="Interior Design">Interior Design</option>
                <option value="Craftsmanship">Craftsmanship</option>
                <option value="Care Guide">Care Guide</option>
                <option value="Trends">Trends</option>
                <option value="Company News">Company News</option>
              </select>
            </div>

            <div className="form-group">
              <label>Header Image</label>
              <input 
                type="file" 
                onChange={(e) => setFormData({...formData, image: e.target.files[0]})} 
                accept="image/*"
              />
              {currentBlog?.image_url && !formData.image && (
                <p className="image-hint">Current image will be kept.</p>
              )}
            </div>

            <div className="form-group full-width">
              <label>Search Excerpt (Short summary for cards)</label>
              <textarea 
                value={formData.excerpt} 
                onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
                rows="2"
                placeholder="A compelling sneak peek into the article..."
              ></textarea>
            </div>

            <div className="form-group full-width">
              <label>Body Content (HTML supported)</label>
              <textarea 
                value={formData.content} 
                onChange={(e) => setFormData({...formData, content: e.target.value})}
                rows="15"
                required
                placeholder="Write your story here. Use <h2> and <p> tags for formatting..."
              ></textarea>
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" disabled={formLoading} className="submit-btn">
              {formLoading ? 'Executing...' : currentBlog ? 'Update Article' : 'Publish Article'}
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="admin-blogs-container">
      <div className="pu-section-header-royal">
        <div className="header-text">
          <h2>The Journal Registry</h2>
          <p>Manage your site's editorial content and authority</p>
        </div>
        <button className="add-blog-btn" onClick={handleAddNew}>
          <FaPlus /> New Entry
        </button>
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Article</th>
              <th>Author</th>
              <th>Category</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {blogs.map(blog => (
              <tr key={blog.id}>
                <td>
                  <div className="blog-title-cell">
                    <img src={blog.image_url || 'https://via.placeholder.com/50'} alt="" />
                    <div>
                      <strong>{blog.title}</strong>
                      <span>{blog.views} views</span>
                    </div>
                  </div>
                </td>
                <td>{blog.first_name} {blog.last_name}</td>
                <td><span className="badge category">{blog.category}</span></td>
                <td>
                  <span className={`badge status ${blog.status}`}>
                    {blog.status}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button onClick={() => handleEdit(blog)} title="Edit"><FaEdit /></button>
                    <button onClick={() => handleStatusToggle(blog.id, blog.status)} title={blog.status === 'published' ? 'Unpublish' : 'Publish'}>
                      {blog.status === 'published' ? <FaTimes /> : <FaCheck />}
                    </button>
                    <button onClick={() => handleDelete(blog.id)} className="delete" title="Delete"><FaTrash /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {blogs.length === 0 && (
          <div className="empty-state">
            <p>Your journal is waiting for its first entry.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminBlogsTab;
