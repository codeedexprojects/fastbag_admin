import React, { useState, useEffect } from 'react';
import { Play, Calendar, User, Eye } from 'lucide-react';
import { listVendorStories,getStoryDetail } from '../../services/allApi';


const StoryList = ({ onSelectStory }) => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchStories();
  }, [currentPage]);

  const fetchStories = async () => {
    try {
      setLoading(true);
      const data = await listVendorStories(currentPage);
      setStories(data.results);
      setTotalPages(data.total_pages);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredStories = filterStatus === 'all' 
    ? stories 
    : stories.filter(s => s.is_active === (filterStatus === 'active'));

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-content">
          <div className="spinner"></div>
          <p className="loading-text">Loading stories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="content-wrapper">
        <div className="header">
          <h1>Vendor Stories</h1>
          <p>Manage and view all vendor story videos</p>
        </div>

        <div className="filter-card">
          <div className="filter-content">
            <span className="filter-label">Filter by status:</span>
            <div className="filter-buttons">
              {['all', 'active', 'inactive'].map(status => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`filter-button ${filterStatus === status ? 'active' : ''}`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="table-card">
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Vendor</th>
                  <th>Title</th>
                  <th>Description</th>
                  <th className="text-center">Created Date</th>
                  <th className="text-center">Status</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStories.map((story) => (
                  <tr key={story.id}>
                    <td>
                      <div className="vendor-cell">
                        <img
                          src={story.vendor_logo}
                          alt={story.vendor_name}
                          className="vendor-avatar"
                        />
                        <div className="vendor-info">
                          <p>{story.vendor_name}</p>
                          <p>ID: {story.vendor}</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="title-text">
                        {story.title || '-'}
                      </span>
                    </td>
                    <td>
                      <span className="description-text">
                        {story.description || '-'}
                      </span>
                    </td>
                    <td className="text-center">
                      <div className="date-cell">
                        <Calendar style={{ width: '16px', height: '16px' }} />
                        {story.created_at}
                      </div>
                    </td>
                    <td className="text-center">
                      <span className={`status-badge ${story.is_active ? 'status-active' : 'status-inactive'}`}>
                        {story.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <div className="actions-cell">
                        <button
                          onClick={() => onSelectStory(story.id)}
                          className="view-button"
                        >
                          <Eye style={{ width: '16px', height: '16px' }} />
                          View Details
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredStories.length === 0 && (
            <div className="empty-state">
              <Play style={{ width: '48px', height: '48px' }} />
              <p>No stories found</p>
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <div className="pagination">
            <button 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="pagination-btn"
            >
              Previous
            </button>
            <span className="page-info">Page {currentPage} of {totalPages}</span>
            <button 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="pagination-btn"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Story Detail Component
const StoryDetail = ({ storyId, onBack }) => {
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStoryDetail();
  }, [storyId]);

  const fetchStoryDetail = async () => {
    try {
      setLoading(true);
      const data = await getStoryDetail(storyId);
      setStory(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-content">
          <div className="spinner"></div>
          <p className="loading-text">Loading story...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <div className="content-wrapper">
          <button onClick={onBack} className="back-button">
            ← Back to Stories
          </button>
          <div className="error-message">Error: {error}</div>
        </div>
      </div>
    );
  }

  if (!story) {
    return null;
  }

  return (
    <div className="page-container">
      <div className="content-wrapper">
        <button onClick={onBack} className="back-button">
          ← Back to Stories
        </button>

        <div className="header">
          <h1>Story Details</h1>
          <p>View complete information about this vendor story</p>
        </div>

        <div className="detail-grid">
          <div className="detail-card video-card">
            <h3 className="card-title">Video</h3>
            <div className="video-wrapper">
              <video controls className="story-video" poster={story.thumbnail}>
                <source src={story.video} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>

          <div className="detail-card info-card">
            <h3 className="card-title">Story Information</h3>
            
            <div className="info-section">
              <div className="info-row">
                <span className="info-label">Vendor Name:</span>
                <span className="info-value">{story.vendor_name}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Vendor ID:</span>
                <span className="info-value">{story.vendor}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Story ID:</span>
                <span className="info-value">{story.id}</span>
              </div>
            </div>

            <div className="vendor-logo-section">
              <span className="info-label">Vendor Logo:</span>
              <img src={story.vendor_logo} alt={story.vendor_name} className="vendor-logo-large" />
            </div>
          </div>

          <div className="detail-card content-card">
            <h3 className="card-title">Content Details</h3>
            
            <div className="info-section">
              <div className="info-group">
                <span className="info-label">Title:</span>
                <p className="info-text">{story.title || 'No title provided'}</p>
              </div>
              
              <div className="info-group">
                <span className="info-label">Description:</span>
                <p className="info-text">{story.description || 'No description provided'}</p>
              </div>

              <div className="info-row">
                <span className="info-label">Created Date:</span>
                <div className="date-cell">
                  <Calendar style={{ width: '16px', height: '16px' }} />
                  {story.created_at}
                </div>
              </div>

              <div className="info-row">
                <span className="info-label">Status:</span>
                <span className={`status-badge ${story.is_active ? 'status-active' : 'status-inactive'}`}>
                  {story.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main App Component
export default function App() {
  const [selectedStoryId, setSelectedStoryId] = useState(null);

  return (
    <>
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
        }

        .page-container {
          min-height: 100vh;
          background-color: #f9fafb;
          padding: 24px;
        }

        .content-wrapper {
          max-width: 1280px;
          margin: 0 auto;
        }

        .header {
          margin-bottom: 32px;
        }

        .header h1 {
          font-size: 30px;
          font-weight: bold;
          color: #111827;
          margin-bottom: 8px;
        }

        .header p {
          color: #6b7280;
        }

        .back-button {
          padding: 10px 20px;
          background-color: #2563eb;
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          margin-bottom: 24px;
          transition: background-color 0.2s;
        }

        .back-button:hover {
          background-color: #1d4ed8;
        }

        .filter-card {
          background: white;
          border-radius: 8px;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
          padding: 16px;
          margin-bottom: 24px;
          border: 1px solid #e5e7eb;
        }

        .filter-content {
          display: flex;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
        }

        .filter-label {
          font-size: 14px;
          font-weight: 500;
          color: #374151;
        }

        .filter-buttons {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .filter-button {
          padding: 8px 16px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          border: none;
          cursor: pointer;
          transition: all 0.2s;
        }

        .filter-button.active {
          background-color: #2563eb;
          color: white;
        }

        .filter-button:not(.active) {
          background-color: #f3f4f6;
          color: #374151;
        }

        .filter-button:not(.active):hover {
          background-color: #e5e7eb;
        }

        .table-card {
          background: white;
          border-radius: 8px;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
          border: 1px solid #e5e7eb;
          overflow: hidden;
        }

        .table-wrapper {
          overflow-x: auto;
        }

        table {
          width: 100%;
          border-collapse: collapse;
        }

        thead {
          background-color: #f9fafb;
          border-bottom: 1px solid #e5e7eb;
        }

        th {
          padding: 16px 24px;
          text-align: left;
          font-size: 11px;
          font-weight: 500;
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        th.text-center {
          text-align: center;
        }

        tbody tr {
          border-bottom: 1px solid #e5e7eb;
          transition: background-color 0.2s;
        }

        tbody tr:hover {
          background-color: #f9fafb;
        }

        td {
          padding: 16px 24px;
        }

        .text-center {
          text-align: center;
        }

        .vendor-cell {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .vendor-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid #e5e7eb;
        }

        .vendor-info p:first-child {
          font-weight: 500;
          color: #111827;
          margin-bottom: 2px;
        }

        .vendor-info p:last-child {
          font-size: 14px;
          color: #6b7280;
        }

        .title-text {
          font-weight: 500;
          color: #111827;
        }

        .description-text {
          color: #6b7280;
          font-size: 14px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          max-width: 300px;
        }

        .date-cell {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
          font-size: 14px;
          color: #6b7280;
        }

        .status-badge {
          display: inline-flex;
          align-items: center;
          padding: 4px 12px;
          border-radius: 9999px;
          font-size: 12px;
          font-weight: 500;
        }

        .status-active {
          background-color: #dcfce7;
          color: #166534;
        }

        .status-inactive {
          background-color: #fee2e2;
          color: #991b1b;
        }

        .actions-cell {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .view-button {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 6px 12px;
          background-color: #2563eb;
          color: white;
          border-radius: 4px;
          font-size: 14px;
          font-weight: 500;
          border: none;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .view-button:hover {
          background-color: #1d4ed8;
        }

        .pagination {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 20px;
          margin-top: 24px;
          padding: 16px;
          background: white;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
        }

        .pagination-btn {
          padding: 8px 16px;
          background-color: #2563eb;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          transition: background-color 0.2s;
        }

        .pagination-btn:hover:not(:disabled) {
          background-color: #1d4ed8;
        }

        .pagination-btn:disabled {
          background-color: #9ca3af;
          cursor: not-allowed;
        }

        .page-info {
          font-weight: 500;
          color: #374151;
        }

        .empty-state {
          text-align: center;
          padding: 48px 0;
          color: #6b7280;
        }

        .empty-state svg {
          margin: 0 auto 16px;
          color: #9ca3af;
        }

        .loading-container {
          min-height: 100vh;
          background-color: #f9fafb;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .loading-content {
          text-align: center;
        }

        .spinner {
          width: 48px;
          height: 48px;
          border: 2px solid #e5e7eb;
          border-bottom-color: #2563eb;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .loading-text {
          margin-top: 16px;
          color: #6b7280;
        }

        .error-message {
          background-color: #fee2e2;
          color: #991b1b;
          padding: 16px;
          border-radius: 8px;
          text-align: center;
          margin-top: 20px;
        }

        .detail-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }

        .detail-card {
          background: white;
          border-radius: 8px;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
          border: 1px solid #e5e7eb;
          padding: 24px;
        }

        .video-card {
          grid-column: 1 / -1;
        }

        .card-title {
          font-size: 18px;
          font-weight: 600;
          color: #111827;
          margin-bottom: 16px;
          padding-bottom: 12px;
          border-bottom: 2px solid #e5e7eb;
        }

        .video-wrapper {
          width: 100%;
          max-width: 800px;
          margin: 0 auto;
        }

        .story-video {
          width: 100%;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }

        .info-section {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .info-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 0;
          border-bottom: 1px solid #f3f4f6;
        }

        .info-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
          padding: 12px 0;
          border-bottom: 1px solid #f3f4f6;
        }

        .info-label {
          font-size: 14px;
          font-weight: 500;
          color: #6b7280;
        }

        .info-value {
          font-size: 14px;
          font-weight: 500;
          color: #111827;
        }

        .info-text {
          font-size: 14px;
          color: #374151;
          line-height: 1.6;
        }

        .vendor-logo-section {
          display: flex;
          flex-direction: column;
          gap: 12px;
          padding-top: 16px;
        }

        .vendor-logo-large {
          width: 100px;
          height: 100px;
          border-radius: 12px;
          object-fit: cover;
          border: 2px solid #e5e7eb;
        }

        @media (max-width: 768px) {
          .page-container {
            padding: 16px;
          }

          .header h1 {
            font-size: 24px;
          }

          .detail-grid {
            grid-template-columns: 1fr;
          }

          .video-card {
            grid-column: 1;
          }

          .filter-content {
            flex-direction: column;
            align-items: flex-start;
          }

          .filter-buttons {
            width: 100%;
          }

          .filter-button {
            flex: 1;
          }

          table {
            font-size: 14px;
          }

          th, td {
            padding: 12px 16px;
          }

          .description-text {
            max-width: 200px;
          }
        }
      `}</style>

      {selectedStoryId ? (
        <StoryDetail storyId={selectedStoryId} onBack={() => setSelectedStoryId(null)} />
      ) : (
        <StoryList onSelectStory={setSelectedStoryId} />
      )}
    </>
  );
}